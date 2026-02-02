/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom property colors matching the game
                pink: {
                    DEFAULT: '#ec4899',
                    500: '#ec4899',
                },
                darkBlue: {
                    DEFAULT: '#1e3a8a',
                    900: '#1e3a8a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'card-flip': 'cardFlip 0.6s ease-in-out',
            },
        },
    },
    plugins: [],
}
