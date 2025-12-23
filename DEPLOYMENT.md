# Deploying Voice-Driven Command Assistant

## 🚀 Deployment Architecture

This guide covers deploying your app to production:
- **Frontend (React)** → Vercel
- **Backend (Express + Deepgram)** → Render or Railway

---

## 📋 Prerequisites

1. GitHub account (✅ Already done)
2. [Vercel account](https://vercel.com/signup) (free)
3. [Render account](https://render.com/register) or [Railway account](https://railway.app/) (free)
4. Deepgram API Key

---

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com/register
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `sarikashinde123/voice-assistance`
3. Configure:
   - **Name**: `voice-assistant-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables
In Render dashboard, add:
- **Key**: `DEEPGRAM_API_KEY`
- **Value**: `6e77b7e276e110a27b6ad9e2d01469d73e366cf2`

Click **"Create Web Service"**

### Step 4: Note Your Backend URL
After deployment, you'll get a URL like:
`https://voice-assistant-backend-xxxx.onrender.com`

**Save this URL!** You'll need it for the frontend.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL

Before deploying, update the API URL in your code:

**Option A: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your repository
3. Add Environment Variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`

**Option B: Update Local File**
Edit `client/.env.production`:
```env
REACT_APP_API_URL=https://voice-assistant-backend-xxxx.onrender.com/api
```

### Step 2: Deploy to Vercel

**Method 1: Via Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select: `sarikashinde123/voice-assistance`
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variables:
   - `REACT_APP_API_URL` = Your Render backend URL + `/api`
6. Click **"Deploy"**

**Method 2: Via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? voice-assistant
# - Directory? ./
# - Override settings? No
```

### Step 3: Configure Production Environment

After first deployment, go to:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
3. Redeploy

---

## 🔧 Post-Deployment Configuration

### Update CORS in Backend

Edit `server/server.js` to allow your Vercel domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://voice-assistant.vercel.app',  // Add your Vercel domain
    'https://*.vercel.app'  // Allow all Vercel preview URLs
  ],
  credentials: true
}));
```

Commit and push changes:
```bash
git add server/server.js
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the changes.

---

## 🎯 Access Your Deployed App

After deployment:
- **Frontend**: `https://voice-assistant.vercel.app` (or your custom domain)
- **Backend**: `https://voice-assistant-backend-xxxx.onrender.com`

---

## ⚡ Quick Commands Summary

```bash
# Deploy Frontend to Vercel
cd client
vercel --prod

# View deployment logs
vercel logs

# Set environment variable
vercel env add REACT_APP_API_URL production
```

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` environment variable
- Verify backend is running on Render
- Check CORS settings in backend

### Backend API errors
- Check Deepgram API key in Render environment variables
- View logs in Render dashboard
- Ensure backend is using production start command

### Voice recording not working
- HTTPS is required for microphone access (Vercel provides this automatically)
- Check browser microphone permissions

---

## 🔄 Continuous Deployment

Both services auto-deploy when you push to GitHub:
```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel and Render will automatically deploy
```

---

## 💰 Cost

- **Vercel**: Free tier (sufficient for this app)
- **Render**: Free tier (sufficient for this app)
- **Deepgram**: Free $200 credit

Total: **$0/month** ✨

---

## 📝 Custom Domain (Optional)

### For Vercel (Frontend)
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### For Render (Backend)
1. Render Dashboard → Your Service → Settings → Custom Domain
2. Add your backend domain
3. Update DNS records

---

## ✅ Verification Checklist

After deployment:
- [ ] Frontend loads at Vercel URL
- [ ] Microphone button appears
- [ ] Can grant microphone permission
- [ ] Voice recording works
- [ ] Commands are recognized
- [ ] Demo app responds to commands
- [ ] All tabs work (Home, Dashboard, Users, Tasks, Profile)
- [ ] Search functionality works
- [ ] Settings modal opens

---

## 🎉 You're Live!

Your Voice-Driven Command Assistant is now deployed and accessible worldwide!

Share your app:
- Frontend: `https://voice-assistant.vercel.app`
- GitHub: `https://github.com/sarikashinde123/voice-assistance`

