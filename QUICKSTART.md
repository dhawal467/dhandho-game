# Quick Start - Manual Testing

## Terminal Commands

### Terminal 1: Server
```bash
node server/server.cjs
```

### Terminal 2: Client  
```bash
npm run dev
```

## Testing Flow

1. **Browser 1**: http://localhost:5173
   - Name: "Alice" → Create Room → Note code

2. **Browser 2**: http://localhost:5173 (new window/incognito)
   - Name: "Bob" → Join Room → Enter code

3. **Browser 1**: Click "Start Match"

4. **Test Actions**:
   - Play 3 cards → Turn auto-ends
   - Or click "End Turn" early

## Files Summary

### Core Implementation:
- `src/game/Game.js` - 3 actions limit, 2-5 players
- `src/components/Lobby.jsx` - Custom lobby
- `src/components/GameBoard.jsx` - Actions counter, end turn
- `src/App.jsx` - Multiplayer client
- `server/server.cjs` - Socket.IO server

### Config:
- `package.json` - Dependencies & scripts
- `.env.local` - Dev server URL
- `.env.production` - Prod server URL (template)

## Troubleshooting

**Server won't start?**
- Check port 8000 is free
- Make sure you ran `npm install`

**Client can't connect?**  
- Start server FIRST
- Check `.env.local` has correct URL

**Import errors?**
- Already fixed in `Game.js` (uses dist/cjs paths)

See `implementation_summary.md` for full details.
