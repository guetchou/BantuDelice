
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f9fafb',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { 
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "slide-up": {
          "0%": { 
            opacity: "0",
            transform: "translateY(30px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in-delay-1": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "50%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in-delay-2": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "66%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in-delay-3": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "80%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s ease-out",
        "slide-up-delay-1": "slide-up 0.8s ease-out 0.2s both",
        "slide-up-delay-2": "slide-up 0.8s ease-out 0.4s both",
        "fade-in-delay-1": "fade-in-delay-1 1.2s ease-out",
        "fade-in-delay-2": "fade-in-delay-2 1.4s ease-out",
        "fade-in-delay-3": "fade-in-delay-3 1.6s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
