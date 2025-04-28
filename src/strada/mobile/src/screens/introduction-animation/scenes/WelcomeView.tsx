import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  Animated,
  useWindowDimensions,
  Dimensions,
  View,
} from "react-native";
import { AppImages } from "../../../assets";
import { lightTheme, Theme } from "@/src/constants/theme";
import Video from "react-native-video";

interface Props {
  animationController: React.RefObject<Animated.Value>;
}

const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 250;

const WelcomeView: React.FC<Props> = ({ animationController }) => {
  const window = useWindowDimensions();
  const theme = lightTheme;
  const styles = getStyles(theme);

  const careRef = useRef<Text | null>(null);

  const slideAnim = animationController.current!.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [window.width, window.width, 0],
  });

  const textEndVal = 26 * 2;
  const welcomeTextAnim = animationController.current!.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [textEndVal, textEndVal, 0],
  });

  const imageEndVal = IMAGE_WIDTH * 4;
  const imageAnim = animationController.current!.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [imageEndVal, imageEndVal, 0],
  });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      <View style={styles.videoContainer}>
        <Video
          source={AppImages.welcome_video}
          style={styles.video}
          muted={true}
          repeat={true}
          resizeMode="cover"
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onError={(e) => console.log("Erro no vídeo:", e)}
        />
        <View style={styles.overlay} />
      </View>

      <Animated.View style={{ flexDirection: "row" }}>
        <Animated.Text
          style={[
            styles.title,
            { transform: [{ translateX: welcomeTextAnim }] },
          ]}
          ref={careRef}
        >
          Stra
        </Animated.Text>
        <Animated.Text
          style={[
            styles.title,
            styles.titlePink,
            { transform: [{ translateX: welcomeTextAnim }] },
          ]}
          ref={careRef}
        >
          da
        </Animated.Text>
      </Animated.View>
      <Text style={styles.subtitle}>
        Sua carona está pronta. Vamos{"\n"}
        compartilhar a estrada juntos?
      </Text>
    </Animated.View>
  );
};

const { width, height } = Dimensions.get("window");

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
      paddingBottom: 100,
    },
    image: {
      maxWidth: IMAGE_WIDTH,
      maxHeight: IMAGE_HEIGHT,
      marginTop: 450,
    },
    videoContainer: {
      position: "absolute",
      width: width,
      height: height,
      left: 0,
      top: -350,
    },
    video: {
      width: width,
      height: height,
      position: "absolute",
    },
    overlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    title: {
      color: theme.primaryBlueDarkTheme,
      fontSize: 80,
      textAlign: "center",
      fontFamily: "WorkSans-Bold",
    },
    titlePink: {
      color: theme.primary,
    },
    subtitle: {
      color: theme.backgroundAccent,
      textAlign: "center",
      fontFamily: "WorkSans-Regular",
      paddingHorizontal: 64,
      paddingVertical: 16,
    },
  });

export default WelcomeView;
