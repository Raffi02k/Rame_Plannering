/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html,css}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                municipal: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                // The "Källstorp" color coding system
                team: {
                    red: '#fee2e2',
                    redBorder: '#ef4444',
                    blue: '#dbeafe',
                    blueBorder: '#3b82f6',
                    purple: '#f3e8ff',
                    purpleBorder: '#a855f7',
                    white: '#f3f4f6',
                    whiteBorder: '#9ca3af',
                },
            },
        },
    },
    plugins: [],
}
