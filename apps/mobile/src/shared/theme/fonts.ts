import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export const fontAssets = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  DMSerifDisplay_400Regular,
};

export const FontFamilies = {
  // Inter — workhorse for body text, labels, and UI. Full weight range.
  primary: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  // DM Serif Display — display face for titles/headings. It ships a single
  // weight (400) only, so every slot maps to it.
  secondary: {
    regular: 'DMSerifDisplay_400Regular',
    medium: 'DMSerifDisplay_400Regular',
    semibold: 'DMSerifDisplay_400Regular',
    bold: 'DMSerifDisplay_400Regular',
  },
} as const;
