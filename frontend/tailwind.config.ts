import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f62fe',
        secondary: '#ff6f00'
      }
    }
  },
  plugins: []
};

export default config;

