/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                neutral: {
                    950: '#0a0a0f',
                    900: '#111118',
                    800: '#1a1a24',
                },
            },
        },
    },
    plugins: [],
}
