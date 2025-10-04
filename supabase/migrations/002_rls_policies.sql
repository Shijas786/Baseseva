-- Row Level Security (RLS) Policies for BaseSeva
-- Enable RLS on all tables

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_responses ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = wallet_address);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = wallet_address);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = wallet_address);

-- Blood requests policies
CREATE POLICY "Anyone can view active blood requests" ON blood_requests
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create blood requests" ON blood_requests
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own blood requests" ON blood_requests
    FOR UPDATE USING (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own blood requests" ON blood_requests
    FOR DELETE USING (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

-- Donations policies
CREATE POLICY "Users can view their own donations" ON donations
    FOR SELECT USING (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

CREATE POLICY "Users can create their own donations" ON donations
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own donations" ON donations
    FOR UPDATE USING (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

-- Blood banks policies (public read access)
CREATE POLICY "Anyone can view blood banks" ON blood_banks
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can update blood banks" ON blood_banks
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = user_id));

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Donation responses policies
CREATE POLICY "Users can view responses to their requests" ON donation_responses
    FOR SELECT USING (
        auth.uid()::text = (SELECT wallet_address FROM users WHERE id = (SELECT user_id FROM blood_requests WHERE id = request_id))
        OR auth.uid()::text = (SELECT wallet_address FROM users WHERE id = donor_id)
    );

CREATE POLICY "Users can create donation responses" ON donation_responses
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = donor_id));

CREATE POLICY "Users can update their own donation responses" ON donation_responses
    FOR UPDATE USING (auth.uid()::text = (SELECT wallet_address FROM users WHERE id = donor_id));

-- Create a function to get user by wallet address
CREATE OR REPLACE FUNCTION get_user_by_wallet(wallet_addr TEXT)
RETURNS TABLE(id UUID, wallet_address TEXT, name TEXT, email TEXT, blood_type TEXT, phone TEXT, city TEXT, age INTEGER, donation_count INTEGER, last_donation TIMESTAMP WITH TIME ZONE, is_eligible BOOLEAN, nft_count INTEGER, streak INTEGER, impact_points INTEGER, profile_complete BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.wallet_address, u.name, u.email, u.blood_type, u.phone, u.city, u.age, u.donation_count, u.last_donation, u.is_eligible, u.nft_count, u.streak, u.impact_points, u.profile_complete, u.created_at, u.updated_at
    FROM users u
    WHERE u.wallet_address = wallet_addr;
END;
$$;

-- Create a function to get nearby blood banks
CREATE OR REPLACE FUNCTION get_nearby_blood_banks(user_lat FLOAT, user_lng FLOAT, radius_km FLOAT DEFAULT 50)
RETURNS TABLE(id UUID, name TEXT, address TEXT, phone TEXT, coordinates POINT, open_hours JSONB, blood_types TEXT[], status TEXT, rating DECIMAL, verified BOOLEAN, emergency BOOLEAN, inventory JSONB, distance_km FLOAT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bb.id, bb.name, bb.address, bb.phone, bb.coordinates, bb.open_hours, bb.blood_types, bb.status, bb.rating, bb.verified, bb.emergency, bb.inventory,
        ST_Distance(
            ST_Transform(ST_SetSRID(ST_Point(user_lng, user_lat), 4326), 3857),
            ST_Transform(ST_SetSRID(bb.coordinates, 4326), 3857)
        ) / 1000 as distance_km
    FROM blood_banks bb
    WHERE ST_DWithin(
        ST_Transform(ST_SetSRID(ST_Point(user_lng, user_lat), 4326), 3857),
        ST_Transform(ST_SetSRID(bb.coordinates, 4326), 3857),
        radius_km * 1000
    )
    ORDER BY distance_km;
END;
$$;

-- Create a function to get compatible blood requests
CREATE OR REPLACE FUNCTION get_compatible_blood_requests(user_blood_type TEXT, user_lat FLOAT DEFAULT NULL, user_lng FLOAT DEFAULT NULL, radius_km FLOAT DEFAULT 50)
RETURNS TABLE(id UUID, user_id UUID, patient_name TEXT, blood_type TEXT, hospital TEXT, contact TEXT, description TEXT, units_needed INTEGER, urgency TEXT, location POINT, city TEXT, status TEXT, verified BOOLEAN, created_at TIMESTAMP WITH TIME ZONE, expires_at TIMESTAMP WITH TIME ZONE, distance_km FLOAT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        br.id, br.user_id, br.patient_name, br.blood_type, br.hospital, br.contact, br.description, br.units_needed, br.urgency, br.location, br.city, br.status, br.verified, br.created_at, br.expires_at,
        CASE 
            WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND br.location IS NOT NULL THEN
                ST_Distance(
                    ST_Transform(ST_SetSRID(ST_Point(user_lng, user_lat), 4326), 3857),
                    ST_Transform(ST_SetSRID(br.location, 4326), 3857)
                ) / 1000
            ELSE NULL
        END as distance_km
    FROM blood_requests br
    WHERE br.status = 'active' 
    AND br.expires_at > NOW()
    AND (
        -- Blood type compatibility rules
        (user_blood_type = 'O-' AND br.blood_type IN ('O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'))
        OR (user_blood_type = 'O+' AND br.blood_type IN ('O+', 'A+', 'B+', 'AB+'))
        OR (user_blood_type = 'A-' AND br.blood_type IN ('A-', 'A+', 'AB-', 'AB+'))
        OR (user_blood_type = 'A+' AND br.blood_type IN ('A+', 'AB+'))
        OR (user_blood_type = 'B-' AND br.blood_type IN ('B-', 'B+', 'AB-', 'AB+'))
        OR (user_blood_type = 'B+' AND br.blood_type IN ('B+', 'AB+'))
        OR (user_blood_type = 'AB-' AND br.blood_type IN ('AB-', 'AB+'))
        OR (user_blood_type = 'AB+' AND br.blood_type = 'AB+')
    )
    AND (
        user_lat IS NULL OR user_lng IS NULL OR br.location IS NULL OR
        ST_DWithin(
            ST_Transform(ST_SetSRID(ST_Point(user_lng, user_lat), 4326), 3857),
            ST_Transform(ST_SetSRID(br.location, 4326), 3857),
            radius_km * 1000
        )
    )
    ORDER BY 
        CASE br.urgency 
            WHEN 'critical' THEN 1 
            WHEN 'urgent' THEN 2 
            WHEN 'normal' THEN 3 
        END,
        CASE 
            WHEN distance_km IS NOT NULL THEN distance_km 
            ELSE 999 
        END;
END;
$$;