// src/components/map/MapView.jsx
import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { lightTheme } from "@/src/constants/theme";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoid2FseXNvbjAyMDQiLCJhIjoiY203dHFqNW83MHRzZTJrcGx3ZTBueDhidiJ9.pXJ1E9vxbZUelyIAh-YV5g"
);

const MapView = ({
  children,
  styleURL = "mapbox://styles/mapbox/light-v11",
  bounds,
  padding,
  onMapLoad,
}) => {
  const mapRef = useRef(null);
  const theme = lightTheme;

  return (
    <View style={styles.mapContainer}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={styleURL}
        logoEnabled={false}
        attributionEnabled={false}
        onDidFinishLoadingMap={onMapLoad}
      >
        <Mapbox.Camera
          bounds={bounds}
          padding={padding}
          animationMode="flyTo"
          animationDuration={1500}
        />
        {children}
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: "100%",
  },
  map: {
    flex: 1,
  },
});

export default MapView;
