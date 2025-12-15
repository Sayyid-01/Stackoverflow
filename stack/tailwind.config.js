/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        softPulse: {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 rgba(59,130,246,0.6)" },
          "50%": { transform: "scale(1.08)", boxShadow: "0 0 20px rgba(59,130,246,0.8)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 rgba(59,130,246,0.6)" },
        },
        slideUp: {
          '0%': { transform: 'translateY(50%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        softPulse: "softPulse 1.6s infinite ease-in-out",
        slideUp: 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}