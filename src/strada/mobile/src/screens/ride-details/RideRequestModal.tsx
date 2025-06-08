import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  acceptRideRequest,
  createRideRequest,
} from "@/src/services/ride-request.service";
import RouteSelector from "../offer-ride/RouteSelector";
import AutocompleteSearch from "@/src/components/shared/SearchBar";
import { getStoredUserID } from "@/src/services/user.service";

// Define colors based on your existing scheme
const colors = {
  white: "#FFFFFF",
  black: "#1A1A1A",
  primaryPink: "#FF758F",
  lightPink: "#FFD1DC",
  darkPink: "#E63950",
  neutralLight: "#F0F2F5",
  primaryBlue: "#003360",
  primaryBlueDarkTheme: "#1E90FF",
  secondaryBlue: "#4D8CFF",
  accentBlue: "#66A3FF",
  softBlue: "#E6F0FF",
  lightGrey: "#F0F0F0",
  grey: "#BDBDBD",
  darkGrey: "#8C8C8C",
};

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
}

interface CreateRideRequestModalProps {
  isVisible: boolean;
  onClose: () => void;
  rideId: string;
  availableSeats: number;
  onSuccess: () => void;
}

const CreateRideRequestModal: React.FC<CreateRideRequestModalProps> = ({
  isVisible,
  onClose,
  rideId,
  availableSeats,
  onSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const [seatsNeeded, setSeatsNeeded] = useState<string>("1");
  const [message, setMessage] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(
    null
  );
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<"origin" | "destination">(
    "origin"
  );

  const handleCreateRequest = useCallback(async () => {
    setError(null);

    if (!pickupLocation || !dropoffLocation) {
      setError("Por favor, selecione os locais de partida e chegada.");
      return;
    }

    const seats = parseInt(seatsNeeded, 10);
    if (isNaN(seats) || seats <= 0 || seats > availableSeats) {
      setError(`O número de assentos deve ser entre 1 e ${availableSeats}.`);
      return;
    }

    setLoading(true);
    try {
      const userId = await getStoredUserID();
      console.log(pickupLocation, dropoffLocation);
      const rideRequestPayload = {
        passengerId: userId,
        seatsNeeded: seats,
        message: message.trim(),
        pickupLocation: {
          address: pickupLocation.address,
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
        },
        dropoffLocation: {
          address: dropoffLocation.address,
          latitude: dropoffLocation.latitude,
          longitude: dropoffLocation.longitude,
        },
      };

      const rideRequest = await createRideRequest(rideId, rideRequestPayload);
      await acceptRideRequest(rideRequest.data.id);
      onSuccess();
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao criar a solicitação de carona.");
    } finally {
      setLoading(false);
    }
  }, [
    seatsNeeded,
    message,
    pickupLocation,
    dropoffLocation,
    rideId,
    availableSeats,
    onSuccess,
    onClose,
  ]);

  const resetForm = useCallback(() => {
    setSeatsNeeded("1");
    setMessage("");
    setPickupLocation(null);
    setDropoffLocation(null);
    setError(null);
  }, []);

  const openSearchModal = useCallback((type: "origin" | "destination") => {
    setSearchType(type);
    setShowSearchModal(true);
  }, []);

  const closeSearchModal = useCallback(() => {
    setShowSearchModal(false);
  }, []);

  const handleLocationSelect = useCallback(
    (location: LocationData) => {
      if (searchType === "origin") {
        setPickupLocation(location);
      } else {
        setDropoffLocation(location);
      }
      setShowSearchModal(false);
    },
    [searchType]
  );

  const handlePlaceSelected = useCallback(
    (place: any) => {
      // Adapte esta função conforme a estrutura do objeto retornado pelo AutocompleteSearch
      const locationData: LocationData = {
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address,
        name: place.name,
      };
      handleLocationSelect(locationData);
    },
    [handleLocationSelect]
  );

  const handleSeatsChange = useCallback(
    (text: string) => {
      if (text === "") {
        setSeatsNeeded("");
        return;
      }

      const num = parseInt(text, 10);
      if (!isNaN(num) && num >= 1 && num <= availableSeats) {
        setSeatsNeeded(text);
      }
    },
    [availableSeats]
  );

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!isVisible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {
                paddingTop: insets.top || 20,
                paddingBottom: insets.bottom || 20,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Solicitar Carona</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={colors.darkGrey} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              <Text style={styles.label}>Assentos Necessários:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={seatsNeeded}
                onChangeText={handleSeatsChange}
                placeholder={`Máx. ${availableSeats} assentos`}
                placeholderTextColor={colors.grey}
              />

              <Text style={styles.label}>Mensagem (opcional):</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                multiline
                value={message}
                onChangeText={setMessage}
                placeholder="Ex: Por favor, me espere na esquina."
                placeholderTextColor={colors.grey}
              />

              <Text style={styles.label}>Rota:</Text>
              <RouteSelector
                originLocation={pickupLocation}
                destinationLocation={dropoffLocation}
                openSearchModal={openSearchModal}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.requestButton, loading && { opacity: 0.7 }]}
                onPress={handleCreateRequest}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.requestButtonText}>Solicitar Carona</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Search Modal */}
      {showSearchModal && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showSearchModal}
          onRequestClose={closeSearchModal}
        >
          <AutocompleteSearch
            onSelectPlace={handlePlaceSelected}
            onBack={closeSearchModal}
          />
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.black,
    marginBottom: 15,
    backgroundColor: colors.white,
  },
  selectedAddress: {
    fontSize: 14,
    color: colors.darkGrey,
    marginTop: -10,
    marginBottom: 10,
    paddingLeft: 5,
  },
  errorText: {
    color: colors.darkPink,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  requestButton: {
    backgroundColor: colors.primaryPink,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  requestButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CreateRideRequestModal;
