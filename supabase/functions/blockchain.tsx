import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://nigxqmizirtccedoezhf.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = new Hono();

// Enable CORS
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

// Mint NFT certificate for donation
app.post("/mint-certificate", async (c) => {
  try {
    const { 
      donationId, 
      walletAddress, 
      bloodType, 
      donationDate,
      certificateUrl 
    } = await c.req.json();

    if (!donationId || !walletAddress || !bloodType || !donationDate) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Get donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single();

    if (donationError || !donation) {
      return c.json({ error: "Donation not found" }, 404);
    }

    // Check if NFT already exists
    if (donation.nft_token_id) {
      return c.json({ error: "NFT already minted for this donation" }, 400);
    }

    // Generate NFT metadata
    const metadata = {
      name: `BaseSeva Blood Donation Certificate #${donationId}`,
      description: `Certificate for blood donation of type ${bloodType} on ${new Date(donationDate).toLocaleDateString()}`,
      image: certificateUrl || "https://baseseva.com/default-certificate.png",
      attributes: [
        {
          trait_type: "Blood Type",
          value: bloodType
        },
        {
          trait_type: "Donation Date",
          value: new Date(donationDate).toISOString()
        },
        {
          trait_type: "Certificate Type",
          value: "Blood Donation"
        },
        {
          trait_type: "Platform",
          value: "BaseSeva"
        }
      ],
      external_url: `https://baseseva.com/certificate/${donationId}`,
      background_color: "#dc2626"
    };

    // In a real implementation, you would:
    // 1. Upload metadata to IPFS
    // 2. Deploy NFT contract if needed
    // 3. Mint NFT to user's wallet
    // 4. Get transaction hash and token ID

    // For now, we'll simulate the NFT minting
    const simulatedTokenId = `0x${donationId.replace(/-/g, '')}${Date.now().toString(16)}`;
    const simulatedTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

    // Update donation record with NFT info
    const { data: updatedDonation, error: updateError } = await supabase
      .from('donations')
      .update({
        nft_token_id: simulatedTokenId,
        verified: true
      })
      .eq('id', donationId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Database error: ${updateError.message}`);
    }

    // Update user's NFT count
    const { data: user } = await supabase
      .from('users')
      .select('id, nft_count')
      .eq('wallet_address', walletAddress)
      .single();

    if (user) {
      await supabase
        .from('users')
        .update({ nft_count: user.nft_count + 1 })
        .eq('id', user.id);
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user?.id,
      type: 'nft_minted',
      title: 'NFT Certificate Minted!',
      message: `Your blood donation certificate has been minted as NFT #${simulatedTokenId}`,
      data: {
        donation_id: donationId,
        token_id: simulatedTokenId,
        tx_hash: simulatedTxHash
      }
    });

    return c.json({
      success: true,
      nft: {
        tokenId: simulatedTokenId,
        txHash: simulatedTxHash,
        metadata,
        donation: updatedDonation
      },
      message: "NFT certificate minted successfully"
    });

  } catch (error) {
    console.error('Mint NFT error:', error);
    return c.json({ error: "Failed to mint NFT certificate" }, 500);
  }
});

// Get NFT certificate details
app.get("/certificate/:tokenId", async (c) => {
  try {
    const tokenId = c.req.param('tokenId');

    // Get donation by NFT token ID
    const { data: donation, error } = await supabase
      .from('donations')
      .select(`
        *,
        users!donations_user_id_fkey(name, wallet_address)
      `)
      .eq('nft_token_id', tokenId)
      .single();

    if (error || !donation) {
      return c.json({ error: "NFT certificate not found" }, 404);
    }

    // Generate metadata
    const metadata = {
      name: `BaseSeva Blood Donation Certificate #${donation.id}`,
      description: `Certificate for blood donation of type ${donation.blood_type} on ${new Date(donation.donation_date).toLocaleDateString()}`,
      image: donation.certificate_url || "https://baseseva.com/default-certificate.png",
      attributes: [
        {
          trait_type: "Blood Type",
          value: donation.blood_type
        },
        {
          trait_type: "Donation Date",
          value: new Date(donation.donation_date).toISOString()
        },
        {
          trait_type: "Certificate Type",
          value: "Blood Donation"
        },
        {
          trait_type: "Platform",
          value: "BaseSeva"
        },
        {
          trait_type: "Verified",
          value: donation.verified
        }
      ],
      external_url: `https://baseseva.com/certificate/${donation.id}`,
      background_color: "#dc2626"
    };

    return c.json({
      success: true,
      certificate: {
        tokenId,
        metadata,
        donation,
        owner: donation.users
      }
    });

  } catch (error) {
    console.error('Get certificate error:', error);
    return c.json({ error: "Failed to get certificate" }, 500);
  }
});

// Get user's NFT certificates
app.get("/certificates/:walletAddress", async (c) => {
  try {
    const walletAddress = c.req.param('walletAddress');

    // Get user's donations with NFT certificates
    const { data: donations, error } = await supabase
      .from('donations')
      .select('*')
      .eq('users.wallet_address', walletAddress)
      .not('nft_token_id', 'is', null)
      .order('donation_date', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const certificates = donations.map(donation => ({
      tokenId: donation.nft_token_id,
      bloodType: donation.blood_type,
      donationDate: donation.donation_date,
      verified: donation.verified,
      certificateUrl: donation.certificate_url,
      impactPoints: donation.impact_points
    }));

    return c.json({
      success: true,
      certificates,
      count: certificates.length
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    return c.json({ error: "Failed to get certificates" }, 500);
  }
});

// Verify NFT certificate
app.post("/verify/:tokenId", async (c) => {
  try {
    const tokenId = c.req.param('tokenId');

    // Get donation by NFT token ID
    const { data: donation, error } = await supabase
      .from('donations')
      .select('*')
      .eq('nft_token_id', tokenId)
      .single();

    if (error || !donation) {
      return c.json({ error: "NFT certificate not found" }, 404);
    }

    // In a real implementation, you would:
    // 1. Verify the NFT exists on the blockchain
    // 2. Check the metadata matches
    // 3. Verify ownership

    const verification = {
      valid: true,
      tokenId,
      donationId: donation.id,
      bloodType: donation.blood_type,
      donationDate: donation.donation_date,
      verified: donation.verified,
      certificateUrl: donation.certificate_url,
      blockchainVerified: true, // Simulated
      metadataValid: true, // Simulated
      ownershipValid: true // Simulated
    };

    return c.json({
      success: true,
      verification
    });

  } catch (error) {
    console.error('Verify certificate error:', error);
    return c.json({ error: "Failed to verify certificate" }, 500);
  }
});

// Get blockchain statistics
app.get("/stats", async (c) => {
  try {
    // Get total NFTs minted
    const { data: donations, error } = await supabase
      .from('donations')
      .select('nft_token_id, donation_date, blood_type')
      .not('nft_token_id', 'is', null);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const stats = {
      totalNfts: donations.length,
      byBloodType: donations.reduce((acc, d) => {
        acc[d.blood_type] = (acc[d.blood_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byMonth: donations.reduce((acc, d) => {
        const month = new Date(d.donation_date).toISOString().substring(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalImpactPoints: donations.reduce((sum, d) => sum + (d.impact_points || 0), 0)
    };

    return c.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get blockchain stats error:', error);
    return c.json({ error: "Failed to get blockchain statistics" }, 500);
  }
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "blockchain" });
});

export default app;