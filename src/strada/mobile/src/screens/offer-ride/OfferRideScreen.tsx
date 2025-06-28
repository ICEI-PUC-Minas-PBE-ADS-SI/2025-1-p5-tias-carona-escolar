import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "@/src/constants/colors";
import CustomCalendar from "@/src/components/shared/CustomCalendar";
import RecurringInDays from "@/src/components/offer-ride/ReccuringInDays";
import AutocompleteSearch from "@/src/components/shared/SearchBar";
import VehicleSelector from "./VehicleModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import polyline from "@mapbox/polyline";
import { getStoredUserID, getStoredUser } from "@/src/services/user.service";
import { createRide } from "@/src/services/ride.service";
import { educareCoordinates } from "@/src/constants/coordinates";

// --- INTERFACES E TIPOS ---
interface LocationDto {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
}

interface RoutePoint {
  latitude: number;
  longitude: number;
  order?: number;
}

interface CreateRideData {
  driverId: string;
  startLocation: LocationDto;
  endLocation: LocationDto;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  vehicle: {
    model?: string;
    color?: string;
    licensePlate?: string;
  };
  preferences: {
    allowSmoking: boolean;
    allowPets: boolean;
    allowLuggage: boolean;
  };
  seats: number;
  estimatedDuration: number;
  estimatedDistance: number;
  routePath: RoutePoint[];
}

const Maps_API_KEY = process.env.EXPO_PUBLIC_Maps_API_KEY || "";

const educareLocation: LocationDto = {
  latitude: educareCoordinates.latitude,
  longitude: educareCoordinates.longitude,
  name: "Educare",
  address: "Educare - Centro, Betim",
};

const OfferRideScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // --- ESTADOS DO COMPONENTE ---
  const [originLocation, setOriginLocation] = useState<LocationDto | null>(
    null
  );
  const [destinationLocation, setDestinationLocation] =
    useState<LocationDto | null>(educareLocation);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [price, setPrice] = useState("0");
  const [availableSeats, setAvailableSeats] = useState(3);
  const [notes, setNotes] = useState("");
  const [allowPets, setAllowPets] = useState(false);
  const [allowSmoking, setAllowSmoking] = useState(false);
  const [allowLuggage, setAllowLuggage] = useState(true);
  const [luggageSize, setLuggageSize] = useState("small");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRecurringRide, setIsRecurringRide] = useState(false);
  const [canMakeStops, setCanMakeStops] = useState(false);
  const [vehicle, setVehicle] = useState<{
    model: string;
    color: string;
    licensePlate: string;
  } | null>(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<"origin" | "destination">(
    "origin"
  );
  const [driverId, setDriverId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- LÓGICA DE CARREGAMENTO INICIAL ---
  useEffect(() => {
    const loadInitialData = async () => {
      const userId = await getStoredUserID();
      setDriverId(userId);

      const userString = await getStoredUser();
      if (userString) {
        const userData = JSON.parse(userString);
        if (
          userData.vehicle_model &&
          userData.vehicle_color &&
          userData.license_plate
        ) {
          setVehicle({
            model: userData.vehicle_model,
            color: userData.vehicle_color,
            licensePlate: userData.license_plate,
          });
        }
      }
    };
    loadInitialData();
  }, []);

  // --- FUNÇÕES E MANIPULADORES DE EVENTOS ---

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSwapLocations = useCallback(() => {
    setOriginLocation(destinationLocation);
    setDestinationLocation(originLocation);
  }, [originLocation, destinationLocation]);

  const openSearchModal = (type: "origin" | "destination") => {
    const isOriginFixed = originLocation?.name === educareLocation.name;
    const isDestinationFixed =
      destinationLocation?.name === educareLocation.name;

    if (type === "origin" && isOriginFixed) {
      Alert.alert(
        "Ação bloqueada",
        "A origem é a Educare. Use o botão de troca para oferecer uma carona PARA a escola."
      );
      return;
    }

    if (type === "destination" && isDestinationFixed) {
      Alert.alert(
        "Ação bloqueada",
        "O destino é a Educare. Use o botão de troca para oferecer uma carona SAINDO da escola."
      );
      return;
    }

    setSearchType(type);
    setSearchModalVisible(true);
  };

  const closeSearchModal = () => setSearchModalVisible(false);

  const handlePlaceSelected = (place: any) => {
    const location: LocationDto = {
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.address,
      name: place.name,
    };
    if (searchType === "origin") setOriginLocation(location);
    else setDestinationLocation(location);
    closeSearchModal();
  };

  const getRouteFromGoogleMaps = async (
    origin: LocationDto,
    destination: LocationDto
  ): Promise<{
    routePath: RoutePoint[];
    estimatedDuration: number;
    estimatedDistance: number;
  }> => {
    try {
      const response = await fetch(
        `https://routes.googleapis.com/directions/v2:computeRoutes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": Maps_API_KEY,
            "X-Goog-FieldMask":
              "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: {
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                },
              },
            },
            destination: {
              location: {
                latLng: {
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                },
              },
            },
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE",
          }),
        }
      );
      const data = await response.json();
      if (!data.routes || data.routes.length === 0)
        throw new Error("Rota não encontrada");
      const route = data.routes[0];
      const routePath: RoutePoint[] = polyline
        .decode(route.polyline.encodedPolyline)
        .map((p, i) => ({ latitude: p[0], longitude: p[1], order: i }));
      return {
        routePath,
        estimatedDuration: +route.duration.slice(0, -1),
        estimatedDistance: route.distanceMeters,
      };
    } catch (error) {
      console.error("Erro ao buscar rota:", error);
      throw error;
    }
  };

  const handleStartEndDateChange = (
    startDateValue: Date | null,
    endDateValue: Date | null
  ) => {
    setStartDate(startDateValue);
    setEndDate(endDateValue);
    if (startDateValue && endDateValue) {
      setIsRecurringRide(startDateValue.getTime() !== endDateValue.getTime());
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    return `${date.getDate().toString().padStart(2, "0")} ${date
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "")} ${date.getFullYear()}`;
  };

  const formatTime = (time: Date) =>
    time?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const handleVehicleChange = (
    newVehicleData: {
      model: string;
      color: string;
      licensePlate: string;
    } | null
  ) => {
    setVehicle(newVehicleData);
  };

  const decreaseSeats = () => setAvailableSeats((s) => Math.max(1, s - 1));
  const increaseSeats = () => setAvailableSeats((s) => Math.min(42, s + 1));

  const handlePublishRide = useCallback(async () => {
    if (
      !originLocation ||
      !destinationLocation ||
      !price ||
      !driverId ||
      !vehicle
    ) {
      Alert.alert(
        "Dados incompletos",
        "Por favor, preencha todos os campos obrigatórios, incluindo o veículo e a CNH."
      );
      return;
    }
    setIsLoading(true);
    try {
      const routeData = await getRouteFromGoogleMaps(
        originLocation,
        destinationLocation
      );
      const departureDateTime = new Date(startDate);
      departureDateTime.setHours(time.getHours());
      departureDateTime.setMinutes(time.getMinutes());

      const rideData: CreateRideData = {
        driverId,
        startLocation: originLocation,
        endLocation: destinationLocation,
        departureTime: departureDateTime.toISOString(),
        availableSeats,
        pricePerSeat: parseFloat(price.replace(",", ".")),
        vehicle: {
          model: vehicle.model,
          color: vehicle.color,
          licensePlate: vehicle.licensePlate,
        },
        preferences: { allowSmoking, allowPets, allowLuggage },
        estimatedDuration: routeData.estimatedDuration,
        estimatedDistance: routeData.estimatedDistance,
        routePath: routeData.routePath,
        seats: availableSeats,
      };
      await createRide(rideData); // Usando a função createRide importada
      router.push("/ride-history/ride-history");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao publicar sua carona. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    originLocation,
    destinationLocation,
    price,
    startDate,
    time,
    availableSeats,
    allowSmoking,
    allowPets,
    allowLuggage,
    driverId,
    vehicle,
    router,
  ]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oferecer Carona</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <VehicleSelector
          vehicle={vehicle}
          onVehicleChange={handleVehicleChange}
        />

        <View style={styles.section}>
          <View style={styles.routeContainer}>
            <View style={styles.routeFields}>
              <TouchableOpacity
                style={styles.routeLocationInput}
                onPress={() => openSearchModal("origin")}
              >
                <View style={[styles.locationDot, styles.originDot]} />
                <Text style={styles.routeLocationText} numberOfLines={1}>
                  {originLocation?.address || "Escolher ponto de partida"}
                </Text>
              </TouchableOpacity>
              <View style={styles.separatorLine} />
              <TouchableOpacity
                style={styles.routeLocationInput}
                onPress={() => openSearchModal("destination")}
              >
                <View style={[styles.locationDot, styles.destinationDot]} />
                <Text style={styles.routeLocationText} numberOfLines={1}>
                  {destinationLocation?.address || "Escolher destino"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleSwapLocations}
              style={styles.swapButton}
            >
              <Icon name="swap-vert" size={28} color={colors.primaryBlue} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={searchModalVisible}
          animationType="slide"
          onRequestClose={closeSearchModal}
        >
          <AutocompleteSearch
            onSelectPlace={handlePlaceSelected}
            onBack={closeSearchModal}
          />
        </Modal>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="schedule" size={20} color={colors.primaryPink} />
            <Text style={styles.sectionTitle}>Data e Hora</Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="event" size={22} color={colors.darkGrey} />
              <View>
                <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
                {endDate && endDate.getTime() !== startDate.getTime() && (
                  <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
                )}
              </View>
              <Icon name="arrow-drop-down" size={22} color={colors.darkGrey} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon name="access-time" size={22} color={colors.darkGrey} />
              <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
              <Icon name="arrow-drop-down" size={22} color={colors.darkGrey} />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
          {showDatePicker && (
            <CustomCalendar
              minDate={new Date()}
              startDate={startDate}
              endDate={endDate}
              startEndDateChange={handleStartEndDateChange}
            />
          )}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Carona recorrente</Text>
            <Switch
              value={isRecurringRide}
              onValueChange={setIsRecurringRide}
              trackColor={{ false: colors.grey, true: colors.lightPink }}
              thumbColor={isRecurringRide ? colors.primaryPink : colors.white}
            />
          </View>
          {isRecurringRide && <RecurringInDays />}
          <View style={styles.routeInfoContainer}>
            <Icon name="info-outline" size={16} color={colors.primaryBlue} />
            <Text style={styles.routeInfoText}>
              Selecione o range de datas e horário para a carona. Se a carona
              ocorrer em um dia específico, selecione a mesma data para início e
              fim.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="payments" size={20} color={colors.primaryPink} />
            <Text style={styles.sectionTitle}>Preço e Assentos</Text>
          </View>
          <View style={styles.seatsContainer}>
            <Text style={styles.seatsLabel}>Assentos disponíveis</Text>
            <View style={styles.seatsSelector}>
              <TouchableOpacity
                style={styles.seatButton}
                onPress={decreaseSeats}
                disabled={availableSeats <= 1}
              >
                <Icon
                  name="remove"
                  size={20}
                  color={availableSeats <= 1 ? colors.grey : colors.darkGrey}
                />
              </TouchableOpacity>
              <View style={styles.seatsCountContainer}>
                <Text style={styles.seatsCount}>{availableSeats}</Text>
              </View>
              <TouchableOpacity
                style={styles.seatButton}
                onPress={increaseSeats}
                disabled={availableSeats >= 42}
              >
                <Icon
                  name="add"
                  size={20}
                  color={availableSeats >= 42 ? colors.grey : colors.darkGrey}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Seção: Observações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="description" size={20} color={colors.primaryPink} />
            <Text style={styles.sectionTitle}>Observações</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Adicione informações importantes para os passageiros..."
            placeholderTextColor={colors.darkGrey}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity
          style={[
            styles.publishButton,
            isLoading && styles.publishButtonDisabled,
          ]}
          onPress={handlePublishRide}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.publishButtonText}>Publicar Carona</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutralLight },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: colors.black },
  headerRight: { width: 32 },
  scrollView: { flex: 1 },
  contentContainer: { paddingVertical: 16, paddingBottom: 100 },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginLeft: 8,
  },
  routeInfoText: {
    fontSize: 13,
    color: colors.primaryBlue,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  routeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  dateTimeContainer: { flexDirection: "row", gap: 12 },
  dateTimeInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dateTimeText: {
    fontSize: 15,
    color: colors.black,
    marginLeft: 8,
    marginRight: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    marginTop: 16,
  },
  switchLabel: { fontSize: 15, color: colors.black },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    padding: 0,
  },
  perPersonText: { fontSize: 14, color: colors.darkGrey },
  seatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seatsLabel: { fontSize: 15, color: colors.black },
  seatsSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  seatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    marginHorizontal: 2,
  },
  seatsCountContainer: { paddingHorizontal: 16 },
  seatsCount: { fontSize: 18, fontWeight: "600", color: colors.black },
  preferencesContainer: { gap: 16 },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  preferenceInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  preferenceLabel: { fontSize: 15, color: colors.black, marginLeft: 12 },
  luggageSizeContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  luggageLabel: { fontSize: 15, color: colors.black, marginBottom: 12 },
  luggageOptions: { flexDirection: "row", gap: 8 },
  luggageOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.neutralLight,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  luggageSelected: {
    backgroundColor: colors.primaryPink,
    borderColor: colors.primaryPink,
  },
  luggageText: { fontSize: 13, color: colors.darkGrey, marginLeft: 6 },
  luggageTextSelected: { color: colors.white },
  notesInput: {
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
    minHeight: 100,
    textAlignVertical: "top",
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  publishButton: {
    backgroundColor: colors.primaryPink,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  publishButtonDisabled: {
    backgroundColor: colors.grey,
    shadowOpacity: 0,
    elevation: 0,
  },
  publishButtonText: { fontSize: 16, fontWeight: "600", color: colors.white },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeFields: { flex: 1 },
  swapButton: { padding: 8, marginLeft: 8 },
  separatorLine: {
    height: 1,
    backgroundColor: colors.lightGrey,
    marginVertical: 4,
    marginLeft: 28,
  },
  routeLocationInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    flex: 1,
  },
  routeLocationText: {
    fontSize: 16,
    color: colors.black,
    marginLeft: 12,
    flexShrink: 1,
  },
  locationDot: { width: 12, height: 12, borderRadius: 6 },
  originDot: { backgroundColor: colors.primaryPink },
  destinationDot: { backgroundColor: colors.primaryBlue },
});

export default OfferRideScreen;
