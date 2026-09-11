/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Colors are driven by CSS variables (see src/global.css) so a single
      // token such as `bg-background` / `text-text` flips automatically
      // between the light and dark palettes defined in constants/theme.ts.
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        "background-element": "rgb(var(--color-background-element) / <alpha-value>)",
        "background-selected": "rgb(var(--color-background-selected) / <alpha-value>)",
        "active-tab-background": "rgb(var(--color-active-tab-background) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-soft": "rgb(var(--color-primary-soft) / <alpha-value>)",
        "primary-pressed": "rgb(var(--color-primary-pressed) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        "success-soft": "rgb(var(--color-success-soft) / <alpha-value>)",
        "info-background": "rgb(var(--color-info-background) / <alpha-value>)",
        "tag-red-bg": "rgb(var(--color-tag-red-bg) / <alpha-value>)",
        "tag-red-text": "rgb(var(--color-tag-red-text) / <alpha-value>)",
        "tag-green-bg": "rgb(var(--color-tag-green-bg) / <alpha-value>)",
        "tag-green-text": "rgb(var(--color-tag-green-text) / <alpha-value>)",
        "tag-gold-bg": "rgb(var(--color-tag-gold-bg) / <alpha-value>)",
        "tag-gold-text": "rgb(var(--color-tag-gold-text) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-disabled": "rgb(var(--color-text-disabled) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
      },
      fontFamily: {
        // Named so they don't collide with Tailwind's font-weight utilities
        // (font-medium / font-semibold / font-bold).
        // Inter — body & UI (full weight range).
        sans: ["Inter_400Regular"],
        label: ["Inter_500Medium"],
        inter: ["Inter_400Regular"],
        // DM Serif Display — titles/headings. Single weight (400) only.
        heading: ["DMSerifDisplay_400Regular"],
        title: ["DMSerifDisplay_400Regular"],
        serif: ["DMSerifDisplay_400Regular"],
      },
    },
  },
  plugins: [],
};
