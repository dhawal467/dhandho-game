import React from 'react';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 mb-2">
                        Dhandho - Test Version
                    </h1>
                    <p className="text-gray-600 font-semibold">If you see this, React and Tailwind are working!</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-orange-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Status</h2>
                    <p className="text-gray-600">The full game is loading from App.jsx</p>
                    <p className="text-gray-600 mt-2">Check the browser console (F12) for any errors.</p>

                    <div className="mt-6 p-4 bg-green-100 rounded-lg">
                        <p className="text-green-800 font-semibold">✅ React is rendering</p>
                        <p className="text-green-800 font-semibold">✅ Tailwind CSS is working</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
