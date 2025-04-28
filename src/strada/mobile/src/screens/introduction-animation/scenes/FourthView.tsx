import React, { useRef } from "react";
import { StyleSheet, Text, Animated, useWindowDimensions } from "react-native";
import { AppImages } from "../../../assets";
import { lightTheme, Theme } from "@/src/constants/theme";

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const IMAGE_WIDTH = 380;
const IMAGE_HEIGHT = 300;

const MoodDiaryView: React.FC<Props> = ({ animationController }) => {
  const window = useWindowDimensions();
  const theme = lightTheme;
  const styles = getStyles(theme);

  const careRef = useRef<Text | null>(null);

  const slideAnim = animationController.current!.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width],
  });

  const textEndVal = window.width * 2;
  const textAnim = animationController.current!.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [textEndVal, textEndVal, 0, -textEndVal],
  });

  const imageEndVal = IMAGE_WIDTH * 4;
  const imageAnim = animationController.current!.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8],
    outputRange: [imageEndVal, imageEndVal, 0, -imageEndVal],
  });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      <Text style={styles.title} ref={careRef}>
        Juntos vamos mais
      </Text>
      <Text style={[styles.title, styles.titlePink]} ref={careRef}>
        longe
      </Text>
      <Animated.Text
        style={[styles.subtitle, { transform: [{ translateX: textAnim }] }]}
      >
        Economize, reduza o trânsito e{"\n"}
        conheça pessoas incríveis na{"\n"}
        sua jornada.
      </Animated.Text>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageAnim }] }]}
        source={AppImages.mood_dairy_image}
      />
    </Animated.View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
      paddingBottom: 100,
    },
    title: {
      color: theme.blue,
      fontSize: 26,
      textAlign: "center",
      fontFamily: "WorkSans-Bold",
    },
    titlePink: {
      color: theme.primary,
    },
    subtitle: {
      color: theme.blue,
      textAlign: "center",
      fontFamily: "WorkSans-Regular",
      paddingHorizontal: 64,
      paddingVertical: 16,
    },
    image: {
      maxWidth: IMAGE_WIDTH,
      maxHeight: IMAGE_HEIGHT,
      marginBottom: -100,
    },
  });

export default MoodDiaryView;
