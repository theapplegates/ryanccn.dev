const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{11ty.js,njk,liquid,md}',
    './src/_11ty/shortcodes/*.js',
    './src/assets/scripts/theme.ts',
  ],
  darkMode: 'class',

  theme: {
    colors: {
      'transparent': colors.transparent,
      'black': colors.black,
      'white': colors.white,
      'current': colors.current,

      'fg': 'rgba(var(--fg) / <alpha-value>)',
      'fg-brighter': 'rgba(var(--fg-brighter) / <alpha-value>)',
      'fg-less-dimmed': 'rgba(var(--fg-less-dimmed) / <alpha-value>)',
      'fg-dimmed': 'rgba(var(--fg-dimmed) / <alpha-value>)',
      'accent': 'rgba(var(--accent) / <alpha-value>)',
      'accent-lighter': 'rgba(var(--accent-lighter) / <alpha-value>)',

      'background': 'rgba(var(--background) / <alpha-value>)',
      'surface': 'rgba(var(--surface) / <alpha-value>)',
      'surface-hover': 'rgba(var(--surface-hover) / <alpha-value>)',

      'tailwind': {
        yellow: colors.yellow,
        amber: colors.amber,
        sky: colors.sky,
        green: colors.green,
      },

      'brand': {
        hn: '#f0652f',
        github: '#181717',
        firefish: '#eb6f92',
        mastodon: '#6364ff',
        threads: '#000000',
        kofi: '#ff5e5b',
        discord: '#5865f2',
        modrinth: '#00af5c',
      },
    },

    extend: {
      typography: {
        DEFAULT: {
          css: {
            'blockquote': {
              'font-style': 'normal',
            },
            'blockquote p:first-of-type::before': {
              content: '',
            },
            'blockquote p:last-of-type::after': {
              content: '',
            },
          },
        },
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],
};
