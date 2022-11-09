const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/**/*.module.scss', './public/index.html'],
  theme: {
    extend: {
      colors: {
        color_main: 'rgba(255, 237, 72, 1)',
        color_minor: '#FFCC4A',
        color_text_1: '#ffffff',
        color_text_2: 'rgba(255, 255, 255, 0.5)',
        color_text_2: 'rgba(255, 255, 255, 0.5)',
        color_bg_1: '#000000',
        color_bg_2: '#0E1114',
        color_bg_3: '#272B30',
        color_mask: 'rgba(0, 0, 0, 0.9)',
        color_tooltip: '#363B42',
        gray_02: 'rgba(255, 255, 255, 0.2)',
        gray_03: 'rgba(255, 255, 255, 0.3)',
        gray_05: 'rgba(255, 255, 255, 0.5)',
        gray_004: 'rgba(255, 255, 255, 0.04)',
        gray_008: 'rgba(255, 255, 255, 0.08)',
        color_error: '#FF6666'
      },
      backgroundImage: {
        main: 'url(resources/img/mainBg.png)',
        secondary: 'url(resources/img/bg.png)',
        button_gradient: 'linear-gradient(88.99deg, #FFED48 0%, #00FFF0 100%)',
        color_minor_1: 'linear-gradient(90deg, #B0FF4A 0%, #70F0E1 100%);',
        launch_btn: 'linear-gradient(90deg, #B0FF4A 0.21%, #70F0E1 105.26%)',
        box: 'url(resources/img/boxBg.png)',
        boxBorder:
          'linear-gradient(90deg, rgba(176, 255, 74, 0.6) 0%, #272B2C 14.81%, #272B2C 83.86%, rgba(176, 255, 74, 0.6) 100%);',
        dotBg: 'url(resources/img/dotBg.png)',
        accountBg: 'url(resources/img/accountBg.svg)'
      }
    },
    screens: {
      desktop: { max: '99999px' }, // desktop first
      laptop: { max: '1439px' }
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
      color_bg_1: '#000000',
      color_bg_2: '#0E1114',
      color_bg_3: '#272B30',
      color_mask: 'rgba(0, 0, 0, 0.9)',
      color_tooltip: '#363B42',
      color_list_hover: 'rgba(255, 255, 255, 0.08)'
    }),
    boxShadow: {
      sm: '4px 4px 0px #2D2D2D',
      md: '0px 4px 8px rgba(0, 0, 0, 0.25)',
      figma: '8px 8px 0px #2D2D2D',
      main1: '0px 4px 35px rgba(0, 0, 0, 0.05)',
      home: '-4px 8px 32px rgba(211, 207, 230, 0.4)'
    },
    fontFamily: {
      Furore: 'Furore, sans-serif',
      Rany: 'Rany, sans-serif'
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none'
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        },
        '.text-gradient-primary': {
          background: 'linear-gradient(90.74deg, #5687F8 -17.79%, #7743E6 120.43%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent'
        },
        '.text-gradient-secondary': {
          background: 'linear-gradient(273.38deg, #8032FF 19.81%, #472394 87.9%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent'
        }
      });
    }),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio')
  ],
  future: {
    hoverOnlyWhenSupported: true
  }
};
