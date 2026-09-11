import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamilies, Fonts, ThemeColor } from '@/shared/theme';
import { useTheme } from '@/shared/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  font?: keyof typeof FontFamilies;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  font,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const isHeading = type === 'title' || type === 'subtitle';
  const weight =
    type === 'smallBold'
      ? 'bold'
      : isHeading
        ? 'semibold'
        : type === 'default' || type === 'small'
          ? 'medium'
          : 'regular';
  // Headings default to the DM Serif Display face; everything else to Inter.
  const resolvedFont = font ?? (isHeading ? 'secondary' : 'primary');

  return (
    <Text
      style={[
        {
          color: theme[themeColor ?? 'text'],
          fontFamily: FontFamilies[resolvedFont][weight],
        },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 48,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
