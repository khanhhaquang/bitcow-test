const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/**/*.module.scss', './public/index.html'],
  theme: {
    extend: {
      colors: {
        gray_01: 'rgba(255, 255, 255, 0.1)',
        gray_05: 'rgba(255, 255, 255, 0.5)',
        white_gray_01: 'rgba(4, 18, 25, 0.1)',
        white_gray_bg: '#F0F1F6',
        white_table: '#FAFAFA',
        color_main_2: 'var(--obric-color_main_2)',
        color_list_hover: 'var(--obric-color_list_hover)',
        color_disabled: 'var(--obric-color_disabled)',
        color_bg_token: 'var(--obric-color_bg_token)',
        color_border: 'var(--obric-color_border)',
        color_text_1: 'var(--obric-color_text_1)',
        color_text_2: 'var(--obric-color_text_2)',
        color_text_3: 'var(--obric-color_text_3)',
        color_text_4: 'rgba(255, 255, 255, 0.6)',
        color_bg_panel: 'var(--obric-color_bg_panel)',
        color_bg_1: 'var(--obric--color_bg_1)',
        color_bg_table: 'var(--obric-color_bg_table)',
        color_bg_hover: 'var(--obric-color_bg_hover)',
        color_bg_row: 'var(--obric-color_bg_row)',
        color_bg_input: 'var(--obric-color_bg_input)',
        color_mask: 'var(--obric-color_mask)',
        color_bg_tooltip: 'var(--obric-color_bg_tooltip)',
        color_border_2: 'var(--obric-color_border_2)',
        color_main: '#FF6827',
        color_minor: '#FFCC4A',
        color_bg_2: '#0E1114',
        color_bg_3: '#272B30',
        color_tooltip: '#363B42',
        gray_02: 'rgba(255, 255, 255, 0.2)',
        gray_004: 'rgba(255, 255, 255, 0.04)',
        gray_008: 'rgba(255, 255, 255, 0.08)',
        gray_016: 'rgba(255, 255, 255, 0.16)',
        color_error: '#FF6666',
        table_row_bg: '#1E1E1E',
        white_gray_008: 'rgba(4, 18, 25, 0.08)',
        white_color_list_hover: '#EBEDF4'
      },
      height: {
        13: '3.25rem',
        15: '3.75rem'
      },
      backgroundImage: {
        landingBgDark: 'url(resources/img/landingPage/dark-bg.png)',
        landingBgWhite: 'url(resources/img/landingPage/white-bg.png)',
        darkBg: 'url(resources/img/bg.png)',
        darkDesktopBg: 'url(resources/img/desktopBg.png)',
        whiteBg: 'url(resources/img/whiteBg.png);',
        button_gradient:
          'linear-gradient(264.61deg, rgba(255, 104, 39, 0.44) 0.36%, #FF6827 21.67%, #FF6827 100%)',
        color_minor_1: 'linear-gradient(90deg, #B0FF4A 0%, #70F0E1 100%);',
        launch_btn: 'linear-gradient(90deg, #B0FF4A 0.21%, #70F0E1 105.26%)',
        box: 'url(resources/img/boxBg.png)',
        boxBorder:
          'linear-gradient(90deg, rgba(176, 255, 74, 0.6) 0%, #272B2C 14.81%, #272B2C 83.86%, rgba(176, 255, 74, 0.6) 100%);',
        dotBg: 'url(resources/img/dotBg.png)',
        accountGradientBg:
          'linear-gradient(51.34deg, rgba(255, 104, 39, 0.3) 0%, #FF792C 24.54%, #FF9C37 48.97%, #FF6827 70.53%, rgba(255, 104, 39, 0.3) 95.27%)',
        accountBg: 'url(resources/img/accountBg.svg)'
      }
    },
    screens: {
      desktop: { max: '99999px' }, // desktop first
      laptop: { max: '1439px' },
      tablet: { max: '1023px' }
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
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
      home: '-4px 8px 32px rgba(211, 207, 230, 0.4)',
      dropdown: '0px 4px 8px rgba(0, 0, 0, 0.1)'
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
