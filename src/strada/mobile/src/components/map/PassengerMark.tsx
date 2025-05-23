// Components/PassengerMarker.jsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { lightTheme } from "@/src/constants/theme";

const PassengerMarker = ({ passenger, onLoad }) => {
  const styles = getStyles(lightTheme);
  return (
    <View>
      <Image
        source={{ uri: passenger.imgUrl }}
        style={[styles.passengerImageContainer, styles.passengerImage]}
        onLoad={onLoad}
      />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    passengerImageContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.white,
      overflow: "hidden",
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    passengerImage: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
  });

export default PassengerMarker;
