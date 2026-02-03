import React, { useState, useEffect, useRef } from 'react';
import { LobbyClient } from 'boardgame.io/client';
import io from 'socket.io-client';

const rawServerUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';
const SERVER_URL = (() => {
    try {
        return new URL(rawServerUrl).origin;
    } catch {
        return rawServerUrl.replace(/\/lobby-socket\/?$/i, '');
    }
})();

// Generate a random 4-character room code
const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const DhandhoLobby = ({ gameComponent: GameComponent }) => {
    const [screen, setScreen] = useState('name'); // 'name', 'menu', 'create', 'join', 'waiting', 'playing'
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [inputRoomCode, setInputRoomCode] = useState('');
    const [gameID, setGameID] = useState(null);
    const [playerID, setPlayerID] = useState(null);
    const [credentials, setCredentials] = useState(null);
    const [players, setPlayers] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState('');
    const [lobbyClient, setLobbyClient] = useState(null);
    const [lobbySocket, setLobbySocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const client = new LobbyClient({ server: SERVER_URL });
        setLobbyClient(client);

        // Initialize Socket.IO for lobby synchronization
        const socket = io(SERVER_URL, {
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            console.log('🔌 Connected to lobby socket');
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from lobby socket');
        });

        socketRef.current = socket;
        setLobbySocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    // Poll for player updates in waiting room
    useEffect(() => {
        if (screen === 'waiting' && gameID && lobbyClient) {
            const pollPlayers = async () => {
                try {
                    const { players: gamePlayers } = await lobbyClient.getMatch('dhandho', gameID);
                    setPlayers(gamePlayers);
                } catch (err) {
                    console.error('Failed to poll players:', err);
                }
            };

            const interval = setInterval(pollPlayers, 2000);
            pollPlayers(); // Initial call

            return () => clearInterval(interval);
        }
    }, [screen, gameID, lobbyClient]);

    // Socket.IO event listeners for game synchronization
    useEffect(() => {
        if (!lobbySocket || !gameID) return;

        // Listen for game start signal from server
        const handleGameStarted = ({ matchID }) => {
            console.log('🎮 Game started signal received for match:', matchID);
            if (matchID === gameID) {
                setScreen('playing');
            }
        };

        // Listen for player updates from socket (real-time)
        const handleLobbyUpdate = ({ players: updatedPlayers }) => {
            console.log('👥 Lobby players updated:', updatedPlayers);
            // We could use this instead of polling, but keeping poll for compatibility
        };

        lobbySocket.on('gameStarted', handleGameStarted);
        lobbySocket.on('lobbyPlayersUpdate', handleLobbyUpdate);

        return () => {
            lobbySocket.off('gameStarted', handleGameStarted);
            lobbySocket.off('lobbyPlayersUpdate', handleLobbyUpdate);
        };
    }, [lobbySocket, gameID]);

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (playerName.trim().length >= 2) {
            setScreen('menu');
            setError('');
        } else {
            setError('Name must be at least 2 characters');
        }
    };

    const handleCreateRoom = async () => {
        try {
            const code = generateRoomCode();
            const { matchID } = await lobbyClient.createMatch('dhandho', {
                numPlayers: 5, // Max players
                setupData: { roomCode: code }
            });

            const { playerCredentials } = await lobbyClient.joinMatch('dhandho', matchID, {
                playerID: '0',
                playerName: playerName
            });

            setGameID(matchID);
            setRoomCode(code);
            setPlayerID('0');
            setCredentials(playerCredentials);
            setIsHost(true);
            setScreen('waiting');
            setError('');

            // Join the lobby socket room for synchronization
            if (socketRef.current) {
                socketRef.current.emit('joinLobbyRoom', {
                    matchID,
                    playerName,
                });
            }
        } catch (err) {
            console.error('Failed to create room:', err);
            setError('Failed to create room. Please try again.');
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        if (inputRoomCode.length !== 4) {
            setError('Room code must be 4 characters');
            return;
        }

        try {
            // List all matches and find one with the room code
            const { matches } = await lobbyClient.listMatches('dhandho');
            const match = matches.find(m =>
                m.setupData?.roomCode === inputRoomCode.toUpperCase() &&
                !m.gameover
            );

            if (!match) {
                setError('Room not found');
                return;
            }

            // Find next available player slot
            const availableSlot = match.players.findIndex(p => !p.name);
            if (availableSlot === -1) {
                setError('Room is full');
                return;
            }

            const { playerCredentials } = await lobbyClient.joinMatch('dhandho', match.matchID, {
                playerID: String(availableSlot),
                playerName: playerName
            });

            setGameID(match.matchID);
            setRoomCode(inputRoomCode.toUpperCase());
            setPlayerID(String(availableSlot));
            setCredentials(playerCredentials);
            setIsHost(false);
            setScreen('waiting');
            setError('');

            // Join the lobby socket room for synchronization
            if (socketRef.current) {
                socketRef.current.emit('joinLobbyRoom', {
                    matchID: match.matchID,
                    playerName,
                });
            }
        } catch (err) {
            console.error('Failed to join room:', err);
            setError('Failed to join room. Please try again.');
        }
    };

    const handleStartGame = () => {
        const readyPlayers = players.filter(p => p.name).length;
        if (readyPlayers >= 2 && socketRef.current) {
            // Emit to server - server will broadcast to ALL players including host
            console.log('🎮 Host requesting game start for match:', gameID);
            socketRef.current.emit('startGame', { matchID: gameID });

            // DO NOT set screen locally - wait for server's gameStarted event
            // This ensures all players transition simultaneously
        } else if (readyPlayers < 2) {
            setError('Need at least 2 players to start');
        }
    };

    const handleLeaveRoom = async () => {
        try {
            if (lobbyClient && gameID && playerID && credentials) {
                await lobbyClient.leaveMatch('dhandho', gameID, {
                    playerID: playerID,
                    credentials: credentials
                });
            }
        } catch (err) {
            console.error('Failed to leave room:', err);
        }

        setScreen('menu');
        setGameID(null);
        setPlayerID(null);
        setCredentials(null);
        setPlayers([]);
        setIsHost(false);
        setRoomCode('');
        setInputRoomCode('');
        setError('');
    };

    // Name Entry Screen
    if (screen === 'name') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-md w-full border-2 border-orange-200">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 mb-3 text-center">
                        Dhandho
                    </h1>
                    <p className="text-gray-600 font-semibold text-center mb-8">
                        Indian Business Hustle Card Game
                    </p>

                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Enter Your Name
                            </label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-lg"
                                placeholder="Your name..."
                                maxLength={20}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm font-semibold">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Main Menu Screen
    if (screen === 'menu') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-md w-full border-2 border-orange-200">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 mb-2 text-center">
                        Welcome, {playerName}!
                    </h1>
                    <p className="text-gray-600 font-semibold text-center mb-8">
                        Choose an option to start playing
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleCreateRoom}
                            className="w-full px-6 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            🎲 Create Room
                        </button>

                        <button
                            onClick={() => setScreen('join')}
                            className="w-full px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            🚪 Join Room
                        </button>

                        <button
                            onClick={() => {
                                setPlayerName('');
                                setScreen('name');
                            }}
                            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                        >
                            Change Name
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Join Room Screen
    if (screen === 'join') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-md w-full border-2 border-orange-200">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 mb-8 text-center">
                        Join Room
                    </h1>

                    <form onSubmit={handleJoinRoom} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Enter Room Code
                            </label>
                            <input
                                type="text"
                                value={inputRoomCode}
                                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-2xl font-bold text-center tracking-widest"
                                placeholder="ABCD"
                                maxLength={4}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm font-semibold">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setScreen('menu');
                                    setInputRoomCode('');
                                    setError('');
                                }}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Join
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Waiting Room Screen
    if (screen === 'waiting') {
        const readyPlayers = players.filter(p => p.name).length;
        const canStart = readyPlayers >= 2 && isHost;

        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-2xl w-full border-2 border-orange-200">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 mb-2 text-center">
                        Waiting Room
                    </h1>

                    <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl p-6 mb-6 text-center">
                        <p className="text-white text-sm font-semibold mb-1">Room Code</p>
                        <p className="text-white text-5xl font-black tracking-widest">{roomCode}</p>
                        <p className="text-orange-100 text-sm mt-2">Share this code with friends!</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-gray-800">Players ({readyPlayers}/5)</h3>
                            <span className="text-sm text-gray-600">Min: 2 players</span>
                        </div>

                        <div className="space-y-2">
                            {players.map((player, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-xl ${player.name
                                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300'
                                        : 'bg-gray-100 border-2 border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${player.name ? 'bg-green-500' : 'bg-gray-400'
                                                } flex items-center justify-center text-white font-bold`}>
                                                {idx + 1}
                                            </div>
                                            <span className="font-bold text-gray-800">
                                                {player.name || 'Waiting...'}
                                            </span>
                                        </div>
                                        {player.name && idx === 0 && (
                                            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                                HOST
                                            </span>
                                        )}
                                        {player.name && String(idx) === playerID && idx !== 0 && (
                                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                                YOU
                                            </span>
                                        )}
                                        {player.name && idx === 0 && String(idx) === playerID && (
                                            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                                                YOU (HOST)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleLeaveRoom}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                        >
                            Leave Room
                        </button>

                        {isHost && (
                            <button
                                onClick={handleStartGame}
                                disabled={!canStart}
                                className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${canStart
                                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {readyPlayers < 2 ? 'Need 2+ Players' : 'Start Match'}
                            </button>
                        )}

                        {!isHost && (
                            <div className="flex-1 px-6 py-4 bg-blue-100 border-2 border-blue-300 rounded-xl text-center">
                                <p className="text-blue-800 font-bold">Waiting for host to start...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Playing Screen - Render the actual game
    if (screen === 'playing' && GameComponent) {
        return (
            <GameComponent
                matchID={gameID}
                playerID={playerID}
                credentials={credentials}
            />
        );
    }

    return null;
};

export default DhandhoLobby;
