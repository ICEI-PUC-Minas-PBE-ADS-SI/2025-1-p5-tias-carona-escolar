import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import Mapbox from "@rnmapbox/maps";
import { FontAwesome } from "@expo/vector-icons";
import { lightTheme, Theme } from "@/src/constants/theme";
import { AppImages } from "@/src/assets";
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import polyline from "@mapbox/polyline";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/src/constants/colors";
import Icon from "react-native-vector-icons/MaterialIcons";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoid2FseXNvbjAyMDQiLCJhIjoiY203dHFqNW83MHRzZTJrcGx3ZTBueDhidiJ9.pXJ1E9vxbZUelyIAh-YV5g"
);

// Interface for ride data
interface RideData {
  id: number;
  driverName: string;
  driverImage: string;
  carModel: string;
  carColor?: string;
  licensePlate?: string;
  seatsAvailable: number;
  dist?: number;
  reviews?: number;
  rating: number;
  pricePerSeat: number;
  totalFare?: number;
  departureLocation: string;
  departureTime: string;
  duration: string;
  availableSeats: number;
  destination: string;
  isFavorite?: boolean;
  paymentMethod?: string;
  pickup?: {
    address: string;
    coordinates: [number, number];
  };
  dropoff?: {
    address: string;
    coordinates: [number, number];
  };
  passengers?: {
    id: number;
    name: string;
    imgUrl: string;
    rating: number;
    pickup?: {
      address: string;
      coordinates: [number, number];
    };
  }[];
  feedback?: string;
}

