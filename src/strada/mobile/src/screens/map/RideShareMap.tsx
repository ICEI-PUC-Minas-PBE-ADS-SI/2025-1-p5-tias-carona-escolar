import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, StatusBar, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { lightTheme } from "@/src/constants/theme";
import MapView from "@/src/components/map/MapView";
import LocationMarker from "@/src/components/map/LocationMarker";
import LocationPanel from "@/src/components/map/LocationPanel";
import RideInfoCard from "@/src/components/map/RideInfoCard";
import RouteLayer from "@/src/components/map/RouteLayer";
import { useMapLocation } from "@/src/hooks/UseMapLocation";
import Mapbox from "@rnmapbox/maps";
import { AppImages } from "@/src/assets";

const sampleRideData = {
  id: 1,
  driverName: "Budi Susanto",
  driverImage:
    "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
  carModel: "Toyota Avanza",
  carColor: "Black",
  licensePlate: "B 1233 YH",
  seatsAvailable: 3,
  rating: 4.8,
  pricePerSeat: 14.0,
  totalFare: 4.0,
  departureLocation: "456 Elm Street, Springfield",
  departureTime: "14:30",
  duration: "30 Minutes",
  availableSeats: 2,
  destination: "Office - 739 Main Street, Springfield",
  paymentMethod: "e-Wallet",
  pickup: {
    address: "456 Elm Street, Springfield",
    coordinates: [-44.339732, -20.073888],
  },
  dropoff: {
    address: "Office - 739 Main Street, Springfield",
    coordinates: [-44.20075, -19.95512],
  },
  passengers: [
    {
      id: 1,
      name: "John Doe",
      imgUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
      rating: 4.5,
      pickup: {
        address: "123 Main Street, Springfield",
        coordinates: [-44.321519, -20.074622],
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      imgUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
      rating: 4.0,
      pickup: {
        address: "789 Oak Avenue, Springfield",
        coordinates: [-44.264464, -20.04228],
      },
    },
  ],
  feedback: "Driver was friendly, and the ride was smooth.",
};

const RideShareMap = () => {
  const [rideData, setRideData] = useState(sampleRideData);
  const [isTripActive, setIsTripActive] = useState(true);
  const [isSearching, setIsSearching] = useState(true);
  const {
    location,
    errorMsg,
    hasLocationPermission,
    routeCoords,
    decodeRoute,
    calculateBoundingBox,
  } = useMapLocation();

  const pointAnnotationRefs = useRef<
    Record<string, Mapbox.PointAnnotation | null>
  >({});
  const bottomSheetRef = useRef(null);
  const snapPoints = ["3%", "12%", "60%", "75%"];
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);
  const mapRef = useRef(null);
  const theme = lightTheme;

  // When component mounts, decode route
  React.useEffect(() => {
    const encodedPolyline =
      "xtoyBfbsmG|BRP{CnAMtFuAvBs@xBo@~B_@qC{LeBmIwBoJoA{E[BwAcLYmCUcBc@yA[eDOgAG_Ad@G~A]c@eCn@uFBw@}BiK`HgB`Ce@dD}@jDwA~ImEbCuAbAo@zDoB`@ShCc@nDiA|A]`KuAvCQdBCz@IrCq@|@UxXeAl@STSJYTuB]MsCi@eE_A[AuM_EeBw@aBeAwy@uk@oFiE}]iVoTaO{[yTgI}FkE{C}CaCsBkByB}BkAsAk\\cc@yKsNmBuBkGeGiAuAa@o@]w@Uu@_@cBg@uCeAgDm@mA}@sAgAiAsAcAeB}@cG}BqAo@s@k@q@u@s@kA_@cAoCyJaAiEm@{BO}@_D}LwNuk@m@oCy@{CsD_Oc@iCSkBOgCO{DUiDSwBaAeH_AyEw@aDcAiD_CkGiAiCgEuIkFcKeNyXyAaC}@kAu@y@kEcDwAsA}AgByGkIw@y@{CiCmEuCgEeCk@YmAe@mCs@gO_EcAc@_@Qy@m@s@w@s@iAq@gByFoRm@_Bo@cAm@m@cAo@qPwIwAw@eBkA_XaUuF_FiL{J{@u@{AaAeCiAaKgDmHcCmDyAmA{@yCkCoCcByImEaDgAsOkEmBs@kAi@yBqAUC_CyAkFkCkLcGqCkAqDoAyVeI_KeD_B]iEi@_AMeAUw@[]Qs@m@m@{@e@iAK[SaBWoE[{Ia@yGe@cLg@eKHe@LUPKXGZFNJN^B^E`@KZUXe@XeAPoEVcBXiFxBm@Xy@ViAP_ADcAAkA@oCEw@BsAP}D|@oANaAByDA}@JiAb@eDzBiDrBcBp@sBTcBFeEK}AJ}JpG_Bv@}Br@}FbAqAJqN}DwFcBSBMLGPBT@BpHrB_@|BCJBDBfANrAtB|HZnAh@fCIN@PLLJ?UzAMn@bB@RB";
    decodeRoute(encodedPolyline);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    setCurrentSnapIndex(index);
  }, []);

  const handleMapLoad = useCallback(() => {
    // Calculate bounding box for the route
    if (routeCoords && routeCoords.length > 0) {
      const points = [...routeCoords];

      // Add pickup, dropoff, and passenger locations to the bounding box calculation
      if (rideData.pickup && rideData.pickup.coordinates) {
        points.push(rideData.pickup.coordinates);
      }

      if (rideData.dropoff && rideData.dropoff.coordinates) {
        points.push(rideData.dropoff.coordinates);
      }

      if (rideData.passengers) {
        rideData.passengers.forEach((passenger) => {
          if (passenger.pickup && passenger.pickup.coordinates) {
            points.push(passenger.pickup.coordinates);
          }
        });
      }

      const bounds = calculateBoundingBox(points);

      // If we have a valid bounding box, we could use it to set the camera
      // This is handled by the bounds prop on MapView
    }
  }, [routeCoords, rideData]);

  const handleSearch = () => {
    setIsSearching(true);
    bottomSheetRef.current?.snapToIndex(0);
  };

  // Animated style for the location panel
  const locationPanelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          currentSnapIndex === 0 || isSearching ? -200 : 0,
          {
            duration: 300,
          }
        ),
      },
    ],
  }));

  // if (!hasLocationPermission) {
  //   return (
  //     <View style={[styles.container, { justifyContent: "center" }]}>
  //       <ActivityIndicator size="large" color="#007bff" />
  //     </View>
  //   );
  // }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Map Component */}
      <MapView
        bounds={
          routeCoords && routeCoords.length > 0
            ? {
                ne: calculateBoundingBox(routeCoords)?.ne,
                sw: calculateBoundingBox(routeCoords)?.sw,
              }
            : undefined
        }
        padding={{
          paddingTop:
            currentSnapIndex === 0
              ? 60
              : currentSnapIndex === 1
              ? Dimensions.get("window").height * 0.2
              : 220,
          paddingBottom:
            currentSnapIndex === 0
              ? 100
              : currentSnapIndex === 1
              ? Dimensions.get("window").height * 0.2
              : Dimensions.get("window").height * 0.6,
          paddingLeft: 50,
          paddingRight: 50,
        }}
        onMapLoad={handleMapLoad}
      >
        {/* Route Line */}
        <RouteLayer routeCoords={routeCoords} lineColor={theme.primary} />

        {/* Pickup Location Marker */}
        {rideData.pickup && (
          <LocationMarker
            id="pickup-marker"
            coordinate={rideData.pickup.coordinates}
            title="Pickup Point"
            markerType="pickup"
            getRef={(ref) => {
              if (rideData.dropoff?.coordinates) {
                pointAnnotationRefs.current["pickupLocation"] = ref;
              }
            }}
            image={AppImages.circularpin}
            onMarkerLoad={() => {
              pointAnnotationRefs?.current?.["pickupLocation"]?.refresh();
            }}
          />
        )}

        {/* Dropoff Location Marker */}
        {rideData.dropoff && (
          <LocationMarker
            id="dropoff-marker"
            coordinate={rideData.dropoff.coordinates}
            title="Destination"
            markerType="dropoff"
            getRef={(ref) => {
              if (rideData.dropoff?.coordinates) {
                pointAnnotationRefs.current["dropoffLocation"] = ref;
              }
            }}
            onMarkerLoad={() => {
              pointAnnotationRefs?.current?.["dropoffLocation"]?.refresh();
            }}
            image={AppImages.dropoffpin}
          />
        )}

        {/* Passenger Markers */}
        {rideData?.passengers?.map(
          (passenger) =>
            passenger.pickup && (
              <LocationMarker
                key={`passenger-${passenger.id}`}
                id={`passenger-${passenger.id}`}
                coordinate={passenger.pickup.coordinates}
                title={passenger.name}
                markerType="passenger"
                image={passenger.imgUrl}
                getRef={(ref) => {
                  if (passenger.pickup?.coordinates) {
                    pointAnnotationRefs.current[`passenger-${passenger.id}`] =
                      ref;
                  }
                }}
                onMarkerLoad={() => {
                  pointAnnotationRefs.current[
                    `passenger-${passenger.id}`
                  ]?.refresh();
                }}
              />
            )
        )}
      </MapView>

      {/* Location Panel */}
      <LocationPanel
        isSearching={isSearching}
        pickup={rideData.pickup}
        dropoff={rideData.dropoff}
        currentSnapIndex={currentSnapIndex}
        animatedStyle={locationPanelStyle}
        onSearch={handleSearch}
      />

      {/* Ride Info Card */}
      <RideInfoCard
        rideData={rideData}
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        onSheetChanges={handleSheetChanges}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default RideShareMap;
