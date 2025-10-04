# Environment Setup Guide for BaseSeva

## 🚀 Quick Setup

Your environment is already partially configured! Here's what you need to do:

### 1. ✅ Supabase Configuration (Already Set)
Your Supabase project is already configured:
- **Project URL:** `https://nigxqmizirtccedoezhf.supabase.co`
- **API Endpoint:** `https://nigxqmizirtccedoezhf.supabase.co/functions/v1`
- **Upload Endpoint:** `https://nigxqmizirtccedoezhf.supabase.co/functions/v1/upload`

### 2. 🔑 Privy Configuration (Required)

You need to set up Privy for wallet connectivity:

#### Step 1: Create Privy Account
1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Sign up or log in
3. Create a new app

#### Step 2: Get Your App ID
1. In your Privy dashboard, copy your **App ID**
2. Update your `.env` file:
   ```bash
   VITE_PRIVY_APP_ID=clx_your_actual_app_id_here
   ```

#### Step 3: Configure Domains
In your Privy dashboard, add these domains:
- **Development:** `http://localhost:3000`
- **Production:** `https://your-vercel-app.vercel.app`

### 3. 🔧 Environment Variables

Your `.env` file is already created with the correct Supabase configuration. You just need to:

1. **Get your Privy App ID** (see step 2 above)
2. **Update the .env file:**
   ```bash
   # Edit .env file and replace this line:
   VITE_PRIVY_APP_ID=your-privy-app-id-here
   
   # With your actual Privy App ID:
   VITE_PRIVY_APP_ID=clx_your_actual_app_id_here
   ```

### 4. 🧪 Test Your Setup

After updating the Privy App ID:

```bash
# Restart your development server
npm run dev
```

Check the browser console - you should see:
```
🔧 Environment Config: {
  NODE_ENV: "development",
  DEV_MODE: true,
  PRIVY_CONFIGURED: true
}
```

## 📋 Complete Environment Variables Reference

### Required Variables:
```bash
# API Configuration (✅ Already configured)
VITE_API_URL=https://nigxqmizirtccedoezhf.supabase.co/functions/v1
VITE_UPLOAD_URL=https://nigxqmizirtccedoezhf.supabase.co/functions/v1/upload

# Privy Configuration (⚠️ Needs your App ID)
VITE_PRIVY_APP_ID=clx_your_actual_app_id_here

# Supabase Configuration (✅ Already configured)
VITE_SUPABASE_URL=https://nigxqmizirtccedoezhf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional Variables:
```bash
# Blockchain Configuration
VITE_BASE_CHAIN_ID=8453
VITE_BASE_SEPOLIA_CHAIN_ID=84532

# App Configuration
VITE_APP_NAME=BaseSeva
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

## 🔍 Troubleshooting

### Issue: "PRIVY_CONFIGURED: false"
**Solution:** Make sure your `VITE_PRIVY_APP_ID` is set correctly and doesn't contain `your-privy-app-id-here`

### Issue: Wallet connection not working
**Solution:** 
1. Check your Privy App ID is correct
2. Ensure your domain is added to Privy dashboard
3. Check browser console for errors

### Issue: API calls failing
**Solution:** 
1. Verify Supabase URLs are correct
2. Check if Supabase functions are deployed
3. Check browser network tab for 404 errors

## 🚀 For Production (Vercel)

When deploying to Vercel, set these environment variables in your Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable from your `.env` file
3. Make sure to use your **production** Privy App ID if different from development

## 📞 Need Help?

- **Privy Documentation:** https://docs.privy.io/
- **Supabase Documentation:** https://supabase.com/docs
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables
