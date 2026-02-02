# URGENT: Server Restart Required

## The Problem

You're seeing old game logic because **the server is still running the old Game.js**.

The server loads Game.js at startup and caches it. File changes don't take effect until restart.

## The Solution

### Step 1: Stop the Server
In the terminal running `node server/server.cjs`:
```
Press: Ctrl + C
```

### Step 2: Restart the Server
```bash
node server/server.cjs
```

### Step 3: Hard Refresh Browser
```
Chrome/Edge: Ctrl + Shift + R
Firefox: Ctrl + F5
```

## How to Verify It Worked

**Test 1: Turn Order (2 players)**
- After Player 1 ends turn → should go to Player 0
- Should NOT wait for "Player 2" or "Player 3"

**Test 2: End Turn Button**
- Click "End Turn" at any point
- Turn should end immediately (not frozen)

**Test 3: Actions Counter**
- Should see "Actions: 3/3" at start
- Each card played decrements it
- Turn auto-ends at 0/3

## Still Having Issues?

If after restart you still see old behavior:

1. Check which terminal is running the server
2. Make sure you stopped the RIGHT terminal
3. Try closing ALL terminals and starting fresh:
   ```bash
   # Terminal 1
   node server/server.cjs
   
   # Terminal 2  
   npm run dev
   ```

## Expected Console Output (Server)

When server starts, you should see:
```
🎮 Starting Dhandho Server on port 8000...
🌍 Environment: development
🎯 Boardgame.io ready at http://localhost:8000
💬 Lobby Socket.IO ready at /lobby-socket/
✅ Ready to accept connections!
```

**If you don't see this, the server isn't running the new code.**
