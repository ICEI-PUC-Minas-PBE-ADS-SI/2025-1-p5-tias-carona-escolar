import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MyPressable from "../../../components/MyPressable";
import { AppImages } from "../../../assets";
import { lightTheme, Theme } from "@/src/constants/theme";

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<Animated.Value>;
}

const SplashView: React.FC<Props> = ({ onNextClick, animationController }) => {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const theme = lightTheme;
  const styles = getStyles(theme);

  const splashTranslateY = animationController.current!.interpolate({
    inputRange: [0, 0.2, 0.8],
    outputRange: [0, -window.height, -window.height],
  });

  const introImageData = Image.resolveAssetSource(AppImages.introduction_image);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateY: splashTranslateY }],
        paddingTop: insets.top + 100,
      }}
    >
      <ScrollView style={{ flexGrow: 0 }} alwaysBounceVertical={false}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={styles.title}>Stra</Text>
          <Text style={[styles.title, styles.titlePink]}>da</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={{
              width: window.width - 40,
              height: undefined,
              aspectRatio: introImageData
                ? introImageData.width / introImageData.height
                : 357 / 470,
            }}
            source={AppImages.introduction_image}
          />
        </View>
        <Text style={styles.subtitle}>
          Compartilhe caronas e viaje com{"\n"}
          economia, conforto e{"\n"}
          tranquilidade.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 8 + insets.bottom }]}>
        <View style={styles.buttonContainer}>
          <MyPressable
            style={styles.button}
            android_ripple={{ color: "powderblue" }}
            touchOpacity={0.6}
            onPress={() => onNextClick()}
          >
            <Text style={styles.buttonText}>Vamos começar</Text>
          </MyPressable>
        </View>
      </View>
    </Animated.View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      color: theme.blue,
      fontSize: 35,
      textAlign: "center",
      fontFamily: "WorkSans-Bold",
      paddingVertical: 8,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 60,
    },
    titlePink: {
      color: theme.primary,
      paddingVertical: 8,
    },
    subtitle: {
      color: theme.blue,
      textAlign: "center",
      fontFamily: "WorkSans-Regular",
      paddingHorizontal: 24,
    },
    footer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingTop: 8,
    },
    buttonContainer: {
      borderRadius: 38,
      overflow: "hidden",
      alignSelf: "center",
    },
    button: {
      height: 58,
      backgroundColor: theme.blue,
      paddingVertical: 16,
      paddingHorizontal: 56,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: "WorkSans-Regular",
      color: "white",
    },
  });

export default SplashView;
