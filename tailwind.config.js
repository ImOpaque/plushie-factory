/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "Fredoka", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"],
        numbers: ["Russo One", "system-ui", "sans-serif"],
      },
      colors: {
        /** Near-black through charcoal surfaces */
        surface: {
          DEFAULT: "#0c0c0f",
          raised: "#14141a",
          card: "#1a1a22",
          hover: "#22222c",
        },
        /** Royal blue family — accents, CTAs, highlights */
        royal: {
          DEFAULT: "#2d4acb",
          bright: "#4a6ef7",
          glow: "#6b8cff",
          deep: "#1e3585",
        },
        /** Silver / off-white typography */
        silver: {
          DEFAULT: "#c4c8d4",
          muted: "#8b90a0",
          bright: "#eef0f6",
          dim: "#6a6f7e",
        },
      },
      boxShadow: {
        royal: "0 0 24px -4px rgba(74, 110, 247, 0.35)",
        panel: "0 4px 24px rgba(0, 0, 0, 0.45)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
      },
    },
  },
  plugins: [],
};
