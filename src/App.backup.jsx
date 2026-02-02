import React from 'react';

// Simple test to verify React is working
function App() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #fef3c7, #fed7aa, #fecdd3)',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #ea580c, #f43f5e)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        Dhandho Setup Test
                    </h1>
                    <p style={{ color: '#4b5563', fontWeight: '600' }}>
                        Debugging the blank screen issue
                    </p>
                </div>

                {/* Status Card */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '2rem',
                    border: '2px solid #fdba74'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                        ✅ Basic Setup Working
                    </h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ color: '#059669', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            ✓ React is rendering correctly
                        </p>
                        <p style={{ color: '#059669', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            ✓ JavaScript is executing
                        </p>
                        <p style={{ color: '#059669', fontSize: '1.1rem' }}>
                            ✓ Vite dev server is running
                        </p>
                    </div>

                    <div style={{
                        background: '#fef3c7',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginTop: '1.5rem'
                    }}>
                        <h3 style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>
                            Next Steps:
                        </h3>
                        <ol style={{ paddingLeft: '1.5rem', color: '#78350f' }}>
                            <li>If you see this, the basic setup is working!</li>
                            <li>Check the browser console (F12) for any error messages</li>
                            <li>Make sure you ran: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>npm install</code></li>
                            <li>The full game requires boardgame.io to be installed</li>
                        </ol>
                    </div>

                    <div style={{
                        background: '#fee2e2',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginTop: '1.5rem'
                    }}>
                        <h3 style={{ fontWeight: 'bold', color: '#991b1b', marginBottom: '0.5rem' }}>
                            Common Issues:
                        </h3>
                        <ul style={{ paddingLeft: '1.5rem', color: '#7f1d1d' }}>
                            <li><strong>Blank Screen:</strong> Dependencies not installed - run <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>npm install</code></li>
                            <li><strong>Import Errors:</strong> boardgame.io not found - check package.json</li>
                            <li><strong>Tailwind Not Working:</strong> PostCSS config issue - restart dev server</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