const sampleRideData: RideData = {
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

const PassengerMarker = ({ passenger, onLoad }) => {
  const theme = lightTheme;
  const styles = getStyles(theme);
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

const RideShareMap = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [rideData, setRideData] = useState<RideData>(sampleRideData);
  const [isTripActive, setIsTripActive] = useState(true);
  const [routeCoords, setRouteCoords] = useState<number[][]>([]);
  const markerRef = useRef<Mapbox.PointAnnotation>(null);
  const [isSearching, setIsSearching] = useState(true);
  const pointAnnotationRefs = useRef<
    Record<string, Mapbox.PointAnnotation | null>
  >({});

  const bottomSheetRef = useRef(null);

  const snapPoints = ["3%", "12%", "60%", "75%"];

  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);

  const mapRef = useRef<Mapbox.MapView>(null);
  const theme = lightTheme;
  const styles = getStyles(theme);

  useEffect(() => {
    const encodedPolyline =
      "xtoyBfbsmG|BRP{CnAMtFuAvBs@xBo@~B_@qC{LeBmIwBoJoA{E[BwAcLYmCUcBc@yA[eDOgAG_Ad@G~A]c@eCn@uFBw@}BiK`HgB`Ce@dD}@jDwA~ImEbCuAbAo@zDoB`@ShCc@nDiA|A]`KuAvCQdBCz@IrCq@|@UxXeAl@STSJYTuB]MsCi@eE_A[AuM_EeBw@aBeAwy@uk@oFiE}]iVoTaO{[yTgI}FkE{C}CaCsBkByB}BkAsAk\\cc@yKsNmBuBkGeGiAuAa@o@]w@Uu@_@cBg@uCeAgDm@mA}@sAgAiAsAcAeB}@cG}BqAo@s@k@q@u@s@kA_@cAoCyJaAiEm@{BO}@_D}LwNuk@m@oCy@{CsD_Oc@iCSkBOgCO{DUiDSwBaAeH_AyEw@aDcAiD_CkGiAiCgEuIkFcKeNyXyAaC}@kAu@y@kEcDwAsA}AgByGkIw@y@{CiCmEuCgEeCk@YmAe@mCs@gO_EcAc@_@Qy@m@s@w@s@iAq@gByFoRm@_Bo@cAm@m@cAo@qPwIwAw@eBkA_XaUuF_FiL{J{@u@{AaAeCiAaKgDmHcCmDyAmA{@yCkCoCcByImEaDgAsOkEmBs@kAi@yBqAUC_CyAkFkCkLcGqCkAqDoAyVeI_KeD_B]iEi@_AMeAUw@[]Qs@m@m@{@e@iAK[SaBWoE[{Ia@yGe@cLg@eKHe@LUPKXGZFNJN^B^E`@KZUXe@XeAPoEVcBXiFxBm@Xy@ViAP_ADcAAkA@oCEw@BsAP}D|@oANaAByDA}@JiAb@eDzBiDrBcBp@sBTcBFeEK}AJ}JpG_Bv@}Br@}FbAqAJqN}DwFcBSBMLGPBT@BpHrB_@|BCJBDBfANrAtB|HZnAh@fCIN@PLLJ?UzAMn@bB@RB";
    const decodedPolyline = polyline.decode(encodedPolyline);

    // Converte de [lat, lng] para [lng, lat]
    const formattedRoute = decodedPolyline.map(([lat, lng]) => [lng, lat]);

    console.log("Formatted Route:", formattedRoute);

    setRouteCoords(formattedRoute);
  }, []);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setHasLocationPermission(true);
    }

    getCurrentLocation();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    setCurrentSnapIndex(index);
    if (mapRef.current) {
      const bounds = calculateBoundingBox();
    }
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
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

  // Função para calcular os limites do mapa, incluindo todos os passageiros
  const calculateBoundingBox = () => {
    const coordinates = [
      rideData.pickup?.coordinates,
      rideData.dropoff?.coordinates,
      ...(rideData.passengers?.map((p) => p.pickup?.coordinates) || []),
    ].filter(Boolean);

    if (coordinates.length >= 2) {
      const padding = 0.01;
      const lngs = coordinates.map((coord) => coord![0]);
      const lats = coordinates.map((coord) => coord![1]);

      return {
        ne: [Math.max(...lngs) + padding, Math.max(...lats) + padding],
        sw: [Math.min(...lngs) - padding, Math.min(...lats) - padding],
      };
    }
    return undefined;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`star-${i}`} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesome
          key="half-star"
          name="star-half-o"
          size={16}
          color="#FFD700"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FontAwesome
          key={`empty-star-${i}`}
          name="star-o"
          size={16}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.page}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Map View */}
        <View style={styles.mapContainer}>
          <Mapbox.MapView
            ref={mapRef}
            style={styles.map}
            styleURL="mapbox://styles/mapbox/light-v11"
            logoEnabled={false}
            attributionEnabled={false}
          >
            <Mapbox.Camera
              bounds={calculateBoundingBox()}
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
              animationMode="flyTo"
              animationDuration={1500}
            />

            {rideData.pickup && rideData.dropoff && routeCoords.length > 0 && (
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
                    lineWidth: 6,
                    lineColor: "#000",
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
              </Mapbox.ShapeSource>
            )}

            {/* Ponto de partida principal */}
            <Mapbox.PointAnnotation
              id="pickupLocation"
              key={`pickup-${rideData.id}`}
              coordinate={rideData.pickup?.coordinates!}
              title="Main Pickup"
              ref={(ref) => {
                if (rideData.dropoff?.coordinates) {
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
              coordinate={rideData.dropoff?.coordinates!}
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
                    pointAnnotationRefs?.current?.[
                      "dropoffLocation"
                    ]?.refresh();
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
                        pointAnnotationRefs.current[
                          `passenger-${passenger.id}`
                        ] = ref;
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
          </Mapbox.MapView>
        </View>

        {/* Location Info Panel */}
        <Animated.View style={[styles.locationPanel, animatedHeaderStyle]}>
          {isSearching ? (
            <View style={styles.searchContainer}>
              <TouchableOpacity style={styles.searchBar} onPress={() => {}}>
                <Icon name="search" size={22} color={colors.darkGrey} />
                <TextInput
                  style={styles.searchPlaceholder}
                  placeholder="Para onde você vai?"
                ></TextInput>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapButton} onPress={() => {}}>
                <Icon name="map" size={22} color={colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.locationCard}>
              {/* Pickup Point */}
              <View
                style={[
                  styles.locationItem,
                  { display: currentSnapIndex === 1 ? "none" : "flex" },
                ]}
              >
                <View style={styles.locationIconContainer}>
                  <View
                    style={[styles.locationDot, { backgroundColor: "#4A89F3" }]}
                  />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>Pickup point</Text>
                  <Text style={styles.locationAddress}>
                    {rideData.pickup?.address}
                  </Text>
                </View>
              </View>

              {/* Destination */}
              <View style={styles.locationItem}>
                <View style={styles.locationIconContainer}>
                  <View
                    style={[styles.locationDot, { backgroundColor: "#333" }]}
                  />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>Where to go?</Text>
                  <Text style={styles.locationAddress}>
                    {rideData.dropoff?.address}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Bottom Sheet para informações da viagem */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          handleComponent={(props) => (
            <BottomSheetHandle {...props} style={styles.bottomSheetHandle}>
              <View style={styles.handleBar} />
            </BottomSheetHandle>
          )}
        >
          <BottomSheetView style={styles.rideInfoCard}>
            <View style={styles.driverInfoContainer}>
              <View style={styles.driverInfo}>
                <Image
                  source={{ uri: rideData.driverImage }}
                  style={styles.driverImage}
                />
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{rideData.driverName}</Text>
                  <Text style={styles.driverRole}>Driver</Text>
                </View>
              </View>
              <View style={styles.carInfo}>
                <Text style={styles.carModel}>
                  {rideData.carModel}, {rideData.carColor}
                </Text>
                <Text style={styles.licensePlate}>{rideData.licensePlate}</Text>
              </View>
            </View>

            {/* Rating, Payment, Duration */}
            <View style={styles.tripDetails}>
              <View style={styles.tripDetailItem}>
                <Text style={styles.tripDetailLabel}>Rating</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(rideData.rating)}
                </View>
              </View>

              <View style={styles.tripDetailItem}>
                <Text style={styles.tripDetailLabel}>Payment Method</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.paymentMethod}
                </Text>
              </View>

              <View style={styles.tripDetailItem}>
                <Text style={styles.tripDetailLabel}>Travel Duration</Text>
                <Text style={styles.tripDetailValue}>{rideData.duration}</Text>
              </View>
            </View>

            {/* Passengers Section */}
            {rideData.passengers && rideData.passengers.length > 0 && (
              <View style={styles.passengersSection}>
                <Text style={styles.passengersLabel}>Passengers</Text>
                <View style={styles.passengersContainer}>
                  {rideData.passengers.map((passenger) => (
                    <View key={passenger.id} style={styles.passengerItem}>
                      <Image
                        source={{ uri: passenger.imgUrl }}
                        style={styles.passengerThumbnail}
                      />
                      <Text style={styles.passengerItemName}>
                        {passenger.name}
                      </Text>
                      <View style={styles.passengerRating}>
                        <FontAwesome name="star" size={12} color="#FFD700" />
                        <Text style={styles.passengerRatingText}>
                          {passenger.rating.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Fare Details */}
            <View style={styles.fareDetails}>
              <View style={styles.fareItem}>
                <Text style={styles.fareLabel}>Ride Fare</Text>
                <Text style={styles.fareAmount}>
                  ${rideData.pricePerSeat.toFixed(2)}
                </Text>
              </View>

              <View style={styles.fareItem}>
                <Text style={styles.fareLabel}>Discount</Text>
                <Text style={styles.fareAmount}>--</Text>
              </View>

              <View style={styles.fareItem}>
                <Text style={styles.fareLabel}>Total fare</Text>
                <Text style={styles.totalFare}>
                  ${rideData.totalFare?.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Feedback */}
            {rideData.feedback && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>Feedback</Text>
                <Text style={styles.feedbackText}>{rideData.feedback}</Text>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideShareMap;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: "#F5F6F5",
    },
    mapContainer: {
      flex: 1,
      width: "100%",
    },
    map: {
      flex: 1,
    },
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
    passengerMarkerContainer: {
      alignItems: "center",
    },
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
    locationPanel: {
      position: "absolute",
      top: Platform.OS === "ios" ? 60 : 40,
      left: 16,
      right: 16,
      zIndex: 1,
    },
    locationCard: {
      backgroundColor: "white",
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    locationItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    locationIconContainer: {
      marginRight: 12,
      marginTop: 6,
    },
    locationDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    locationTextContainer: {
      flex: 1,
    },
    locationLabel: {
      fontSize: 12,
      color: "#888",
      marginBottom: 4,
    },
    locationAddress: {
      fontSize: 15,
      fontWeight: "600",
      color: "#333",
    },
    // Estilos para o BottomSheet
    bottomSheetHandle: {
      backgroundColor: "white",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingVertical: 12,
      alignItems: "center",
    },
    handleBar: {
      width: 40,
      height: 3,
      backgroundColor: "#DDDDDD",
      borderRadius: 3,
    },
    rideInfoCard: {
      backgroundColor: "white",
      padding: 20,
      paddingTop: 0,
    },
    driverInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
    },
    driverInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    driverImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    driverDetails: {
      justifyContent: "center",
    },
    driverName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
    },
    driverRole: {
      fontSize: 12,
      color: "#888",
      marginTop: 2,
    },
    carInfo: {
      alignItems: "flex-end",
    },
    carModel: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    licensePlate: {
      fontSize: 12,
      color: "#666",
      marginTop: 2,
    },
    tripDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
    },
    tripDetailItem: {
      flex: 1,
    },
    tripDetailLabel: {
      fontSize: 12,
      color: "#888",
      marginBottom: 4,
    },
    ratingContainer: {
      flexDirection: "row",
    },
    tripDetailValue: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    // Seção de passageiros
    passengersSection: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
    },
    passengersLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#333",
      marginBottom: 8,
    },
    passengersContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    passengerItem: {
      marginRight: 16,
      marginBottom: 8,
      alignItems: "center",
    },
    passengerThumbnail: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    passengerItemName: {
      fontSize: 12,
      fontWeight: "500",
      color: "#333",
      marginTop: 4,
      textAlign: "center",
    },
    passengerRating: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    passengerRatingText: {
      fontSize: 10,
      color: "#666",
      marginLeft: 2,
    },
    fareDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
    },
    fareItem: {
      flex: 1,
    },
    fareLabel: {
      fontSize: 12,
      color: "#888",
      marginBottom: 4,
    },
    fareAmount: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    totalFare: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.primary,
    },
    feedbackContainer: {
      marginTop: 4,
    },
    feedbackLabel: {
      fontSize: 12,
      color: "#888",
      marginBottom: 4,
    },
    feedbackText: {
      fontSize: 14,
      color: "#333",
      lineHeight: 20,
    },
    searchContainer: {
      flexDirection: "row",
      paddingHorizontal: 5,
      marginTop: 220,
      marginBottom: 16,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.neutralLight,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
    },
    searchPlaceholder: {
      color: colors.darkGrey,
      marginLeft: 8,
      fontSize: 15,
      fontFamily: "WorkSans-Regular",
    },
    mapButton: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor: colors.primaryPink,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.darkPink,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  });
