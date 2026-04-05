/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0a0f',
          surface: '#12121a',
          elevated: '#1a1a26',
        },
        border: {
          DEFAULT: '#2a2a3d',
          bright: '#4a4a6a',
        },
        accent: {
          cyan: '#00fff5',
          magenta: '#ff00aa',
          amber: '#ffb800',
          green: '#00ff88',
          red: '#ff3355',
        },
        text: {
          primary: '#e8e8ff',
          muted: '#7070a0',
          inverse: '#0a0a0f',
        },
      },
      fontFamily: {
        display: ['"VT323"', 'monospace'],
        mono: ['"IBM Plex Mono"', '"Share Tech Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 8px rgba(0, 255, 245, 0.4)',
        'glow-magenta': '0 0 8px rgba(255, 0, 170, 0.4)',
        'glow-amber': '0 0 8px rgba(255, 184, 0, 0.4)',
        'glow-green': '0 0 8px rgba(0, 255, 136, 0.4)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
