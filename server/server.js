import { Server } from 'boardgame.io/dist/cjs/server.js';
import path from 'path';
import { fileURLToPath } from 'url';
import serve from 'koa-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import game logic
import { DhandhoGame } from '../src/game/Game.js';

// server/server.js

// ... your imports ... 
// (Keep the imports exactly as we fixed them earlier)

const server = Server({
  games: [DhandhoGame],
  
  // ---------------------------------------------------------
  // THE CRITICAL FIX: Explicitly allow Vercel to connect
  // ---------------------------------------------------------
  origins: [
    // 1. Your Local Computer (for testing)
    'http://localhost:5173',
    'http://localhost:8000',
    
    // 2. Your Production Game (Vercel)
    // IMPORTANT: No trailing slash (/) at the end!
    'https://dhandho-game.vercel.app', 
    
    // 3. The "Safety Net" (Tells the server to trust everyone for now)
    // If the above fail, this usually forces it to work.
    '*' 
  ],
});



// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '..', 'dist');
    server.app.use(serve(staticPath));
}

// Robust Startup Logic
const PORT = parseInt(process.env.PORT) || 8000;

server.run(PORT, () => {
    console.log(`🎮 Dhandho Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
