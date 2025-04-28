import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "@/src/constants/colors";
import { AppImages } from "@/src/assets";
import CustomCalendar from "@/src/components/shared/CustomCalendar";
import RecurringInDays from "@/src/components/offer-ride/ReccuringInDays";

// Dados do veículo do usuário (mockados)
const userVehicle = {
  model: "Honda Civic",
  year: "2022",
  color: "Prata",
  plate: "ABC1D23",
  image: AppImages.google,
};

const OfferRideScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estados para os campos do formulário
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [price, setPrice] = useState("");
  const [availableSeats, setAvailableSeats] = useState(3);
  const [notes, setNotes] = useState("");
  const [allowPets, setAllowPets] = useState(false);
  const [allowSmoking, setAllowSmoking] = useState(false);
  const [luggageSize, setLuggageSize] = useState("small"); // 'small', 'medium', 'large'
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRecurringRide, setIsRecurringRide] = useState(false);
  const [canMakeStops, setCanMakeStops] = useState(false);

  // Função para voltar à tela anterior
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Navegar para a tela de seleção de local
  const navigateToLocationPicker = useCallback((type) => {
    // Aqui você pode implementar a navegação para a tela de seleção de local
    // e depois atualizar o estado correspondente (origin ou destination)
    Alert.alert(
      "Selecionar Local",
      `Selecionar ${type === "origin" ? "origem" : "destino"} da viagem`
    );
  }, []);

  // Gerenciamento dos pickers de data e hora
  const handleStartEndDateChange = (startDate, endDate) => {
    if (!startDate && !endDate) setShowDatePicker(false);
    if (startDate) setstartDate(startDate);
    setEndDate(endDate);
    if (!endDate) setIsRecurringRide(false);
    if (startDate && endDate) {
      setIsRecurringRide(true);
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const formatDate = (date: Date) => {
    if (!date) return "";

    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "");
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatTime = (time) => {
    return time?.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ajustar número de assentos disponíveis
  const decreaseSeats = () => {
    if (availableSeats > 1) setAvailableSeats(availableSeats - 1);
  };

  const increaseSeats = () => {
    if (availableSeats <= 42) setAvailableSeats(availableSeats + 1);
  };

  // Publicar a carona
  const handlePublishRide = useCallback(() => {
    // Validação básica dos campos
    if (!origin || !destination || !price) {
      Alert.alert(
        "Dados incompletos",
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }

    // Aqui você implementaria a lógica para publicar a carona no backend
    Alert.alert("Carona Publicada", "Sua carona foi publicada com sucesso!", [
      {
        text: "OK",
        onPress: () => router.push("/rides/my-rides"),
      },
    ]);
  }, [origin, destination, price, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
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
        {/* Seção: Veículo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="directions-car" size={20} color={colors.primaryPink} />
            <Text style={styles.sectionTitle}>Seu Veículo</Text>
          </View>

          <View style={styles.vehicleCard}>
            <Image
              source={userVehicle.image}
              style={styles.vehicleImage}
              resizeMode="contain"
            />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleModel}>
                {userVehicle.model} • {userVehicle.year}
              </Text>
              <Text style={styles.vehicleDetails}>
                {userVehicle.color} • {userVehicle.plate}
              </Text>
              <TouchableOpacity style={styles.changeVehicleButton}>
                <Text style={styles.changeVehicleText}>Alterar veículo</Text>
                <Icon
                  name="chevron-right"
                  size={16}
                  color={colors.primaryBlue}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Seção: Rota */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="map" size={20} color={colors.primaryPink} />
            <Text style={styles.sectionTitle}>Rota da Viagem</Text>
          </View>

          <TouchableOpacity
            style={styles.locationInput}
            onPress={() => navigateToLocationPicker("origin")}
          >
            <View style={[styles.locationDot, styles.originDot]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Origem</Text>
              <Text
                style={[styles.locationText, !origin && styles.placeholderText]}
              >
                {origin || "De onde você vai partir?"}
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationInput}
            onPress={() => navigateToLocationPicker("destination")}
          >
            <View style={[styles.locationDot, styles.destinationDot]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Destino</Text>
              <Text
                style={[
                  styles.locationText,
                  !destination && styles.placeholderText,
                ]}
              >
                {destination || "Para onde você vai?"}
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addStopButton}>
            <Icon
              name="add-circle-outline"
              size={18}
              color={colors.primaryBlue}
            />
            <Text style={styles.addStopText}>Adicionar parada</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Data e Hora */}
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
                {endDate && (
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
          </View>

          {/* Pickers para data e hora (visíveis quando clicados) */}
          {showDatePicker && (
            <CustomCalendar
              minDate={new Date()}
              startDate={startDate}
              endDate={endDate}
              startEndDateChange={handleStartEndDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Carona recorrente</Text>
            <Switch
              value={isRecurringRide}
              onValueChange={setIsRecurringRide}
              disabled={(isRecurringRide && !startDate) || !endDate}
              trackColor={{ false: colors.grey, true: colors.lightPink }}
              thumbColor={isRecurringRide ? colors.primaryPink : colors.white}
            />
          </View>
          {isRecurringRide && <RecurringInDays />}
        </View>

        {/* Seção: Preço e Assentos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="payments" size={20} color={colors.primaryPink} />
            <Text style={styles.sectionTitle}>Preço e Assentos</Text>
          </View>

          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={setPrice}
              placeholder="0,00"
              keyboardType="numeric"
              placeholderTextColor={colors.darkGrey}
            />
            <Text style={styles.perPersonText}>por pessoa</Text>
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

        {/* Seção: Preferências */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="tune" size={20} color={colors.primaryPink} />
            <Text style={styles.sectionTitle}>Preferências</Text>
          </View>

          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Icon name="smoke-free" size={20} color={colors.darkGrey} />
                <Text style={styles.preferenceLabel}>Permitir fumar</Text>
              </View>
              <Switch
                value={allowSmoking}
                onValueChange={setAllowSmoking}
                trackColor={{ false: colors.grey, true: colors.lightPink }}
                thumbColor={allowSmoking ? colors.primaryPink : colors.white}
              />
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Icon name="pets" size={20} color={colors.darkGrey} />
                <Text style={styles.preferenceLabel}>Permitir animais</Text>
              </View>
              <Switch
                value={allowPets}
                onValueChange={setAllowPets}
                trackColor={{ false: colors.grey, true: colors.lightPink }}
                thumbColor={allowPets ? colors.primaryPink : colors.white}
              />
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Icon name="more-horiz" size={20} color={colors.darkGrey} />
                <Text style={styles.preferenceLabel}>Pode fazer paradas</Text>
              </View>
              <Switch
                value={canMakeStops}
                onValueChange={setCanMakeStops}
                trackColor={{ false: colors.grey, true: colors.lightPink }}
                thumbColor={canMakeStops ? colors.primaryPink : colors.white}
              />
            </View>
          </View>

          <View style={styles.luggageSizeContainer}>
            <Text style={styles.luggageLabel}>Tamanho máximo de bagagem:</Text>
            <View style={styles.luggageOptions}>
              <TouchableOpacity
                style={[
                  styles.luggageOption,
                  luggageSize === "small" && styles.luggageSelected,
                ]}
                onPress={() => setLuggageSize("small")}
              >
                <Icon
                  name="work"
                  size={18}
                  color={
                    luggageSize === "small" ? colors.white : colors.darkGrey
                  }
                />
                <Text
                  style={[
                    styles.luggageText,
                    luggageSize === "small" && styles.luggageTextSelected,
                  ]}
                >
                  Pequena
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.luggageOption,
                  luggageSize === "medium" && styles.luggageSelected,
                ]}
                onPress={() => setLuggageSize("medium")}
              >
                <Icon
                  name="work"
                  size={22}
                  color={
                    luggageSize === "medium" ? colors.white : colors.darkGrey
                  }
                />
                <Text
                  style={[
                    styles.luggageText,
                    luggageSize === "medium" && styles.luggageTextSelected,
                  ]}
                >
                  Média
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.luggageOption,
                  luggageSize === "large" && styles.luggageSelected,
                ]}
                onPress={() => setLuggageSize("large")}
              >
                <Icon
                  name="luggage"
                  size={24}
                  color={
                    luggageSize === "large" ? colors.white : colors.darkGrey
                  }
                />
                <Text
                  style={[
                    styles.luggageText,
                    luggageSize === "large" && styles.luggageTextSelected,
                  ]}
                >
                  Grande
                </Text>
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
            placeholder="Adicione informações importantes para os passageiros, como ponto de encontro, regras, etc."
            placeholderTextColor={colors.darkGrey}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Footer com botão de publicar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePublishRide}
          activeOpacity={0.8}
        >
          <Text style={styles.publishButtonText}>Publicar Carona</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralLight,
  },
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingBottom: 100,
  },
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
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    padding: 12,
  },
  vehicleImage: {
    width: 80,
    height: 60,
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 2,
  },
  vehicleDetails: {
    fontSize: 14,
    color: colors.darkGrey,
    marginBottom: 6,
  },
  changeVehicleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeVehicleText: {
    fontSize: 14,
    color: colors.primaryBlue,
    marginRight: 4,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  originDot: {
    backgroundColor: colors.primaryPink,
  },
  destinationDot: {
    backgroundColor: colors.primaryBlue,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.darkGrey,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 15,
    color: colors.black,
  },
  placeholderText: {
    color: colors.darkGrey,
    fontStyle: "italic",
  },
  addStopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    paddingVertical: 8,
  },
  addStopText: {
    fontSize: 14,
    color: colors.primaryBlue,
    marginLeft: 6,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: "48%",
  },
  dateTimeText: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    marginLeft: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 15,
    color: colors.black,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.darkGrey,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  perPersonText: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  seatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  seatsLabel: {
    fontSize: 15,
    color: colors.black,
  },
  seatsSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
  },
  seatsCountContainer: {
    width: 40,
    alignItems: "center",
  },
  seatsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  preferencesContainer: {
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  preferenceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceLabel: {
    fontSize: 15,
    color: colors.black,
    marginLeft: 12,
  },
  luggageSizeContainer: {
    marginTop: 4,
  },
  luggageLabel: {
    fontSize: 15,
    color: colors.black,
    marginBottom: 12,
  },
  luggageOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  luggageOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  luggageSelected: {
    backgroundColor: colors.primaryPink,
  },
  luggageText: {
    fontSize: 14,
    color: colors.darkGrey,
    marginLeft: 6,
  },
  luggageTextSelected: {
    color: colors.white,
  },
  notesInput: {
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  publishButton: {
    backgroundColor: colors.primaryPink,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default OfferRideScreen;
