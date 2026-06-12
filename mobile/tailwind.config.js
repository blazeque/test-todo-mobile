module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto_400Regular'],
        'roboto-bold': ['Roboto_700Bold'],
      },
    },
  },
  plugins: [],
};
