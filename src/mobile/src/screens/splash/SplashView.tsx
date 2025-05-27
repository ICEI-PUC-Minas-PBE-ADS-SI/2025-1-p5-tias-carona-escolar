import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import { getStoredToken } from "@/src/services/token.service";
import { lightTheme } from "@/src/constants/theme";
import { AppImages } from "@/src/assets";

const SplashView = () => {
  const theme = lightTheme;
  const router = useRouter();
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({});
        setIsFontLoaded(true);
      } catch (e) {
        console.log("Erro ao carregar fontes:", e);
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    if (isFontLoaded && animationFinished) {
      verifyTokens();
    }
  }, [isFontLoaded, animationFinished]);

  const verifyTokens = () => {
    getStoredToken().then((token) => {
      if (!token) {
        router.replace("/onboarding");
        return;
      }
      router.replace("/home");
    });
  };

  return (
    <View style={styles(theme).container}>
      <LottieView
        source={AppImages.splash_anim}
        autoPlay={true}
        loop={false}
        style={{ height: 200, width: 300 }}
        onAnimationFinish={() => setAnimationFinished(true)}
      />
    </View>
  );
};

export const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
  });

export default SplashView;
