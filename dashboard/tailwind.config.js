/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        mist: "#f4f1ea",
        clay: "#cf7448",
        pine: "#46635b",
        wheat: "#d7c6a0"
      },
      fontFamily: {
        sans: ["Instrument Sans", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        paper: "0 20px 60px rgba(23, 33, 43, 0.12)"
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        ctwdesk: {
          "primary": "#cf7448",
          "secondary": "#46635b",
          "accent": "#d7c6a0",
          "neutral": "#17212b",
          "base-100": "#f8f4ec",
          "base-200": "#efe7d8",
          "base-300": "#e5dac4",
          "info": "#4976a6",
          "success": "#4f7d58",
          "warning": "#c38a2e",
          "error": "#b84b42"
        }
      }
    ]
  }
};
