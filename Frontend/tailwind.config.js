/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      
      keyframes: {
        'bg-expand': {
          '0%': { 'background-size': '0% 100%' },
          '100%': { 'background-size': '100% 100%' },
        },
      },
      animation: {
        'bg-expand': 'bg-expand 0.5s ease-out forwards',
      },
      keyframes: {
        'underline-expand': {
          '0%': { 'text-decoration-thickness': '0', 'text-underline-offset': '0' },
          '100%': { 'text-decoration-thickness': '2px', 'text-underline-offset': '8px' },
        },
      },
      animation: {
        'underline-expand': 'underline-expand 0.3s ease-out forwards',
      },
      fontFamily: {
        suse: ['SUSE', 'sans-serif'],  // Add this line to extend fonts
        chakra: ['"Chakra Petch"', 'sans-serif'], // Chakra Petch font
      },
    },
  },
  plugins: [],
}
