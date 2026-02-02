import React from 'react';
import { CardType, PropertyColor } from '../game/constants';

// Color mapping for Tailwind classes
const colorClasses = {
    [PropertyColor.PINK]: 'bg-pink-500',
    [PropertyColor.DARK_BLUE]: 'bg-blue-900',
    [PropertyColor.GREEN]: 'bg-green-600',
    [PropertyColor.YELLOW]: 'bg-yellow-500',
    [PropertyColor.RED]: 'bg-red-600',
    [PropertyColor.BLACK]: 'bg-gray-900',
    [PropertyColor.LIGHT_GREEN]: 'bg-green-300',
};

const Card = ({ cardData, onClick, selected = false, className = '' }) => {
    if (!cardData) return null;

    // Property Card
    if (cardData.type === CardType.PROPERTY) {
        const colorClass = colorClasses[cardData.color] || 'bg-gray-500';

        return (
            <div
                onClick={onClick}
                className={`
          w-32 h-44 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200
          hover:scale-105 hover:shadow-xl
          ${selected ? 'ring-4 ring-yellow-400 scale-105' : ''}
          ${className}
        `}
            >
                {/* Colored Header */}
                <div className={`${colorClass} h-12 rounded-t-lg flex items-center justify-center`}>
                    <h3 className="text-white font-bold text-xs text-center px-2">
                        {cardData.name}
                    </h3>
                </div>

                {/* White Body */}
                <div className="bg-white h-32 rounded-b-lg p-3 flex flex-col justify-between">
                    <div className="flex-1 flex items-center justify-center">
                        <div className={`w-16 h-16 rounded-full ${colorClass} opacity-20`}></div>
                    </div>

                    {/* Price Tag */}
                    <div className="text-center">
                        <span className="text-2xl font-bold text-gray-800">₹{cardData.value}Cr</span>
                    </div>
                </div>
            </div>
        );
    }

    // Action Card
    if (cardData.type === CardType.ACTION) {
        const gradients = {
            SCAM_1992: 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700',
            VASOOLI_BHAI: 'bg-gradient-to-br from-red-600 via-red-700 to-orange-600',
            JUGAAD: 'bg-gradient-to-br from-yellow-500 via-amber-600 to-green-600',
            SHAGUN: 'bg-gradient-to-br from-pink-500 via-rose-600 to-red-600',
            ABBA_NAHI_MANENGE: 'bg-gradient-to-br from-blue-600 via-sky-700 to-cyan-600',
            PASS_GO: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600',
        };

        const gradient = gradients[cardData.id] || 'bg-gradient-to-br from-gray-600 to-gray-800';

        return (
            <div
                onClick={onClick}
                className={`
          w-32 h-44 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200
          hover:scale-105 hover:shadow-2xl
          ${selected ? 'ring-4 ring-yellow-400 scale-105' : ''}
          ${gradient}
          ${className}
        `}
            >
                <div className="h-full p-4 flex flex-col items-center justify-center text-white">
                    {/* Action Icon */}
                    <div className="text-4xl mb-2">
                        {cardData.id === 'SCAM_1992' && '🎭'}
                        {cardData.id === 'VASOOLI_BHAI' && '💰'}
                        {cardData.id === 'JUGAAD' && '🎯'}
                        {cardData.id === 'SHAGUN' && '🎉'}
                        {cardData.id === 'ABBA_NAHI_MANENGE' && '🚫'}
                        {cardData.id === 'PASS_GO' && '🎲'}
                    </div>

                    {/* Action Name */}
                    <h3 className="font-bold text-sm text-center mb-2">
                        {cardData.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-center opacity-90 leading-tight">
                        {cardData.description}
                    </p>
                </div>
            </div>
        );
    }

    // Money Card
    if (cardData.type === CardType.MONEY) {
        return (
            <div
                onClick={onClick}
                className={`
          w-32 h-44 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200
          hover:scale-105 hover:shadow-xl
          bg-gradient-to-br from-green-400 to-emerald-600
          border-4 border-green-600
          ${selected ? 'ring-4 ring-yellow-400 scale-105' : ''}
          ${className}
        `}
            >
                <div className="h-full p-4 flex flex-col items-center justify-center text-white">
                    {/* Currency Badge */}
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-2 shadow-lg">
                        <span className="text-3xl font-black text-green-600">₹</span>
                    </div>

                    {/* Value */}
                    <div className="text-center">
                        <span className="text-3xl font-black drop-shadow-lg">
                            {cardData.value}
                        </span>
                        <p className="text-sm font-semibold mt-1">Crore</p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default Card;
