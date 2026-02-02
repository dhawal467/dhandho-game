import React, { useState } from 'react';
import Card from './Card';
import { CardType, PropertyColor, PropertySets, ActionCards } from '../game/constants';

const GameBoard = ({ G, ctx, moves, playerID }) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [actionTarget, setActionTarget] = useState(null);

    // Safety check for game state
    if (!G || !G.players || !ctx) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">Loading game...</p>
                </div>
            </div>
        );
    }

    // Get current player ID safely
    const currentPlayerId = playerID || ctx.currentPlayer || '0';
    const currentPlayer = G.players[currentPlayerId];

    // Get opponent ID safely
    const opponentId = currentPlayerId === '0' ? '1' : '0';
    const opponent = G.players[opponentId];

    // Additional safety check
    if (!currentPlayer || !opponent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">Initializing players...</p>
                </div>
            </div>
        );
    }

    const handleCardClick = (cardIndex) => {
        setSelectedCard(cardIndex);
        setMenuOpen(true);
    };

    const handlePlayMoney = () => {
        if (selectedCard !== null) {
            moves.playMoney(selectedCard);
            setSelectedCard(null);
            setMenuOpen(false);
        }
    };

    const handlePlayProperty = () => {
        if (selectedCard !== null) {
            moves.playProperty(selectedCard);
            setSelectedCard(null);
            setMenuOpen(false);
        }
    };

    const handlePlayAction = () => {
        if (selectedCard !== null) {
            const card = currentPlayer.hand[selectedCard];

            // Simple action handling - for complex actions, you'd show a target selector
            if (card.id === ActionCards.PASS_GO.id) {
                moves.playAction(selectedCard);
                setSelectedCard(null);
                setMenuOpen(false);
            } else {
                // For other actions, show target selection
                setActionTarget(card.id);
                setMenuOpen(false);
            }
        }
    };

    const handleActionWithTarget = (targetPlayerId, targetData = {}) => {
        if (selectedCard !== null) {
            moves.playAction(selectedCard, targetPlayerId, targetData);
            setSelectedCard(null);
            setActionTarget(null);
        }
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setSelectedCard(null);
    };

    const countCompleteSets = (player) => {
        let count = 0;
        Object.entries(player.properties).forEach(([color, cards]) => {
            const setSize = PropertySets[color]?.setSize || 0;
            if (cards.length >= setSize) count++;
        });
        return count;
    };

    const calculateBankValue = (bank) => {
        return bank.reduce((sum, card) => sum + (card.value || 0), 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Game Header */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 mb-2">
                        Dhandho
                    </h1>
                    <p className="text-gray-600 font-semibold">Indian Business Hustle Card Game</p>

                    {/* Turn Indicator */}
                    <div className="mt-4">
                        {ctx.currentPlayer === currentPlayerId ? (
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg">
                                <span className="text-2xl">👉</span>
                                <span className="font-bold text-lg">Your Turn!</span>
                                <span className="px-3 py-1 bg-white/30 rounded-lg font-black">
                                    Actions: {G.actionsRemaining}/3
                                </span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl">
                                <span className="font-semibold">Waiting for Player {parseInt(ctx.currentPlayer) + 1}...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Opponent's Area (Top) */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Opponent</h2>
                        <div className="flex gap-4">
                            <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow">
                                Bank: ₹{calculateBankValue(opponent.bank)}Cr
                            </span>
                            <span className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold shadow">
                                Sets: {countCompleteSets(opponent)}/3
                            </span>
                            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow">
                                Hand: {opponent.hand.length}
                            </span>
                        </div>
                    </div>

                    {/* Opponent's Properties */}
                    <div className="grid grid-cols-7 gap-3">
                        {Object.entries(PropertySets).map(([color, setInfo]) => {
                            const cards = opponent.properties[color] || [];
                            const isComplete = cards.length >= setInfo.setSize;

                            return (
                                <div key={color} className="text-center">
                                    <div className={`
                    p-2 rounded-lg ${isComplete ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-50'}
                  `}>
                                        <p className="text-xs font-semibold text-gray-700 mb-1">{setInfo.name}</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {cards.length}/{setInfo.setSize}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Center Area - Deck & Discard */}
                <div className="flex justify-center gap-8 mb-6">
                    {/* Deck */}
                    <div className="text-center">
                        <div className="w-32 h-44 bg-gradient-to-br from-orange-600 to-rose-600 rounded-lg shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border-4 border-orange-700">
                            <div className="text-white">
                                <p className="text-4xl font-black mb-2">🎴</p>
                                <p className="text-sm font-bold">Deck</p>
                                <p className="text-lg font-bold">{G.deck.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Discard Pile */}
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-2">Discard Pile</p>
                        {G.discardPile.length > 0 ? (
                            <Card cardData={G.discardPile[G.discardPile.length - 1]} />
                        ) : (
                            <div className="w-32 h-44 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <p className="text-gray-400 text-sm">Empty</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Current Player's Area (Bottom) */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-orange-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Your Area</h2>
                        <div className="flex gap-4">
                            <span className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold shadow-lg">
                                Bank: ₹{calculateBankValue(currentPlayer.bank)}Cr
                            </span>
                            <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold shadow-lg">
                                Sets: {countCompleteSets(currentPlayer)}/3
                            </span>

                            {/* End Turn Button */}
                            {ctx.currentPlayer === currentPlayerId && (
                                <button
                                    onClick={() => moves.endTurn()}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg font-bold shadow-lg hover:from-orange-600 hover:to-rose-600 transition-all hover:shadow-xl">
                                    End Turn
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Current Player's Properties */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3">Your Properties</h3>
                        <div className="grid grid-cols-7 gap-4">
                            {Object.entries(PropertySets).map(([color, setInfo]) => {
                                const cards = currentPlayer.properties[color] || [];
                                const isComplete = cards.length >= setInfo.setSize;

                                return (
                                    <div key={color}>
                                        <div className={`
                      p-3 rounded-xl ${isComplete ? 'bg-green-100 ring-4 ring-green-500' : 'bg-gray-100'}
                    `}>
                                            <p className="text-xs font-bold text-gray-700 mb-2">{setInfo.name}</p>
                                            <p className="text-2xl font-black text-gray-900 mb-1">
                                                {cards.length}/{setInfo.setSize}
                                            </p>
                                            {isComplete && <p className="text-xs text-green-700 font-bold">COMPLETE!</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Current Player's Hand */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-3">Your Hand ({currentPlayer.hand.length}/7)</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {currentPlayer.hand.map((card, index) => (
                                <Card
                                    key={index}
                                    cardData={card}
                                    onClick={() => handleCardClick(index)}
                                    selected={selectedCard === index}
                                    className="flex-shrink-0"
                                />
                            ))}
                            {currentPlayer.hand.length === 0 && (
                                <p className="text-gray-400 italic">No cards in hand</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Action Menu (Dialog) */}
            {menuOpen && selectedCard !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeMenu}>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Play Card As...</h3>

                        <div className="space-y-3">
                            {currentPlayer.hand[selectedCard]?.type === CardType.PROPERTY && (
                                <button
                                    onClick={handlePlayProperty}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Play as Property
                                </button>
                            )}

                            {currentPlayer.hand[selectedCard]?.type === CardType.ACTION && (
                                <button
                                    onClick={handlePlayAction}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Play Action
                                </button>
                            )}

                            {(currentPlayer.hand[selectedCard]?.value || currentPlayer.hand[selectedCard]?.type === CardType.MONEY) && (
                                <button
                                    onClick={handlePlayMoney}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Play as Money (₹{currentPlayer.hand[selectedCard]?.value || 0}Cr)
                                </button>
                            )}

                            <button
                                onClick={closeMenu}
                                className="w-full px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Win Screen */}
            {ctx.gameover && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-4">
                            Game Over!
                        </h2>
                        <p className="text-2xl font-bold text-gray-800">
                            {ctx.gameover.winner === currentPlayerId ? "You Won! 🏆" : "Opponent Wins!"}
                        </p>
                        <p className="text-gray-600 mt-4">3 complete property sets achieved!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;
