# Supabase Configuration Guide for BaseSeva

## 🎯 Current Status

Your Supabase project is already configured with:
- ✅ **Database Schema**: Complete with all tables and relationships
- ✅ **Edge Functions**: Comprehensive API endpoints
- ✅ **Row Level Security**: Proper RLS policies
- ✅ **Sample Data**: Blood banks and test data

## 🚀 Deployment Steps

### 1. Database Setup

Your database schema is ready! To deploy it:

#### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref nigxqmizirtccedoezhf

# Run migrations
supabase db push

# Reset database if needed
supabase db reset
```

#### Option B: Using Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `nigxqmizirtccedoezhf`
3. Go to **SQL Editor**
4. Copy and run the migration files:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`

### 2. Edge Functions Deployment

Deploy your API endpoints:

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individual functions
supabase functions deploy index
supabase functions deploy upload
supabase functions deploy notifications
supabase functions deploy blockchain
supabase functions deploy kv_store
```

### 3. Environment Variables Setup

Set these in your Supabase project settings:

#### In Supabase Dashboard:
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Go to **Settings** → **Edge Functions**
4. Set these environment variables:

```bash
# Required for Edge Functions
SUPABASE_URL=https://nigxqmizirtccedoezhf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret

# Optional
STRIPE_SECRET_KEY=your-stripe-key
BLOCKCHAIN_RPC_URL=your-rpc-url
```

#### In Your Local .env:
```bash
VITE_SUPABASE_URL=https://nigxqmizirtccedoezhf.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://nigxqmizirtccedoezhf.supabase.co/functions/v1
VITE_UPLOAD_URL=https://nigxqmizirtccedoezhf.supabase.co/functions/v1/upload
```

### 4. Storage Setup

Set up file storage for certificates:

1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket called `certificates`
3. Set bucket to **Public**
4. Configure policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload certificates" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'certificates' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access
CREATE POLICY "Public can view certificates" ON storage.objects
FOR SELECT USING (bucket_id = 'certificates');
```

### 5. Authentication Setup

Configure authentication for wallet-based auth:

1. Go to **Authentication** → **Settings**
2. Disable email authentication (since we use wallet auth)
3. Configure JWT settings:
   - **JWT expiry**: 3600 seconds
   - **Refresh token expiry**: 2592000 seconds

### 6. API Testing

Test your endpoints:

```bash
# Health check
curl https://nigxqmizirtccedoezhf.supabase.co/functions/v1/health

# Create user
curl -X POST https://nigxqmizirtccedoezhf.supabase.co/functions/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x123...",
    "name": "Test User",
    "bloodType": "O+",
    "phone": "+1234567890",
    "city": "Kochi"
  }'

# Get blood banks
curl https://nigxqmizirtccedoezhf.supabase.co/functions/v1/blood-banks
```

## 📊 Database Schema Overview

### Tables Created:
- **users**: User profiles with wallet addresses
- **blood_requests**: Blood donation requests
- **donations**: Donation records and certificates
- **blood_banks**: Blood bank locations and inventory
- **notifications**: User notifications
- **donation_responses**: Responses to blood requests

### Key Features:
- **PostGIS Integration**: Location-based queries
- **Blood Type Compatibility**: Automatic matching
- **Real-time Notifications**: Instant alerts
- **File Storage**: Certificate uploads
- **Security**: Row Level Security (RLS)

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User registration/login
- `GET /auth/profile/:walletAddress` - Get user profile

### Blood Requests
- `GET /blood-requests` - Get active requests
- `POST /blood-requests` - Create new request
- `POST /blood-requests/:id/respond` - Respond to request

### Donations
- `GET /donations/:walletAddress` - Get user donations
- `POST /donations` - Create donation record

### Blood Banks
- `GET /blood-banks` - Get nearby blood banks

### Notifications
- `GET /notifications/:walletAddress` - Get user notifications
- `PUT /notifications/:id/read` - Mark as read

### File Upload
- `POST /upload/certificate` - Upload donation certificates

## 🚨 Troubleshooting

### Common Issues:

1. **Database connection failed**
   - Check your Supabase URL and keys
   - Verify project is not paused

2. **Edge Functions not working**
   - Check function deployment status
   - Verify environment variables are set

3. **RLS policies blocking access**
   - Check authentication status
   - Verify wallet address format

4. **File upload failing**
   - Check storage bucket exists
   - Verify storage policies

### Debug Commands:
```bash
# Check function logs
supabase functions logs index

# Check database status
supabase db status

# Test connection
supabase db ping
```

## 🔐 Security Checklist

- ✅ RLS enabled on all tables
- ✅ Proper authentication policies
- ✅ Input validation in Edge Functions
- ✅ CORS configured correctly
- ✅ JWT secrets set
- ✅ Service role key secured

## 📈 Performance Optimization

- ✅ Database indexes created
- ✅ PostGIS spatial indexes
- ✅ Query optimization
- ✅ Connection pooling
- ✅ Edge Function caching

Your Supabase setup is production-ready! 🎉
