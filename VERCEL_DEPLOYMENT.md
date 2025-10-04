# Vercel Deployment Guide for BaseSeva

## Quick Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository:**
   - Select `Shijas786/Baseseva`
   - Click "Import"

4. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add the following variables (see `vercel-env-example.txt` for values):
     ```
     VITE_API_URL
     VITE_UPLOAD_URL
     VITE_PRIVY_APP_ID
     VITE_SUPABASE_URL (optional)
     VITE_SUPABASE_ANON_KEY (optional)
     ```

6. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project-name.vercel.app`

### Option 2: Deploy using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   cd /Users/shijas/BaseSeva
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

## Environment Variables Setup

### Required Variables:
- `VITE_API_URL`: Your Supabase functions URL
- `VITE_UPLOAD_URL`: Your file upload endpoint
- `VITE_PRIVY_APP_ID`: Your Privy application ID

### Optional Variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_ANALYTICS_ID`: Analytics tracking ID
- `VITE_SENTRY_DSN`: Error reporting DSN

## Post-Deployment

1. **Test your deployment:**
   - Visit your Vercel URL
   - Test wallet connection
   - Verify all features work

2. **Set up custom domain (optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS settings

3. **Enable automatic deployments:**
   - Push to main branch triggers automatic deployment
   - Preview deployments for pull requests

## Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check environment variables are set
   - Verify all dependencies are in package.json
   - Check build logs in Vercel dashboard

2. **App doesn't load:**
   - Verify environment variables
   - Check browser console for errors
   - Ensure API endpoints are accessible

3. **Wallet connection issues:**
   - Verify Privy app ID is correct
   - Check if domain is whitelisted in Privy dashboard

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Privy Documentation](https://docs.privy.io/)
