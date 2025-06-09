import { RideSharingScreen } from "@/src/screens/home";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const HomeTab = () => {
  return (
    <GestureHandlerRootView>
      <RideSharingScreen />
    </GestureHandlerRootView>
  );
};

export default HomeTab;
