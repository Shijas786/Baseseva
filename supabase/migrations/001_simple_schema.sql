-- BaseSeva Database Schema - Simple Version
-- Web3 Blood Donation App

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
    phone TEXT,
    city TEXT,
    age INTEGER CHECK (age >= 18 AND age <= 65),
    donation_count INTEGER DEFAULT 0,
    last_donation TIMESTAMP WITH TIME ZONE,
    is_eligible BOOLEAN DEFAULT true,
    nft_count INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    impact_points INTEGER DEFAULT 0,
    profile_complete BOOLEAN DEFAULT false,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood requests table
CREATE TABLE blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
    hospital TEXT NOT NULL,
    contact TEXT NOT NULL,
    description TEXT,
    units_needed INTEGER DEFAULT 1 CHECK (units_needed > 0),
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('critical', 'urgent', 'normal')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    city TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired', 'cancelled')),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
    donation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    certificate_url TEXT,
    nft_token_id TEXT,
    verified BOOLEAN DEFAULT false,
    impact_points INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood banks table
CREATE TABLE blood_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    open_hours JSONB, -- Store as JSON for flexible hours
    blood_types TEXT[] DEFAULT '{}', -- Array of supported blood types
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closing_soon', 'closed')),
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    verified BOOLEAN DEFAULT false,
    emergency BOOLEAN DEFAULT false,
    inventory JSONB DEFAULT '{}', -- Store inventory levels as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('blood_request', 'donation_verified', 'nft_minted', 'emergency_alert', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional data for the notification
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation responses table (for tracking who responded to blood requests)
CREATE TABLE donation_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES blood_requests(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, donor_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_blood_type ON users(blood_type);
CREATE INDEX idx_users_city ON users(city);

CREATE INDEX idx_blood_requests_blood_type ON blood_requests(blood_type);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_blood_requests_created_at ON blood_requests(created_at);

CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_donation_date ON donations(donation_date);
CREATE INDEX idx_donations_verified ON donations(verified);

CREATE INDEX idx_blood_banks_status ON blood_banks(status);
CREATE INDEX idx_blood_banks_verified ON blood_banks(verified);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_donation_responses_request_id ON donation_responses(request_id);
CREATE INDEX idx_donation_responses_donor_id ON donation_responses(donor_id);
CREATE INDEX idx_donation_responses_status ON donation_responses(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON blood_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_banks_updated_at BEFORE UPDATE ON blood_banks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donation_responses_updated_at BEFORE UPDATE ON donation_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blood banks data
INSERT INTO blood_banks (name, address, phone, latitude, longitude, open_hours, blood_types, status, rating, verified, emergency, inventory) VALUES
('Kerala State Blood Transfusion Council', 'Medical College Campus, Thiruvananthapuram, Kerala 695011', '+91 471 2524251', 8.5241, 76.9366, '{"24_hours": true}', ARRAY['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], 'open', 4.8, true, true, '{"O+": "high", "O-": "medium", "A+": "high", "A-": "low", "B+": "medium", "B-": "critical", "AB+": "low", "AB-": "critical"}'),
('IMA Blood Bank - Kochi', 'IMA House, Kaloor, Ernakulam, Kochi, Kerala 682017', '+91 484 2345678', 9.9312, 76.2673, '{"start": "06:00", "end": "22:00"}', ARRAY['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], 'open', 4.6, true, false, '{"O+": "medium", "O-": "low", "A+": "high", "A-": "medium", "B+": "high", "B-": "low", "AB+": "medium", "AB-": "low"}'),
('Kozhikode Medical College Blood Bank', 'Medical College, Kozhikode, Kerala 673008', '+91 495 2359126', 11.2588, 75.7804, '{"start": "08:00", "end": "20:00"}', ARRAY['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], 'closing_soon', 4.4, true, false, '{"O+": "low", "O-": "critical", "A+": "medium", "A-": "low", "B+": "medium", "B-": "critical", "AB+": "low", "AB-": "critical"}');
