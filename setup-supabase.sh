#!/bin/bash

# BaseSeva Supabase Setup Script
# This script helps you set up your Supabase project

echo "🚀 BaseSeva Supabase Setup"
echo "=========================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
    echo "✅ Supabase CLI installed"
else
    echo "✅ Supabase CLI found"
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "🔐 Please login to Supabase:"
    supabase login
fi

echo ""
echo "📋 Setup Options:"
echo "1. Link existing project and deploy"
echo "2. Create new project"
echo "3. Just run migrations"
echo "4. Deploy Edge Functions only"
echo "5. Test API endpoints"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo "🔗 Linking to existing project..."
        echo "Your project reference: nigxqmizirtccedoezhf"
        supabase link --project-ref nigxqmizirtccedoezhf
        
        echo "📊 Running database migrations..."
        supabase db push
        
        echo "🚀 Deploying Edge Functions..."
        supabase functions deploy
        
        echo "✅ Setup complete!"
        ;;
    2)
        echo "🆕 Creating new project..."
        supabase projects create
        echo "Please follow the prompts to create your project"
        ;;
    3)
        echo "📊 Running database migrations..."
        supabase db push
        echo "✅ Migrations complete!"
        ;;
    4)
        echo "🚀 Deploying Edge Functions..."
        supabase functions deploy
        echo "✅ Functions deployed!"
        ;;
    5)
        echo "🧪 Testing API endpoints..."
        
        echo "Testing health endpoint..."
        curl -s https://nigxqmizirtccedoezhf.supabase.co/functions/v1/health | jq .
        
        echo ""
        echo "Testing blood banks endpoint..."
        curl -s https://nigxqmizirtccedoezhf.supabase.co/functions/v1/blood-banks | jq .
        
        echo "✅ API tests complete!"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup process completed!"
echo ""
echo "📝 Next steps:"
echo "1. Set up environment variables in Supabase Dashboard"
echo "2. Configure storage buckets"
echo "3. Test your app locally"
echo "4. Deploy to Vercel"
echo ""
echo "📚 Documentation: SUPABASE_SETUP.md"
