import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, StatusBar, Dimensions, Alert } from "react-native";
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
import { getRideById } from "@/src/services/ride.service";
import { getUser } from "@/src/services/user.service";

// Interfaces baseadas na sua API
interface RideRequest {
  id: string;
  rideId: string;
  passengerId: string;
  seatsNeeded: number;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  requestedPickupAddress: string;
  requestedDropoffAddress: string;
  createdAt: string;
  updatedAt: string;
  respondedAt: string | null;
  pickupDistance: number | null;
  dropoffDistance: number | null;
  additionalDistance: number | null;
  detourPercentage: number | null;
  pickedUpAt: string | null;
  droppedOffAt: string | null;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  imgUrl: string | null;
  username: string;
  createdAt: string;
  isActive: boolean;
  cpf: string | null;
  rg: string | null;
  birthDate: string | null;
  phone: string | null;
  address: string | null;
  cep: string | null;
  city: string | null;
  state: string | null;
  userType: "ADULT" | "MINOR";
}

interface RideData {
  id: string;
  driverId: string;
  startAddress: string;
  endAddress: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  allowLuggage: boolean;
  estimatedDuration: number;
  estimatedDistance: number;
  actualDuration: number | null;
  actualDistance: number | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  createdAt: string;
  updatedAt: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  lastLocationUpdate: string | null;
  routePoints: number[][];
  requests: RideRequest[];
  startPoint: {
    type: "Point";
    coordinates: [number, number];
  };
  endPoint: {
    type: "Point";
    coordinates: [number, number];
  };
  plannedRoute: {
    type: "LineString";
    coordinates: [number, number][];
  };
  currentLocation: [number, number] | null;
  driver?: Driver; // Dados do motorista (podem ser carregados separadamente)
}

// Função para buscar dados da corrida
const fetchRideData = async (rideId: string): Promise<RideData | null> => {
  try {
    const response = await getRideById(rideId);
    return response;
  } catch (error) {
    console.error("Erro ao buscar dados da corrida:", error);
    return null;
  }
};

// Função para buscar dados do motorista
const fetchDriverData = async (driverId: string): Promise<Driver | null> => {
  try {
    const response = await getUser(driverId);
    return response;
  } catch (error) {
    console.error("Erro ao buscar dados do motorista:", error);
    return null;
  }
};

// Função para buscar dados de múltiplos usuários (passageiros)
const fetchUsersData = async (
  userIds: string[]
): Promise<Record<string, Driver>> => {
  try {
    const promises = userIds.map((id) => fetchDriverData(id));
    const users = await Promise.all(promises);

    const usersMap: Record<string, Driver> = {};
    users.forEach((user, index) => {
      if (user) {
        usersMap[userIds[index]] = user;
      }
    });

    return usersMap;
  } catch (error) {
    console.error("Erro ao buscar dados dos usuários:", error);
    return {};
  }
};

interface RideShareMapProps {
  rideId: string; // ID da corrida a ser exibida
}

