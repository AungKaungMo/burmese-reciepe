/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/shared/styles/global.css';

import { Platform } from 'react-native';

import { FontFamilies } from './fonts';

export const Colors = {
  light: {
    // Surfaces
    background: '#FFF8ED', // App background — Rice cream
    card: '#FFFFFF', // Card surface — White
    backgroundElement: '#F4EADA', // Elevated surface — derived (light spec omits it)
    backgroundSelected: '#EADBC7', // Selected surface — derived (light spec omits it)
    activeTabBackground: '#FAF0E6', // Active tab pill — Linen
    // Brand
    primary: '#B94A35', // Primary — Clay red
    primarySoft: '#F8E3DD', // Primary soft — Pale blush surface
    primaryPressed: '#8C2F24', // Primary pressed — Dark clay
    accent: '#E8A23A', // Accent — Turmeric gold
    accentSoft: '#FFF1D8', // Accent soft — Pale gold surface
    success: '#476A45', // Success / fresh — Leaf green
    successSoft: '#EAF1E7', // Success soft — Pale green surface
    infoBackground: '#F8F1E7', // Info surface — Pale sand
    tagRedBg: '#F8E3DD',
    tagRedText: '#B94A35',
    tagGreenBg: '#EAF1E7',
    tagGreenText: '#476A45',
    tagGoldBg: '#FBF0D9',
    tagGoldText: '#755A2C',
    // Text
    text: '#2B211B', // Main text — Dark brown
    textSecondary: '#74665D', // Secondary text — Warm gray
    textDisabled: '#A89C8F', // Disabled text — derived (light spec omits it)
    // Feedback & lines
    border: '#E8D9C9', // Border — Soft beige
    error: '#B42318', // Error — Deep red
    overlay: '#00000099', // Image overlay — Black 60% (kept dark for legible on-image text)
  },
  dark: {
    // Surfaces
    background: '#171310', // Background — Espresso black
    card: '#211B17', // Card surface — Dark cocoa
    backgroundElement: '#2B231E', // Elevated surface — Warm charcoal
    backgroundSelected: '#3A2A20', // Selected surface — Deep clay
    activeTabBackground: '#3A2A20', // Active tab pill — Deep clay (dark counterpart of Linen)
    // Brand
    primary: '#E06B55', // Primary — Light clay
    primarySoft: '#4A2C27', // Primary soft — Deep blush surface
    primaryPressed: '#F07B66', // Primary pressed — Soft coral
    accent: '#F2B84B', // Accent — Turmeric gold
    accentSoft: '#4A3820', // Accent soft — Deep gold surface
    success: '#76A36F', // Success — Fresh leaf
    successSoft: '#263C29', // Success soft — Deep green surface
    infoBackground: '#3A3025', // Info surface — Deep sand
    tagRedBg: '#4A2C27',
    tagRedText: '#E06B55',
    tagGreenBg: '#263C29',
    tagGreenText: '#76A36F',
    tagGoldBg: '#47391F',
    tagGoldText: '#F2D79B',
    // Text
    text: '#FFF6EA', // Main text — Rice white
    textSecondary: '#C5B5A8', // Secondary text — Warm gray
    textDisabled: '#80736A', // Disabled text — Muted brown
    // Feedback & lines
    border: '#493B32', // Border — Soft brown
    error: '#FF8A7F', // Error — Soft red
    overlay: '#00000099', // Image overlay — Black 60%
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  primary: FontFamilies.primary.regular,
  secondary: FontFamilies.secondary.regular,
  ...Platform.select({
    ios: {
      /** iOS `UIFontDescriptorSystemDesignDefault` */
      sans: FontFamilies.primary.regular,
      /** iOS `UIFontDescriptorSystemDesignSerif` */
      serif: 'ui-serif',
      /** iOS `UIFontDescriptorSystemDesignRounded` */
      rounded: 'ui-rounded',
      /** iOS `UIFontDescriptorSystemDesignMonospaced` */
      mono: 'ui-monospace',
    },
    default: {
      sans: FontFamilies.primary.regular,
      serif: 'serif',
      rounded: 'normal',
      mono: 'monospace',
    },
    web: {
      sans: FontFamilies.primary.regular,
      serif: 'var(--font-serif)',
      rounded: 'var(--font-rounded)',
      mono: 'var(--font-mono)',
    },
  }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
