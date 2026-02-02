const { Server, Origins } = require('boardgame.io/dist/cjs/server.js');
const path = require('path');
const serve = require('koa-static');
const { Server: SocketIOServer } = require('socket.io');

// Import game - need to use dynamic import for ES module
async function startServer() {
    const { DhandhoGame } = await import('../src/game/Game.js');

    // Define allowed origins for CORS
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];

    const server = Server({
        games: [DhandhoGame],
        origins: allowedOrigins, // Required for boardgame.io 0.50.2+
    });

    const PORT = process.env.PORT || 8000;

    // Add CORS middleware
    const cors = require('@koa/cors');
    server.app.use(cors({
        origin: '*',
        credentials: true,
    }));

    // Serve static files from dist in production
    if (process.env.NODE_ENV === 'production') {
        const staticPath = path.join(__dirname, '..', 'dist');
        server.app.use(serve(staticPath));
    }

    console.log(`🎮 Starting Dhandho Server on port ${PORT}...`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔓 CORS: Enabled for origins:`, allowedOrigins);

    // Start the boardgame.io server and get the HTTP server instance
    const startedServer = await server.run(PORT);

    console.log(`🎯 Boardgame.io ready at http://localhost:${PORT}`);

    // Get the HTTP server from the Koa callback
    const httpServer = startedServer.appServer || startedServer;

    // Create Socket.IO instance attached to the same HTTP server
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        path: '/lobby-socket/',
    });

    console.log(`💬 Lobby Socket.IO ready at /lobby-socket/`);

    // Lobby state management
    const lobbyRooms = new Map(); // Store lobby state for each room

    io.on('connection', (socket) => {
        console.log('📱 Lobby client connected:', socket.id);

        // Player joins lobby room for coordination
        socket.on('joinLobbyRoom', ({ matchID, playerName }) => {
            socket.join(matchID);
            console.log(`👤 ${playerName} joined lobby room: ${matchID}`);

            // Initialize room state if doesn't exist
            if (!lobbyRooms.has(matchID)) {
                lobbyRooms.set(matchID, { started: false, players: [] });
            }

            const roomState = lobbyRooms.get(matchID);
            roomState.players.push({ id: socket.id, name: playerName });

            // Broadcast updated player list to everyone in the room
            io.to(matchID).emit('lobbyPlayersUpdate', {
                players: roomState.players,
                started: roomState.started,
            });
        });

        // Host starts the game
        socket.on('startGame', ({ matchID }) => {
            console.log(`🎮 Starting game for match: ${matchID}`);

            const roomState = lobbyRooms.get(matchID);
            if (roomState) {
                roomState.started = true;

                // Broadcast to ALL players in the room (including host)
                io.to(matchID).emit('gameStarted', { matchID });
                console.log(`✅ Game started signal sent to all players in room: ${matchID}`);
            }
        });

        // Clean up on disconnect
        socket.on('disconnect', () => {
            console.log('📴 Lobby client disconnected:', socket.id);

            // Remove player from all rooms
            lobbyRooms.forEach((roomState, matchID) => {
                const index = roomState.players.findIndex(p => p.id === socket.id);
                if (index !== -1) {
                    const player = roomState.players.splice(index, 1)[0];
                    console.log(`👋 ${player.name} left room: ${matchID}`);

                    // Notify remaining players
                    io.to(matchID).emit('lobbyPlayersUpdate', {
                        players: roomState.players,
                        started: roomState.started,
                    });
                }
            });
        });
    });

    console.log(`✅ Ready to accept connections!`);
}

startServer().catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
