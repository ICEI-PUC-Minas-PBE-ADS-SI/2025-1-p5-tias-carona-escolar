import { colors } from './colors';

export type Theme = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  quaternary: string;
  darkBlue: string;
}

export const lightTheme = {
  background: colors.white,
  foreground: colors.black,
  primary: colors.black,
  secondary: colors.charcoal,
  tertiary: colors.honeydew,
  accent: colors.officceGreen,
  quaternary: colors.oxforBlue,
  darkBlue: colors.oxforBlue,
} as Theme;

export const darkTheme = {
  background: colors.charcoal,
  foreground: colors.white,
  primary: colors.white,
  secondary: colors.officceGreen,
  tertiary: colors.honeydew,
  quaternary: colors.oxforBlue,
  accent: colors.officceGreen,
} as Theme;
