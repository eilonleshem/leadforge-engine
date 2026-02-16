import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#feecd6',
          200: '#fbd5ad',
          300: '#f8b778',
          400: '#f48f41',
          500: '#f1701c',
          600: '#e25612',
          700: '#bb4011',
          800: '#953416',
          900: '#782d15',
        },
      },
    },
  },
  plugins: [],
}
export default config
