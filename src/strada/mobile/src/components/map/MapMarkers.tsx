import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { AppImages } from "@/src/assets";
import { lightTheme } from "@/src/constants/theme";
import PassengerMarker from "./PassengerMark";

const MapMarkers = ({ rideData, pointAnnotationRefs }) => {
  const styles = getStyles(lightTheme);

  return (
    <>
      {/* Ponto de partida principal */}
      <Mapbox.PointAnnotation
        id="pickupLocation"
        key={`pickup-${rideData.id}`}
        coordinate={rideData.pickup?.coordinates}
        title="Main Pickup"
        ref={(ref) => {
          if (rideData.pickup?.coordinates) {
            pointAnnotationRefs.current["pickupLocation"] = ref;
          }
        }}
      >
        <View style={styles.mainPickupMarker}>
          <Image
            source={AppImages.circularpin}
            style={{
              width: 40,
              height: 40,
            }}
            onLoad={() => {
              pointAnnotationRefs?.current?.["pickupLocation"]?.refresh();
            }}
          />
        </View>
      </Mapbox.PointAnnotation>

      <Mapbox.PointAnnotation
        id="dropoffLocation"
        key={`dropoff-${rideData.id}`}
        coordinate={rideData.dropoff?.coordinates}
        title="Dropoff"
        ref={(ref) => {
          if (rideData.dropoff?.coordinates) {
            pointAnnotationRefs.current["dropoffLocation"] = ref;
          }
        }}
      >
        <View style={styles.dropoffMarker}>
          <Image
            source={AppImages.dropoffpin}
            style={styles.dropoffMarkerPin}
            onLoad={() => {
              pointAnnotationRefs?.current?.["dropoffLocation"]?.refresh();
            }}
          />
        </View>
      </Mapbox.PointAnnotation>

      {/* Marcadores dos passageiros */}
      {rideData.passengers?.map(
        (passenger) =>
          passenger.pickup?.coordinates && (
            <Mapbox.PointAnnotation
              key={`passenger-${passenger.id}`}
              id={`passenger-${passenger.id}`}
              coordinate={passenger.pickup.coordinates}
              title={passenger.name}
              ref={(ref) => {
                if (passenger.pickup?.coordinates) {
                  pointAnnotationRefs.current[`passenger-${passenger.id}`] =
                    ref;
                }
              }}
            >
              <PassengerMarker
                passenger={passenger}
                onLoad={() => {
                  pointAnnotationRefs.current[
                    `passenger-${passenger.id}`
                  ]?.refresh();
                }}
              />
            </Mapbox.PointAnnotation>
          )
      )}
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    mainPickupMarker: {
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
  });

export default MapMarkers;
