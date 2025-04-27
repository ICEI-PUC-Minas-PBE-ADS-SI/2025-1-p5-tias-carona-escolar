import { HotelHomeScreen } from "@/src/screens/home";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const HomeTab = () => {
  return (
    <GestureHandlerRootView>
      <HotelHomeScreen />
    </GestureHandlerRootView>
  );
};

export default HomeTab;
