import { colors } from "./colors";

export type Theme = {
  background: string;
  white: string;
  foreground: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  backgroundAccent: string;
  blue: string;
  softPink: string;
  darkPink: string;
  primaryBlueDarkTheme: string,
  lightGrey: string;
  grey: string;
  darkGrey: string;
  accentBlue: string;
};

export const lightTheme: Theme = {
  background: colors.white,
  white: colors.white,
  foreground: colors.black,
  text: colors.black,
  primary: colors.primaryPink,
  secondary: colors.lightPink,
  accent: colors.accentBlue,
  backgroundAccent: colors.softBlue,
  blue: colors.primaryBlue,
  primaryBlueDarkTheme: colors.primaryBlueDarkTheme,
  softPink: colors.lightPink,
  darkPink: colors.darkPink,
  lightGrey: colors.lightGrey,
  grey: colors.grey,
  darkGrey: colors.darkGrey,
  accentBlue: colors.accentBlue,
};

export const darkTheme: Theme = {
  background: colors.primaryBlue,
  white: colors.white,
  foreground: colors.white,
  text: colors.white,
  primary: colors.primaryPink,
  secondary: colors.darkPink,
  accent: colors.secondaryBlue,
  backgroundAccent: colors.neutralLight,
  blue: colors.accentBlue,
  primaryBlueDarkTheme: colors.primaryBlueDarkTheme,
  softPink: colors.lightPink,
  darkPink: colors.darkPink,
  lightGrey: colors.lightGrey,
  grey: colors.grey,
  darkGrey: colors.darkGrey,
  accentBlue: colors.accentBlue
};
