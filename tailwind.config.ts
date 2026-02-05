import type { Config } from "tailwindcss";
import {heroui} from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	screens: {
  		xs: '500px',
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px',
  		'3xl': '2000px'
  	},
  	extend: {
  		fontFamily: {
  			geist:["var(--font-geist-sans)"],
  			mono:["var(--font-geist-mono)"]
  		},
       backgroundImage: {
        gradientBlue: 'linear-gradient(to bottom, #000510 40%, #031438)',
      },
      colors:{
         redColor:'#e1002d'
      }
  	}
  },
  darkMode:"class",
  plugins: [heroui({
     // prefix: "heroui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "light", // default theme to extend on custom themes
      layout: {
        radius:{
           medium: "8px", // rounded-medium
        },
      }, // common layout tokens (applied to all themes)
    themes: {
       light: {
          colors: {
            primary: {
              DEFAULT: '#047857',
              foreground: '#ffffff'
            },
          }
        },
        dark: {
          colors: {
           primary: {
              DEFAULT: '#4379EE',
              foreground: '#ffffff'
            },
          }
        },
      },
  }),
      require("tailwindcss-animate")
],
};
export default config;
