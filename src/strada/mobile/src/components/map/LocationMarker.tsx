import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { lightTheme } from "@/src/constants/theme";
import { AppImages } from "@/src/assets";

const LocationMarker = ({
  id,
  coordinate,
  title,
  markerType = "pickup", // pickup, dropoff, passenger
  image,
  onMarkerLoad,
  getRef,
}) => {
  const theme = lightTheme;

  return (
    <Mapbox.PointAnnotation
      id={id}
      coordinate={coordinate}
      title={title}
      ref={getRef}
    >
      <View
        style={
          markerType === "passenger"
            ? styles.passengerMarker
            : markerType === "pickup"
            ? styles.pickupMarker
            : styles.dropoffMarker
        }
      >
        {markerType === "passenger" ? (
          <Image
            source={{ uri: image }}
            style={styles.passengerImage}
            onLoad={onMarkerLoad}
          />
        ) : (
          <Image
            source={
              markerType === "pickup"
                ? AppImages.circularpin
                : AppImages.dropoffpin
            }
            style={
              markerType === "dropoff"
                ? styles.dropoffMarkerPin
                : { width: 40, height: 40 }
            }
            onLoad={onMarkerLoad}
          />
        )}
      </View>
    </Mapbox.PointAnnotation>
  );
};

const styles = StyleSheet.create({
  pickupMarker: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  dropoffMarker: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 40,
    height: 75,
    backgroundColor: "transparent",
  },
  dropoffMarkerPin: {
    width: 22,
    height: 35,
  },
  passengerMarker: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: lightTheme.white,
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

export default LocationMarker;
