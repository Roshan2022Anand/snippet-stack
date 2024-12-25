import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary:'var(--bg-primary)',
        bgSecondary:'var(--bg-secondary)',
        textPrimary:'var(--text-color)',
        accentPrimary:'var(--accent-primary)'
      },
    },
  },
  plugins: [],
} satisfies Config;