# Deploying WordWise AI to Vercel

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed (you already have this)
- GitHub repository connected (already done)

## Step-by-Step Deployment

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Login to Vercel (if not already logged in)
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel
```

When prompted:
- Set up and deploy: `Y`
- Which scope: Choose your account
- Link to existing project?: `N` (first time) or `Y` (if redeploying)
- Project name: `wordwise-ai` (or your preferred name)
- Directory: `./` (since you're already in frontend)
- Override settings?: `N`

### 4. Configure Environment Variables

After the initial deployment, you need to add your environment variables:

1. Go to https://vercel.com/dashboard
2. Click on your `wordwise-ai` project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## Alternative: Deploy from GitHub

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the `frontend` directory as the root
4. Vercel will auto-detect Vite framework
5. Add environment variables in the UI
6. Click "Deploy"

## Important Notes

- The `vercel.json` file configures:
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA routing: All routes redirect to index.html
  
- Make sure your Supabase project allows connections from Vercel's IPs
- The free tier of Vercel is sufficient for this project

## Updating Deployments

To deploy updates:
```bash
cd frontend
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy if you set up GitHub integration.

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions 