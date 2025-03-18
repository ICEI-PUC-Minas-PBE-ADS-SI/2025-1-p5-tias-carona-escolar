import React from "react";
import { Image, StyleSheet } from "react-native";

type AvatarProps = {
  imgUrl?: string;
};

const Avatar = ({ imgUrl }: AvatarProps) => {
  return <Image source={{ uri: imgUrl }} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 35,
    width: 70,
    height: 70,
  },
});

export default Avatar;
