#!/bin/bash

# BaseSeva Backend Deployment Script
# This script deploys the complete backend infrastructure

set -e

echo "🚀 Starting BaseSeva Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        print_warning "Please update .env file with your actual credentials"
    else
        print_error "env.example file not found. Please create .env file manually"
        exit 1
    fi
fi

print_status "Setting up Supabase project..."

# Initialize Supabase if not already done
if [ ! -d "supabase" ]; then
    print_status "Initializing Supabase project..."
    supabase init
fi

# Link to existing Supabase project
print_status "Linking to Supabase project..."
supabase link --project-ref nigxqmizirtccedoezhf

print_status "Applying database migrations..."

# Apply database schema
if [ -f "supabase/migrations/001_initial_schema.sql" ]; then
    print_status "Applying initial schema..."
    supabase db reset --linked
    print_success "Database schema applied successfully"
else
    print_error "Database migration files not found"
    exit 1
fi

print_status "Setting up storage buckets..."

# Create storage bucket for donation certificates
supabase storage create donation-certificates --public || print_warning "Storage bucket may already exist"

print_status "Deploying Supabase functions..."

# Deploy main API function
print_status "Deploying main API function..."
supabase functions deploy server

# Deploy upload function
print_status "Deploying upload function..."
supabase functions deploy upload

# Deploy notifications function
print_status "Deploying notifications function..."
supabase functions deploy notifications

# Deploy blockchain function
print_status "Deploying blockchain function..."
supabase functions deploy blockchain

print_success "All functions deployed successfully"

print_status "Setting up environment variables..."

# Set function secrets (you'll need to provide these)
print_warning "Please set the following secrets manually:"
echo "supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
echo "supabase secrets set JWT_SECRET=your-jwt-secret"

print_status "Testing API endpoints..."

# Test health endpoint
API_URL="https://nigxqmizirtccedoezhf.supabase.co/functions/v1"
print_status "Testing health endpoint..."
if curl -s "$API_URL/health" | grep -q "ok"; then
    print_success "Health endpoint is working"
else
    print_warning "Health endpoint test failed"
fi

print_status "Setting up frontend environment..."

# Update frontend environment
if [ -f ".env" ]; then
    # Update API URLs in .env
    sed -i.bak 's|VITE_API_URL=.*|VITE_API_URL=https://nigxqmizirtccedoezhf.supabase.co/functions/v1|' .env
    sed -i.bak 's|VITE_UPLOAD_URL=.*|VITE_UPLOAD_URL=https://nigxqmizirtccedoezhf.supabase.co/functions/v1/upload|' .env
    print_success "Frontend environment updated"
fi

print_status "Installing frontend dependencies..."
npm install

print_status "Building frontend..."
npm run build

print_success "🎉 BaseSeva Backend Deployment Complete!"

echo ""
echo "📋 Next Steps:"
echo "1. Update your .env file with actual credentials"
echo "2. Set Supabase function secrets:"
echo "   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key"
echo "   supabase secrets set JWT_SECRET=your-secret"
echo "3. Test the API endpoints"
echo "4. Deploy your frontend to your hosting platform"
echo ""
echo "🔗 API Endpoints:"
echo "• Health: $API_URL/health"
echo "• Auth: $API_URL/auth/*"
echo "• Blood Requests: $API_URL/blood-requests"
echo "• Donations: $API_URL/donations"
echo "• Blood Banks: $API_URL/blood-banks"
echo "• Notifications: $API_URL/notifications"
echo "• Upload: $API_URL/upload/*"
echo "• Blockchain: $API_URL/blockchain/*"
echo ""
echo "📚 Documentation: BACKEND_SETUP.md"
echo "🆘 Support: Check Supabase logs if you encounter issues"