const RideShareMap: React.FC<RideShareMapProps> = ({ rideId }) => {
  const [rideData, setRideData] = useState<RideData | null>(null);
  const [driverData, setDriverData] = useState<Driver | null>(null);
  const [passengersData, setPassengersData] = useState<Record<string, Driver>>(
    {}
  );
  const [isTripActive, setIsTripActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Carregar dados da corrida quando o componente montar
  useEffect(() => {
    const loadRideData = async () => {
      setLoading(true);

      try {
        // Buscar dados da corrida
        const ride = await fetchRideData(rideId);
        if (!ride) {
          Alert.alert("Erro", "Não foi possível carregar os dados da corrida");
          return;
        }

        setRideData(ride);
        setIsTripActive(ride.status === "ACTIVE");

        // Buscar dados do motorista
        const driver = await fetchDriverData(ride.driverId);
        if (driver) {
          setDriverData(driver);
        }

        // Buscar dados dos passageiros que fizeram solicitações
        const passengerIds = ride.requests.map((req) => req.passengerId);
        if (passengerIds.length > 0) {
          const passengers = await fetchUsersData(passengerIds);
          setPassengersData(passengers);
        }

        // Configurar rota planejada
        if (ride.plannedRoute && ride.plannedRoute.coordinates.length > 0) {
          // Se você tiver uma função para decodificar rota, use aqui
          // Caso contrário, use as coordenadas diretamente
          decodeRoute(""); // Ou passe os dados da rota se necessário
        }
      } catch (error) {
        console.error("Erro ao carregar dados da corrida:", error);
        Alert.alert("Erro", "Falha ao carregar dados da corrida");
      } finally {
        setLoading(false);
      }
    };

    loadRideData();
  }, [rideId]);

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentSnapIndex(index);
  }, []);

  const handleMapLoad = useCallback(() => {
    if (!rideData) return;

    // Calcular bounding box para a rota
    const points: [number, number][] = [];

    // Adicionar pontos da rota planejada
    if (rideData.plannedRoute && rideData.plannedRoute.coordinates.length > 0) {
      points.push(...(rideData.plannedRoute.coordinates as [number, number][]));
    }

    // Adicionar ponto de início
    if (rideData.startPoint) {
      points.push(rideData.startPoint.coordinates);
    }

    // Adicionar ponto de fim
    if (rideData.endPoint) {
      points.push(rideData.endPoint.coordinates);
    }

    // Adicionar pontos de pickup dos passageiros solicitantes
    rideData.requests.forEach((request) => {
      // Aqui você pode adicionar lógica para converter endereços em coordenadas
      // se necessário, ou se você tiver coordenadas nos requests
    });

    if (points.length > 0) {
      const bounds = calculateBoundingBox(points);
      // O bounds será usado pelo MapView
    }
  }, [rideData, calculateBoundingBox]);

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

  // Converter dados da API para o formato esperado pelos componentes
  const getFormattedRideData = () => {
    if (!rideData || !driverData) return null;

    return {
      id: rideData.id,
      driverName: driverData.name,
      driverImage: driverData.imgUrl || "https://via.placeholder.com/150",
      carModel: rideData.vehicleModel,
      carColor: rideData.vehicleColor,
      licensePlate: rideData.licensePlate,
      seatsAvailable: rideData.availableSeats,
      rating: 4.8, // Você pode adicionar rating na sua API
      pricePerSeat: rideData.pricePerSeat,
      totalFare: rideData.pricePerSeat * rideData.availableSeats,
      departureLocation: rideData.startAddress,
      departureTime: new Date(rideData.departureTime).toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      duration: `${Math.round(rideData.estimatedDuration / 60)} minutos`,
      availableSeats: rideData.availableSeats,
      destination: rideData.endAddress,
      paymentMethod: "PIX", // Você pode adicionar na sua API
      pickup: {
        address: rideData.startAddress,
        coordinates: rideData.startPoint.coordinates,
      },
      dropoff: {
        address: rideData.endAddress,
        coordinates: rideData.endPoint.coordinates,
      },
      passengers: rideData.requests
        .filter((req) => req.status === "ACCEPTED")
        .map((req) => ({
          id: req.passengerId,
          name: passengersData[req.passengerId]?.name || "Passageiro",
          imgUrl:
            passengersData[req.passengerId]?.imgUrl ||
            "https://via.placeholder.com/150",
          rating: 4.5, // Você pode adicionar na sua API
          pickup: {
            address: req.requestedPickupAddress,
            coordinates: [0, 0] as [number, number], // Você precisará converter endereço para coordenadas
          },
        })),
      feedback: "", // Você pode adicionar na sua API
      status: rideData.status,
      allowLuggage: rideData.allowLuggage,
      estimatedDistance: rideData.estimatedDistance,
    };
  };

  const formattedRideData = getFormattedRideData();

  if (loading) {
    return (
      <GestureHandlerRootView
        style={[styles.container, styles.loadingContainer]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        {/* Você pode adicionar um componente de loading aqui */}
      </GestureHandlerRootView>
    );
  }

  if (!formattedRideData) {
    return (
      <GestureHandlerRootView style={[styles.container, styles.errorContainer]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        {/* Você pode adicionar um componente de erro aqui */}
      </GestureHandlerRootView>
    );
  }

  // Usar coordenadas da rota planejada se disponível
  const routeCoordinates = rideData?.plannedRoute?.coordinates || routeCoords;

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
          routeCoordinates && routeCoordinates.length > 0
            ? {
                ne: calculateBoundingBox(routeCoordinates)?.ne,
                sw: calculateBoundingBox(routeCoordinates)?.sw,
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
        <RouteLayer routeCoords={routeCoordinates} lineColor={theme.primary} />

        {/* Pickup Location Marker */}
        {formattedRideData.pickup && (
          <LocationMarker
            id="pickup-marker"
            coordinate={formattedRideData.pickup.coordinates}
            title="Ponto de Partida"
            markerType="pickup"
            getRef={(ref) => {
              pointAnnotationRefs.current["pickupLocation"] = ref;
            }}
            image={AppImages.circularpin}
            onMarkerLoad={() => {
              pointAnnotationRefs?.current?.["pickupLocation"]?.refresh();
            }}
          />
        )}

        {/* Dropoff Location Marker */}
        {formattedRideData.dropoff && (
          <LocationMarker
            id="dropoff-marker"
            coordinate={formattedRideData.dropoff.coordinates}
            title="Destino"
            markerType="dropoff"
            getRef={(ref) => {
              pointAnnotationRefs.current["dropoffLocation"] = ref;
            }}
            onMarkerLoad={() => {
              pointAnnotationRefs?.current?.["dropoffLocation"]?.refresh();
            }}
            image={AppImages.dropoffpin}
          />
        )}

        {/* Passenger Markers */}
        {formattedRideData?.passengers?.map(
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
                  pointAnnotationRefs.current[`passenger-${passenger.id}`] =
                    ref;
                }}
                onMarkerLoad={() => {
                  pointAnnotationRefs.current[
                    `passenger-${passenger.id}`
                  ]?.refresh();
                }}
              />
            )
        )}

        {/* Current Location Marker (se a corrida estiver ativa) */}
        {isTripActive &&
          rideData?.currentLatitude &&
          rideData?.currentLongitude && (
            <LocationMarker
              id="current-location"
              coordinate={[rideData.currentLongitude, rideData.currentLatitude]}
              title="Localização Atual"
              markerType="current"
              image={AppImages.carpin || AppImages.circularpin}
              getRef={(ref) => {
                pointAnnotationRefs.current["currentLocation"] = ref;
              }}
              onMarkerLoad={() => {
                pointAnnotationRefs?.current?.["currentLocation"]?.refresh();
              }}
            />
          )}
      </MapView>

      {/* Location Panel */}
      <LocationPanel
        isSearching={isSearching}
        pickup={formattedRideData.pickup}
        dropoff={formattedRideData.dropoff}
        currentSnapIndex={currentSnapIndex}
        animatedStyle={locationPanelStyle}
        onSearch={handleSearch}
      />

      {/* Ride Info Card */}
      <RideInfoCard
        rideData={formattedRideData}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RideShareMap;
