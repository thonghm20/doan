/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./public/index.html"
],
  theme: {
    fontFamily:{
      main:['Poppins', 'sans-serif']
    },
    listStyleType: {
      square: 'square',
      roman: 'upper-roman',
    },
    extend: {
      gridTemplateRows: {
        // Simple 16 row grid
        '10': 'repeat(10, minmax(0, 1fr))',

        // Complex site-specific row configuration
        'layout': '200px minmax(900px, 1fr) 100px',
      },
      width:{
        main:'1220px '
      },
      backgroundColor:{
        main:'red',
        overlay:'rgba(0,0,0,0.3)'
      },
      colors:{
        main:"red"
      },
      flex:{
        "2": '2 2 0%',
        "3": '3 3 0%',
        "4": '4 4 0%',
        "5": '5 5 0%',
        "6": '6 6 0%',
        "7": '7 7 0%',
        "8": '8 8 0%',

        

      },
      keyframes:  {
        'slide-top':{
          '0%': {
            '-webkit-transform': 'translateY(30px);',
                   transform: 'translateY(30px);'
          },
          '100%' :{
           ' -webkit-transform': 'translateY(0px);',
                   transform: 'translateY(0px);'
          }
        },
         'slide-right': {
          '0% ':{
           ' -webkit-transform': 'translateX(-1000px)',
                    transform: 'translateX(-1000px)',
          },
          '100%': {
           ' -webkit-transform': 'translateX(0)',
                    transform: 'translateX(0)',
          }
        },
        'slide-top-sm':{
          '0%': {
            '-webkit-transform': 'translateY(8px);',
                   transform: 'translateY(8px);'
          },
          '100%' :{
           ' -webkit-transform': 'translateY(0px);',
                   transform: 'translateY(0px);'
          }
        },
       'scale-up-center': {
          '0%' : {
           ' -webkit-transform': 'scale(0.5);',
                    transform: 'scale(0.5);'
          },
          '100%' : {
           ' -webkit-transform': 'scale(1);',
                    transform: 'scale(1);'
          }
        },
        'slide-left': {
          '0%': {
            '-webkit-transform': 'translateX(0)',
            transform: 'translateX(0)'
          },
          '100%': {
            '-webkit-transform': 'translateX(-px)',
            transform: 'translateX(-px)'
          }
        },
        'menu-slide-down': {
          '0%': {
            '-webkit-transform': 'translateY(-100%)',
            transform: 'translateY(-100%)',
            opacity: 0
          },
          '100%': {
            '-webkit-transform': 'translateY(0)',
            transform: 'translateY(0)',
            opacity: 1
          }
        }
        
      },
      animation:{
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top-sm': 'slide-top-sm 0.2s linear both;',
        'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'scale-up-center': 'scale-up-center 0.15s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;',
       'slide-left':'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      ' menu-slide-down': 'menu-slide-down 0.5s ease-in-out;'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({strategy:'class'}),
  ],
  mode:'jit'
}