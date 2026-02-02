# Quick Testing Guide - Multiplayer Dhandho

## Fast Start for Local Multiplayer Testing

### 1. Start Everything
```bash
npm run dev:all
```

This starts both:
- ✅ Server on port 8000
- ✅ Client on port 5173

### 2. Open Two Browsers

**Browser 1 (Host):**
1. Go to `http://localhost:5173`
2. Enter name: "Alice"
3. Click "Create Room"
4. **Write down the 4-character room code** (e.g., "ABCD")
5. Wait in the lobby

**Browser 2 (Player):**
1. Go to `http://localhost:5173` (new window or incognito)
2. Enter name: "Bob"
3. Click "Join Room"
4. Enter the room code from Browser 1
5. Click "Join"

### 3. Start the Game

In **Browser 1** (host window):
- Should now show 2 players
- Click "Start Match"

Both browsers should load the game!

---

## Testing Checklist

### ✅ Lobby System
- [ ] Name entry works
- [ ] Create room generates 4-char code
- [ ] Join room with valid code works
- [ ] Invalid code shows error
- [ ] Waiting room shows all players
- [ ] Host sees "Start Match" button
- [ ] Non-host sees "Waiting for host" message
- [ ] Start Match disabled until 2+ players
- [ ] Leave Room works

### ✅ Game Mechanics
- [ ] Game board loads for both players
- [ ] Turn indicator shows correct player
- [ ] "Actions Left: 3/3" displays correctly
- [ ] Playing a card decrements actions counter
- [ ] After 3 cards, turn automatically switches
- [ ] "End Turn" button works before 3 actions
- [ ] Other player sees turn switch immediately
- [ ] Cards sync between players
- [ ] Property sets update correctly
- [ ] Bank totals update correctly

### ✅ Advanced Features
- [  ] Test with 3 players (open 3rd browser)
- [ ] Test with 4 players
- [ ] Test with 5 players (maximum)
- [ ] 6th player cannot join (full room)
- [ ] Win condition triggers correctly
- [ ] Game over screen shows for all players

---

## Quick Test Scenarios

### Scenario 1: Basic 2-Player Game
1. Create room (Player 1)
2. Join room (Player 2)
3. Start match
4. Player 1 plays 3 cards
5. Verify turn switches to Player 2
6. Player 2 plays 2 cards
7. Player 2 clicks "End Turn"
8. Verify turn switches back to Player 1

**Expected**: All actions sync, turns switch correctly

### Scenario 2: Actions Limit
1. Start a game
2. On your turn, play exactly 3 cards
3. Observe turn automatically ending
4. Other player should see turn switch immediately

**Expected**: Auto-end after 3 actions

### Scenario 3: Manual End Turn
1. Start a game
2. On your turn, play 1 card
3. Click "End Turn"
4. Turn should switch immediately

**Expected**: Manual end turn works, even with actions remaining

### Scenario 4: Room Code Validation
1. Try joining with invalid code "XXXX"
2. Should show "Room not found" error
3. Try joining a full room (5 players)
4. Should show "Room is full" error

---

## Troubleshooting

### Server Not Starting
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# If yes, kill the process or change port in server/server.js
```

### Client Can't Connect to Server
1. Check browser console (F12)
2. Look for WebSocket connection errors
3. Verify server is running on port 8000
4. Check `.env.local` has correct URL

### Players Not Syncing
1. Both browsers must use same server
2. Hard refresh both browsers (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify firewall isn't blocking WebSocket

### Room Code Not Working
1. Code is case-sensitive
2. Server might have restarted (rooms are in-memory)
3. Try creating a new room

---

## What to Test Before Deployment

1. **Local Multiplayer**: Works with 2+ players
2. **Actions Limit**: Strictly enforced (3 per turn)
3. **Turn Switching**: Automatic and manual
4. **Lobby Flow**: Create, join, wait, start
5. **Room Codes**: 4-character codes work
6. **Min/Max Players**: 2-5 players enforced
7. **Synchronization**: All players see same state
8. **Win Condition**: Game ends correctly
9. **Leave Room**: Players can leave lobby

---

## Performance Check

### Monitor These:
- **Server CPU**: Should stay low (< 50%)
- **Memory**: Should stay under 100MB
- **Network**: Check WebSocket connections in browser DevTools
- **Latency**: Card plays should sync within 100-200ms

### If Slow:
1. Check server logs for errors
2. Reduce number of concurrent games
3. Consider deploying to faster server
4. Check internet connection speed

---

## Development Tips

### Hot Reload
Both client and server support hot reload:
- **Client**: Vite auto-reloads on file changes
- **Server**: Restart manually or use nodemon

### Debugging
1. **Client**: Browser DevTools (F12) → Console
2. **Server**: Terminal shows server logs
3. **Network**: DevTools → Network → WS (WebSocket)

### Common Issues
- **TypeError: Cannot read property 'events'**: Add safety check in GameBoard
- **CORS errors**: Update ALLOWED_ORIGINS in server
- **Connection refused**: Server not running
- **Socket timeout**: Check firewall settings

---

## Ready for Production?

Before deploying:
- ✅ All local tests pass
- ✅ Tested with 2-5 players
- ✅ No console errors
- ✅ Actions limit works
- ✅ Lobby flow smooth
- ✅ Room codes work reliably

If all checked, proceed to `DEPLOYMENT.md`! 🚀
