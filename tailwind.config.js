const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;
const plugin = require('tailwindcss/plugin');

function borderSideColors({ addUtilities, theme, variants }) {
  const colors = flattenColorPalette(theme('borderColor'));
  delete colors['default'];

  const colorMap = Object.keys(colors).map((color) => ({
    [`.border-t-${color}`]: { borderTopColor: colors[color] },
    [`.border-r-${color}`]: { borderRightColor: colors[color] },
    [`.border-b-${color}`]: { borderBottomColor: colors[color] },
    [`.border-l-${color}`]: { borderLeftColor: colors[color] },
  }));
  const utilities = Object.assign({}, ...colorMap);

  addUtilities(utilities, variants('borderColor'));
}

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx', './src/**/*.js', './src/**/*.jsx'],
  darkMode: 'media',
  theme: {
    extend: {
      margin: {
        '-25': '-6.25rem',
        '-tabl': '-68px',
        '-tabr': '-100px',
        sidebar: '220px',
      },
      padding: {
        tabl: '68px',
        tabr: '100px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      pointerEvents: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms'), plugin(borderSideColors)],
};
