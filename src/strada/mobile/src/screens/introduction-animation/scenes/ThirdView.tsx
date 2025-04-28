import { AppImages } from "@/src/assets";
import { lightTheme, Theme } from "@/src/constants/theme";
import React, { useRef } from "react";
import { StyleSheet, Text, Animated, useWindowDimensions } from "react-native";

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const IMAGE_WIDTH = 360;
const IMAGE_HEIGHT = 210;

const CareView: React.FC<Props> = ({ animationController }) => {
  const window = useWindowDimensions();
  const theme = lightTheme;
  const styles = getStyles(theme);

  const careRef = useRef<Text | null>(null);

  const slideAnim = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [window.width, window.width, 0, -window.width, -window.width],
  });

  const careEndVal = 26 * 2;
  const careAnim = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [careEndVal, careEndVal, 0, -careEndVal, -careEndVal],
  });

  const imageEndVal = IMAGE_WIDTH * 4;
  const imageAnim = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [imageEndVal, imageEndVal, 0, -imageEndVal, -imageEndVal],
  });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      <Animated.View>
        <Animated.Text
          style={[
            styles.title,
            styles.titlePink,
            { transform: [{ translateX: careAnim }] },
          ]}
          ref={careRef}
        >
          Segurança em primeiro
        </Animated.Text>
        <Animated.Text
          style={[styles.title, { transform: [{ translateX: careAnim }] }]}
          ref={careRef}
        >
          lugar
        </Animated.Text>
      </Animated.View>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageAnim }] }]}
        source={AppImages.care_image}
      />
      <Text style={styles.subtitle}>
        Conecte-se com motoristas e{"\n"}
        passageiros verificados para{"\n"}
        uma viagem tranquila.
      </Text>
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
      paddingTop: 160,
    },
    image: {
      maxWidth: IMAGE_WIDTH,
      maxHeight: IMAGE_HEIGHT,
      marginVertical: 32,
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
  });

export default CareView;
