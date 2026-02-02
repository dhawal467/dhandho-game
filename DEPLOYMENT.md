# Deployment Guide - Dhandho Multiplayer Game

## Overview

The Dhandho game is now configured for multiplayer deployment with separate client and server components.

---

## Architecture

- **Client**: Built with Vite, deployed to Vercel
- **Server**: boardgame.io server with Socket.IO, deployed to Render or Railway
- **Communication**: WebSocket connections via Socket.IO

---

## Local Testing

### Prerequisites
- Node.js 18+ installed
- Two browser windows (or browsers) for testing multiplayer

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Both Server and Client
```bash
npm run dev:all
```

This runs both:
- Server on `http://localhost:8000`
- Client on `http://localhost:5173`

**OR Run Separately:**

Terminal 1 (Server):
```bash
npm run server
```

Terminal 2 (Client):
```bash
npm run dev
```

### Step 3: Test Multiplayer Locally

1. **Browser Window 1:**
   - Open `http://localhost:5173`
   - Enter your name (e.g., "Player 1")
   - Click "Create Room"
   - Note the 4-character room code displayed

2. **Browser Window 2 (or Incognito):**
   - Open `http://localhost:5173`
   - Enter a different name (e.g., "Player 2")
   - Click "Join Room"
   - Enter the room code from Window 1
   - Click "Join"

3. **Start the Game:**
   - Window 1 should now show 2 players in the waiting room
   - Click "Start Match" (host only)
   - Both windows should load the game board

4. **Test Gameplay:**
   - Player 1's turn starts first
   - Play 3 cards - turn should auto-switch
   - Or click "End Turn" manually
   - Player 2 can now play
   - Verify synchronization between windows

---

## Server Deployment (Render)

### Step 1: Prepare Server Code

Your server code is in `server/server.js`. This needs to be deployed separately.

### Step 2: Deploy to Render

1. **Create Render Account**: https://render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Or upload files manually

3. **Configure Service**:
   - **Name**: `dhandho-server` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free (or your choice)

4. **Environment Variables**:
   - Click "Environment" tab
   - Add variable:
     - Key: `ALLOWED_ORIGINS`
     - Value: `https://your-vercel-app.vercel.app,http://localhost:5173`

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (~2-3 minutes)
   - Note your server URL: `https://dhandho-server.onrender.com` (example)

### Alternative: Railway Deployment

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Node.js
5. Add environment variable:
   - `ALLOWED_ORIGINS`: Your Vercel URL
6. Deploy
7. Note your Railway URL

---

## Client Deployment (Vercel)

### Step 1: Update Environment Variables

Edit `.env.production`:
```env
VITE_SERVER_URL=https://your-render-server.onrender.com
```

Replace with your actual server URL from Render/Railway.

### Step 2: Deploy to Vercel

**Option A: Vercel CLI**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts:
   - Project name: `dhandho-game`
   - Build command: `npm run build`
   - Output directory: `dist`

4. Add environment variable:
```bash
vercel env add VITE_SERVER_URL production
```
Enter your server URL when prompted.

5. Deploy to production:
```bash
vercel --prod
```

**Option B: Vercel Dashboard**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - Click "Environment Variables"
   - Name: `VITE_SERVER_URL`
   - Value: Your Render server URL
   - Environment: Production

6. Click "Deploy"

### Step 3: Update Server CORS

After deploying to Vercel, update your Render server:

1. Go to Render dashboard
2. Select your service
3. Click "Environment" tab
4. Update `ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app,http://localhost:5173
   ```
5. Save changes (server will redeploy)

---

## Testing Production Deployment

1. Open your Vercel URL in two separate browsers
2. Create a room in Browser 1
3. Join with room code in Browser 2
4. Start match and play
5. Verify all features work:
   - Room creation/joining
   - Player synchronization
   - Turn-based gameplay
   - 3 actions per turn limit
   - Card playing
   - Win conditions

---

## Environment Variables Summary

### Client (.env.production)
```env
VITE_SERVER_URL=https://your-server.onrender.com
```

### Server (Render/Railway)
```env
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
PORT=8000  # Auto-set by Render/Railway
NODE_ENV=production
```

---

## Troubleshooting

### Issue: "Failed to connect to server"
**Solution**: 
- Check `VITE_SERVER_URL` in Vercel environment variables
- Verify server is running on Render/Railway
- Check CORS settings on server

### Issue: "Room not found" when joining
**Solution**:
- Verify both clients connect to same server
- Check room code (case-sensitive)
- Ensure server hasn't restarted (rooms are in-memory)

### Issue: Players not syncing
**Solution**:
- Check browser console for WebSocket errors
- Verify firewall/network allows WebSocket connections
- Check server logs on Render/Railway

### Issue: Server keeps sleeping (Free tier)
**Solution**:
- Render free tier sleeps after 15 min inactivity
- Consider upgrading to paid tier
- Or use Railway which has better free tier limits

---

## Performance Tips

1. **Server Location**: Deploy server in region closest to your users
2. **CDN**: Vercel automatically uses CDN for client assets
3. **Monitoring**: Use Render/Railway dashboards to monitor server performance
4. **Scaling**: For more games, upgrade server plan

---

## Cost Estimate

**Free Tier (For Testing)**:
- Vercel: Free (100GB bandwidth/month)
- Render: Free (750 hours/month, sleeps after inactivity)
- Railway: Free ($5 credit/month)

**Recommended Paid Tier**:
- Vercel Pro: $20/month
- Render Starter: $7/month (always-on)
- Railway: Pay-as-you-go (~$5-10/month for small traffic)

---

## Next Steps

1. Test locally with multiple browsers
2. Deploy server to Render/Railway
3. Deploy client to Vercel
4. Update environment variables
5. Test production with friends
6. Monitor server logs for issues
7. Scale as needed based on traffic
