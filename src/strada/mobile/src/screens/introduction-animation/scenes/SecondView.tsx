import React, { useRef } from "react";
import { StyleSheet, Text, Animated, useWindowDimensions } from "react-native";
import { AppImages } from "../../../assets";
import { lightTheme, Theme } from "@/src/constants/theme";

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const IMAGE_WIDTH = 380;
const IMAGE_HEIGHT = 280;

const SecondView: React.FC<Props> = ({ animationController }) => {
  const window = useWindowDimensions();

  const relaxRef = useRef<Text | null>(null);

  const theme = lightTheme;
  const styles = getStyles(theme);

  const relaxAnimation = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [-(26 * 2), 0, 0],
  });
  const textAnim = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -window.width * 2, 0, 0],
  });
  const imageAnim = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8],
    outputRange: [0, 0, -350 * 4, 0, 0],
  });
  const slideAnim = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.4, 0.8],
    outputRange: [0, 0, -window.width, -window.width],
  });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      <Animated.View style={{ flexDirection: "row" }}>
        <Animated.Text
          style={[
            styles.title,
            { transform: [{ translateY: relaxAnimation }] },
          ]}
          ref={relaxRef}
        >
          Carona ao seu{" "}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.title,
            styles.titlePink,
            { transform: [{ translateY: relaxAnimation }] },
          ]}
          ref={relaxRef}
        >
          jeito
        </Animated.Text>
      </Animated.View>
      <Animated.Text
        style={[styles.subtitle, { transform: [{ translateX: textAnim }] }]}
      >
        Escolha seu destino, horários e{"\n"}
        companhia com Strada, do jeito{"\n"}
        que você preferir.
      </Animated.Text>
      <Animated.Image
        style={[styles.image, { transform: [{ translateX: imageAnim }] }]}
        source={AppImages.relax_image}
      />
    </Animated.View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
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
      marginBottom: -220,
    },
  });

export default SecondView;
