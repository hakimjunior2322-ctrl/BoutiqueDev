module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          400: '#ec4899',
          500: '#ec407a',
          950: '#500724',
        },
        purple: {
          400: '#a855f7',
          500: '#a855f7',
          950: '#3f0f5c',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          950: '#172554',
        },
        cyan: {
          400: '#06b6d4',
          500: '#06b6d4',
          950: '#082f49',
        },
      },
    },
  },
  plugins: [],
}
