import React from "react";
import Mapbox from "@rnmapbox/maps";

const RouteLayer = ({
  routeCoords,
  lineWidth = 6,
  lineColor = "#000",
  lineCap = "round",
  lineJoin = "round",
}) => {
  if (!routeCoords || routeCoords.length === 0) return null;

  return (
    <Mapbox.ShapeSource
      id="routeSource"
      shape={{
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeCoords,
        },
      }}
    >
      <Mapbox.LineLayer
        id="routeLine"
        style={{
          lineWidth,
          lineColor,
          lineCap,
          lineJoin,
        }}
      />
    </Mapbox.ShapeSource>
  );
};

export default RouteLayer;
