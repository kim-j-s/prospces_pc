module.exports = {
  mode: 'jit', // Just-In-Time Compiler
  purge: ['./src/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    // 기본적인거 수정
    colors: {
      gray: {
        darkest: '#1f2d3d',
        dark: '#3c4858',
        DEFAULT: '#757575',
        light: '#e0e6ed',
        lightest: '#f9fafc',
      },
      black: {
        DEFAULT: '#222222'
      }
    },
    fontFamily: {
      sans: ['Spoqa Han Sans Neo', 'sans-serif'],
      eng: ['Poppins', 'sans-serif'],
    },
    // 추가할 경우
    extend: {
      colors: {
        psred: '#D13B40',
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}