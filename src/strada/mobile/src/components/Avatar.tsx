import React from "react";
import { Image, StyleSheet } from "react-native";
import { lightTheme, Theme } from "../constants/theme";

type AvatarProps = {
  imgUrl?: string;
};

const Avatar = ({ imgUrl }: AvatarProps) => {
  const theme = lightTheme;
  const styles = getStyles(theme);
  return <Image source={{ uri: imgUrl }} style={styles.avatarContainer} />;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    avatarContainer: {
      position: "absolute",
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 3,
      borderColor: theme.background,
      backgroundColor: theme.background,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      zIndex: 50,
    },
  });

export default Avatar;
