# Quick Debugging Steps - Dhandho Game

## ✅ VERIFIED WORKING (as of 2026-02-02)

I've verified that:
1. ✅ All npm dependencies are installed correctly
2. ✅ All source files exist and are valid
3. ✅ Dev server starts without errors
4. ✅ Vite is serving the HTML correctly
5. ✅ App.jsx is configured for local play (NO multiplayer connection issues)
6. ✅ Debug mode is enabled
7. ✅ Previous "connecting" bug has been FIXED

---

## 🌐 How to Open and Test

### Step 1: Ensure Dev Server is Running
The dev server should already be running at: **http://localhost:5173**

If it's not running, open a terminal and run:
```bash
cd C:\Users\dhawa\.gemini\antigravity\scratch\dhandho-game
npm run dev
```

### Step 2: Open in Your Browser
1. Open **Google Chrome**, **Microsoft Edge**, or **Firefox**
2. Navigate to: **http://localhost:5173**
3. You should see the game load immediately

---

## 🎮 What You Should See

### Immediate Load (No "Connecting" Screen)
The game should load **instantly** without any "connecting" or "waiting" message.

### Game interface should show:

**Top (Opponent Area):**
```
┌─────────────────────────────────────────┐
│ Opponent                                │
│ Bank: ₹XCr  Sets: 0/3  Hand: 5         │
│ [Property Set Progress Grid]            │
└─────────────────────────────────────────┘
```

**Middle (Deck & Discard):**
```
┌──────┐       ┌──────┐
│ 🎴   │       │      │
│ Deck │       │Discard│
│  98  │       │Empty │
└──────┘       └──────┘
```

**Bottom (Your Area):**
```
┌─────────────────────────────────────────┐
│ Your Area                               │
│ Bank: ₹0Cr  Sets: 0/3                  │
│ [Your Property Sets Progress]           │
│                                         │
│ Your Hand (5/7)                         │
│ [Card] [Card] [Card] [Card] [Card]     │
└─────────────────────────────────────────┘
```

**Right Side:**
```
┌─────────────┐
│ Debug Panel │
│             │
│ Player 0/1  │
│ Game State  │
│             │
└─────────────┘
```

---

## 🧪 Quick Test - Play Your First Card

1. **Click any card** in your hand (bottom section)
2. A menu should pop up with options:
   - "Play as Property"
   - "Play as Money"
   - "Play Action" (if it's an action card)
   - "Cancel"
3. Select **"Play as Money"**
4. The card should disappear from your hand
5. Your bank total should increase

✅ **If this works, the game is functioning correctly!**

---

## ❓ If You're Seeing Issues

### Issue 1: Blank White Screen
**Symptoms:** Nothing appears, just white screen

**Steps to fix:**
1. Press `F12` to open Developer Tools
2. Click the **Console** tab
3. Look for red error messages
4. Take a screenshot of any errors and share them

**Most common cause:** Browser cache
**Quick fix:** Press `Ctrl + Shift + R` (hard refresh)

---

### Issue 2: "Loading game..." message stuck
**Symptoms:** Shows "Loading game..." forever

**This should NOT happen now** - the connecting issue was fixed.

If you still see this:
1. Press `F12` → Console tab
2. Check for errors related to `ctx` or `G` being undefined
3. The issue might be in the GameBoard component

**Quick test:**
Replace `src/App.jsx` with `src/App.backup.jsx` temporarily:
```bash
# In PowerShell or CMD
copy src\App.backup.jsx src\App.jsx
```

This will show a simple test page. If that works, there's an issue with boardgame.io.

---

### Issue 3: Can't Click Cards
**Symptoms:** Cards visible but not clickable

**Possible causes:**
- Not your turn (check debug panel)
- React event handlers not attached

**Check:**
1. Look at debug panel (right side)
2. Make sure it shows "Player 0" or "Player 1"
3. Click the player toggle if needed

---

### Issue 4: Styles Look Broken
**Symptoms:** Game loads but looks unstyled or weird

**Cause:** Tailwind CSS not processing

**Fix:**
1. Stop dev server: `Ctrl+C`
2. Restart: `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R`

---

## 🔍 Advanced Debugging

### Check Browser Console
Press `F12` → Console tab

**Good (no errors):**
```
[vite] connected.
```

**Bad (errors to look for):**
```
❌ Uncaught ReferenceError: ...
❌ Cannot read properties of undefined...
❌ Module not found...
```

If you see errors, share them for specific help.

---

### Check Network Tab
Press `F12` → Network tab → Refresh page

**Look for:**
- ✅ `main.jsx` - should be status 200 (green)
- ✅ `Game.js` - should be status 200 (green)
- ✅ `index.css` - should be status 200 (green)

**If any are red/404:**
- Dev server might have crashed
- Restart it with `npm run dev`

---

### Use Debug Panel Features

The debug panel on the right side lets you:

1. **Switch Players:**
   - Click "Player 0" or "Player 1" dropdown
   - Play from both perspectives
   - Great for testing 2-player mechanics

2. **View Game State:**
   - See the entire `G` (game state) object
   - Check deck size, player hands, etc.

3. **Inspect Moves:**
   - See available moves for current player
   - Useful for debugging gameplay logic

---

## 📋 Troubleshooting Checklist

Before asking for help, verify:

- [ ] Dev server is running (`npm run dev` in terminal)
- [ ] Browser is pointing to `http://localhost:5173` (not `https`)
- [ ] Browser console shows no red errors (F12 → Console)
- [ ] Hard refresh attempted (`Ctrl+Shift+R`)
- [ ] All files exist (run `node check-game-status.js`)

---

## 🚀 If Everything Works

Congratulations! Try these:

1. **Play a full game:**
   - Try to collect 3 property sets
   - Use the debug panel to switch players
   - Test different action cards

2. **Test action cards:**
   - **Pass Go** (🎲) - Easiest to test, draws 2 cards
   - **Shagun** (🎉) - Collects money from opponent
   - **Jugaad** (🎯) - Steals a property

3. **Check win condition:**
   - Complete 3 property sets
   - Win screen should appear automatically

---

## 📞 Getting Help

If stuck, provide:
1. Screenshot of the browser window
2. Screenshot of browser console (F12 → Console)
3. Terminal output from `npm run dev`
4. Description of what you expected vs what you see

---

**The game is ready to play! Open http://localhost:5173 and enjoy! 🎉**
