import { Server } from 'boardgame.io/dist/esm/server.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import serve from 'koa-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import game logic
import { DhandhoGame } from '../src/game/Game.js';

const server = Server({
    games: [DhandhoGame],
});

const PORT = process.env.PORT || 8000;

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '..', 'dist');
    server.app.use(serve(staticPath));
}

server.run(PORT, () => {
    console.log(`🎮 Dhandho Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
