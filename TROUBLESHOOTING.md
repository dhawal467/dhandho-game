# Troubleshooting Blank Screen - Step by Step

## Problem: Blank Screen in Browser

This guide will help you identify and fix the blank screen issue.

---

## Step 1: Verify Dependencies Are Installed

The most common cause of a blank screen is **missing dependencies**.

### Check if node_modules exists:

```powershell
# Navigate to project directory
cd C:\Users\dhawa\.gemini\antigravity\scratch\dhandho-game

# Check if node_modules folder exists
Test-Path .\node_modules
```

**If it says `False`**, you need to install dependencies:

```powershell
npm install
```

Wait for it to complete (it may take 2-3 minutes on first install).

---

## Step 2: Check for Installation Errors

After running `npm install`, look for errors in the output.

### Common issues:

- **"boardgame.io not found"** - The installation didn't complete
- **"Network error"** - Internet connection issue
- **"Permission denied"** - Run terminal as Administrator

### Solution:
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force .\node_modules
Remove-Item package-lock.json
npm install
```

---

## Step 3: Test with Simplified App

I've created a diagnostic version that doesn't require boardgame.io.

### Temporarily use the test version:

```powershell
# Backup current App.jsx
Copy-Item src\App.jsx src\App.game.jsx

# Use diagnostic version
Copy-Item src\App.backup.jsx src\App.jsx

# Restart dev server
npm run dev
```

### What to expect:
- **If you see a colored page with "Dhandho Setup Test"**: ✅ React and Vite are working!
  - Problem is likely with boardgame.io import
- **If still blank**: ❌ There's a more fundamental issue
  - Check browser console (F12) for errors

---

## Step 4: Check Browser Console

1. Open your browser to `http://localhost:5173`
2. Press `F12` to open Developer Tools
3. Click the **Console** tab
4. Look for red error messages

### Common errors and solutions:

**Error: "Cannot find module 'boardgame.io'"**
```powershell
npm install boardgame.io
```

**Error: "Unexpected token"**
- Syntax error in code
- Share the exact error message

**Error: "Failed to parse CSS"**
```powershell
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
```

**Error: "require is not defined"**
- Check that `"type": "module"` is in package.json

---

## Step 5: Verify Dev Server is Running

```powershell
# Check if server is running on port 5173
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

**If no output**: Server isn't running
```powershell
npm run dev
```

**If error "Port already in use"**:
```powershell
# Kill the process on port 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
npm run dev
```

---

## Step 6: Check Network Tab

In browser DevTools:
1. Click **Network** tab
2. Refresh the page (`Ctrl+R`)
3. Look for any failed requests (red text)

### What to look for:
- ❌ **main.jsx** failed to load - Vite isn't serving files
- ❌ **index.css** 404 error - File path issue
- ❌ Multiple failed requests - Dev server crashed

---

## Step 7: Restore Full Game

Once you've identified the issue, restore the full game:

```powershell
# Navigate to project
cd C:\Users\dhawa\.gemini\antigravity\scratch\dhandho-game

# Make sure dependencies are installed
npm install

# Restore the game version
Copy-Item src\App.game.jsx src\App.jsx

# Restart dev server
npm run dev
```

---

## Quick Fix Checklist

Try these in order:

1. ✅ **Run npm install**
   ```powershell
   npm install
   ```

2. ✅ **Check you have Node.js installed**
   ```powershell
   node --version
   npm --version
   ```
   Should show version numbers. If not, install from nodejs.org

3. ✅ **Clear browser cache**
   - Press `Ctrl+Shift+R` to hard refresh

4. ✅ **Restart dev server**
   - `Ctrl+C` to stop
   - `npm run dev` to start

5. ✅ **Check localhost URL**
   - Make sure you're going to `http://localhost:5173` (not https)
   - Check the terminal output for the actual URL

---

## Still Not Working?

### Gather This Information:

1. **Node version**:
   ```powershell
   node --version
   ```

2. **Npm version**:
   ```powershell
   npm --version
   ```

3. **Dev server output**:
   - Copy the text from the terminal after running `npm run dev`

4. **Browser console errors**:
   - Press F12, click Console tab
   - Copy any red error messages

5. **Check if files exist**:
   ```powershell
   Test-Path src\main.jsx
   Test-Path src\App.jsx
   Test-Path index.html
   ```

Share this information for further diagnosis.

---

## Alternative: Start Fresh

If nothing works, you can restart with a clean installation:

```powershell
# Go to scratch directory
cd C:\Users\dhawa\.gemini\antigravity\scratch

# Remove old project
Remove-Item -Recurse -Force dhandho-game

# You'll need to recreate the project
# (All files are still available in this conversation)
```

Then I can help you set it up again with a different approach.

---

## Most Likely Cause

Based on typical blank screen issues:

**90% chance**: Dependencies not installed
- Solution: `npm install` in the project directory

**5% chance**: boardgame.io import error
- Solution: Use the test App.jsx first to verify React works

**5% chance**: Configuration issue
- Solution: Check that all config files are correct

---

**Next Step**: Start with Step 1 above and run `npm install`
