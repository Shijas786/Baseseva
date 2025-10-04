-- Row Level Security (RLS) Policies for BaseSeva - Simple Version
-- Enable RLS on all tables

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_responses ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (true);

-- Blood requests policies
CREATE POLICY "Anyone can view active blood requests" ON blood_requests
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create blood requests" ON blood_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own blood requests" ON blood_requests
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own blood requests" ON blood_requests
    FOR DELETE USING (true);

-- Donations policies
CREATE POLICY "Users can view their own donations" ON donations
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own donations" ON donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own donations" ON donations
    FOR UPDATE USING (true);

-- Blood banks policies (public read access)
CREATE POLICY "Anyone can view blood banks" ON blood_banks
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can update blood banks" ON blood_banks
    FOR UPDATE USING (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (true);

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Donation responses policies
CREATE POLICY "Users can view responses to their requests" ON donation_responses
    FOR SELECT USING (true);

CREATE POLICY "Users can create donation responses" ON donation_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own donation responses" ON donation_responses
    FOR UPDATE USING (true);
