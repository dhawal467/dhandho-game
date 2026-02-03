import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DhandhoGame } from './game/Game';
import GameBoard from './components/GameBoard';
import DhandhoLobby from './components/Lobby';

const rawServerUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';
const SERVER_URL = (() => {
    try {
        return new URL(rawServerUrl).origin;
    } catch {
        return rawServerUrl.replace(/\/lobby-socket\/?$/i, '');
    }
})();

// Create the multiplayer client
const DhandhoClient = Client({
    game: DhandhoGame,
    board: GameBoard,
    multiplayer: SocketIO({ server: SERVER_URL }),
    debug: false,
});

function App() {
    return (
        <div className="min-h-screen">
            <DhandhoLobby gameComponent={DhandhoClient} />
        </div>
    );
}

export default App;
