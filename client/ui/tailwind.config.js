export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-clr': '#0FA958',
        'secondary-clr': '#1B1F2A',
        'tertiary-clr': '#E4E8EE',
        'quarternary-clr': '#E4E8EE',
      },
      boxShadow: {
        'primary-shadow': '0px -8px 25px 0px #00000038',
      },
      height: {
        '90vh': '90vh',
      },
    },
  },
  plugins: [],
};


