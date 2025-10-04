import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { jwt } from "npm:hono/jwt";
import { createClient } from "npm:@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://nigxqmizirtccedoezhf.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// JWT middleware for authentication
const jwtMiddleware = jwt({
  secret: Deno.env.get('JWT_SECRET') || 'your-secret-key',
});

// Helper function to get user from wallet address
async function getUserByWallet(walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
}

// Helper function to create or update user
async function upsertUser(userData: any) {
  const { data, error } = await supabase
    .from('users')
    .upsert(userData, { onConflict: 'wallet_address' })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  
  return data;
}

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// User registration/login
app.post("/auth/login", async (c) => {
  try {
    const { walletAddress, name, email, bloodType, phone, city, age } = await c.req.json();
    
    if (!walletAddress) {
      return c.json({ error: "Wallet address is required" }, 400);
    }

    // Check if user exists
    let user = await getUserByWallet(walletAddress);
    
    if (!user) {
      // Create new user
      const newUser = {
        wallet_address: walletAddress,
        name: name || 'Anonymous',
        email: email || null,
        blood_type: bloodType || 'O+',
        phone: phone || null,
        city: city || null,
        age: age || null,
        profile_complete: !!(name && bloodType && phone && city && age)
      };
      
      user = await upsertUser(newUser);
    } else {
      // Update existing user if new data provided
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (bloodType) updates.blood_type = bloodType;
      if (phone) updates.phone = phone;
      if (city) updates.city = city;
      if (age) updates.age = age;
      
      if (Object.keys(updates).length > 0) {
        updates.profile_complete = !!(updates.name || user.name) && 
                                  !!(updates.blood_type || user.blood_type) && 
                                  !!(updates.phone || user.phone) && 
                                  !!(updates.city || user.city) && 
                                  !!(updates.age || user.age);
        
        user = await upsertUser({ ...user, ...updates });
      }
    }

    return c.json({ 
      success: true, 
      user,
      message: user.profile_complete ? "Profile complete" : "Profile incomplete"
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// Get user profile
app.get("/auth/profile/:walletAddress", async (c) => {
  try {
    const walletAddress = c.req.param('walletAddress');
    const user = await getUserByWallet(walletAddress);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json({ success: true, user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// ==================== BLOOD REQUESTS ENDPOINTS ====================

// Get all active blood requests
app.get("/blood-requests", async (c) => {
  try {
    const { bloodType, lat, lng, radius = 50 } = c.req.query();
    
    let query = supabase
      .from('blood_requests')
      .select(`
        *,
        users!blood_requests_user_id_fkey(name, blood_type, city)
      `)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('urgency', { ascending: true })
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Filter by blood type compatibility if provided
    let filteredData = data;
    if (bloodType) {
      filteredData = data.filter((request: any) => {
        const compatibility = {
          'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
          'O+': ['O+', 'A+', 'B+', 'AB+'],
          'A-': ['A-', 'A+', 'AB-', 'AB+'],
          'A+': ['A+', 'AB+'],
          'B-': ['B-', 'B+', 'AB-', 'AB+'],
          'B+': ['B+', 'AB+'],
          'AB-': ['AB-', 'AB+'],
          'AB+': ['AB+']
        };
        return compatibility[bloodType as keyof typeof compatibility]?.includes(request.blood_type);
      });
    }

    return c.json({ success: true, requests: filteredData });
  } catch (error) {
    console.error('Blood requests fetch error:', error);
    return c.json({ error: "Failed to fetch blood requests" }, 500);
  }
});

// Create blood request
app.post("/blood-requests", async (c) => {
  try {
    const { 
      walletAddress, 
      patientName, 
      bloodType, 
      hospital, 
      contact, 
      description, 
      unitsNeeded = 1, 
      urgency = 'normal',
      lat,
      lng,
      city
    } = await c.req.json();

    if (!walletAddress || !patientName || !bloodType || !hospital || !contact) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Get user
    const user = await getUserByWallet(walletAddress);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const requestData = {
      user_id: user.id,
      patient_name: patientName,
      blood_type: bloodType,
      hospital,
      contact,
      description: description || null,
      units_needed: unitsNeeded,
      urgency,
      city: city || user.city,
      location: lat && lng ? `POINT(${lng} ${lat})` : null,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    const { data, error } = await supabase
      .from('blood_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Create notification for compatible donors
    const { data: compatibleUsers } = await supabase
      .from('users')
      .select('id, wallet_address, name')
      .neq('wallet_address', walletAddress)
      .eq('is_eligible', true);

    if (compatibleUsers && compatibleUsers.length > 0) {
      const notifications = compatibleUsers.map((donor: any) => ({
        user_id: donor.id,
        type: 'blood_request',
        title: 'New Blood Request',
        message: `${patientName} needs ${bloodType} blood at ${hospital}`,
        data: { request_id: data.id, urgency }
      }));

      await supabase.from('notifications').insert(notifications);
    }

    return c.json({ success: true, request: data });
  } catch (error) {
    console.error('Blood request creation error:', error);
    return c.json({ error: "Failed to create blood request" }, 500);
  }
});

// Respond to blood request
app.post("/blood-requests/:requestId/respond", async (c) => {
  try {
    const requestId = c.req.param('requestId');
    const { walletAddress, message } = await c.req.json();

    if (!walletAddress) {
      return c.json({ error: "Wallet address is required" }, 400);
    }

    // Get user
    const user = await getUserByWallet(walletAddress);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if request exists and is active
    const { data: request, error: requestError } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('id', requestId)
      .eq('status', 'active')
      .single();

    if (requestError || !request) {
      return c.json({ error: "Blood request not found or inactive" }, 404);
    }

    // Create response
    const { data, error } = await supabase
      .from('donation_responses')
      .insert({
        request_id: requestId,
        donor_id: user.id,
        message: message || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return c.json({ error: "You have already responded to this request" }, 400);
      }
      throw new Error(`Database error: ${error.message}`);
    }

    // Notify request creator
    await supabase.from('notifications').insert({
      user_id: request.user_id,
      type: 'blood_request',
      title: 'New Donor Response',
      message: `${user.name} wants to help with your blood request`,
      data: { response_id: data.id, donor_name: user.name }
    });

    return c.json({ success: true, response: data });
  } catch (error) {
    console.error('Blood request response error:', error);
    return c.json({ error: "Failed to respond to blood request" }, 500);
  }
});

// ==================== DONATIONS ENDPOINTS ====================

// Get user donations
app.get("/donations/:walletAddress", async (c) => {
  try {
    const walletAddress = c.req.param('walletAddress');
    const user = await getUserByWallet(walletAddress);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', user.id)
      .order('donation_date', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return c.json({ success: true, donations: data });
  } catch (error) {
    console.error('Donations fetch error:', error);
    return c.json({ error: "Failed to fetch donations" }, 500);
  }
});

// Create donation record
app.post("/donations", async (c) => {
  try {
    const { 
      walletAddress, 
      bloodType, 
      donationDate, 
      certificateUrl, 
      nftTokenId 
    } = await c.req.json();

    if (!walletAddress || !bloodType || !donationDate) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Get user
    const user = await getUserByWallet(walletAddress);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const donationData = {
      user_id: user.id,
      blood_type: bloodType,
      donation_date: donationDate,
      certificate_url: certificateUrl || null,
      nft_token_id: nftTokenId || null,
      verified: false,
      impact_points: 10
    };

    const { data, error } = await supabase
      .from('donations')
      .insert(donationData)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Update user stats
    await supabase
      .from('users')
      .update({
        donation_count: user.donation_count + 1,
        last_donation: donationDate,
        nft_count: nftTokenId ? user.nft_count + 1 : user.nft_count,
        impact_points: user.impact_points + 10
      })
      .eq('id', user.id);

    return c.json({ success: true, donation: data });
  } catch (error) {
    console.error('Donation creation error:', error);
    return c.json({ error: "Failed to create donation record" }, 500);
  }
});

// ==================== BLOOD BANKS ENDPOINTS ====================

// Get blood banks
app.get("/blood-banks", async (c) => {
  try {
    const { lat, lng, radius = 50 } = c.req.query();
    
    let query = supabase
      .from('blood_banks')
      .select('*')
      .order('rating', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // If location provided, calculate distances
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      const banksWithDistance = data.map((bank: any) => {
        const bankLng = parseFloat(bank.coordinates.split(' ')[0].replace('POINT(', ''));
        const bankLat = parseFloat(bank.coordinates.split(' ')[1].replace(')', ''));
        
        const distance = calculateDistance(userLat, userLng, bankLat, bankLng);
        
        return {
          ...bank,
          distance_km: distance,
          within_radius: distance <= radiusKm
        };
      }).filter((bank: any) => bank.within_radius)
       .sort((a: any, b: any) => a.distance_km - b.distance_km);

      return c.json({ success: true, bloodBanks: banksWithDistance });
    }

    return c.json({ success: true, bloodBanks: data });
  } catch (error) {
    console.error('Blood banks fetch error:', error);
    return c.json({ error: "Failed to fetch blood banks" }, 500);
  }
});

// ==================== NOTIFICATIONS ENDPOINTS ====================

// Get user notifications
app.get("/notifications/:walletAddress", async (c) => {
  try {
    const walletAddress = c.req.param('walletAddress');
    const { unread } = c.req.query();
    
    const user = await getUserByWallet(walletAddress);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (unread === 'true') {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return c.json({ success: true, notifications: data });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return c.json({ error: "Failed to fetch notifications" }, 500);
  }
});

// Mark notification as read
app.put("/notifications/:notificationId/read", async (c) => {
  try {
    const notificationId = c.req.param('notificationId');
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return c.json({ success: true, notification: data });
  } catch (error) {
    console.error('Notification update error:', error);
    return c.json({ error: "Failed to update notification" }, 500);
  }
});

// ==================== UTILITY FUNCTIONS ====================

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: "Internal server error" }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Endpoint not found" }, 404);
});

Deno.serve(app.fetch);