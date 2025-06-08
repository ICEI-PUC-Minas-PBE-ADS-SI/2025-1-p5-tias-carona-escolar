// src/components/ride/RideInfoCard.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { lightTheme } from "@/src/constants/theme";

const RideInfoCard = ({
  rideData,
  bottomSheetRef,
  snapPoints,
  onSheetChanges,
}) => {
  const theme = lightTheme;

  const renderStars = (rating) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "#4CAF50";
      case "PENDING":
        return "#FF9800";
      case "COMPLETED":
        return "#2196F3";
      case "CANCELLED":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Em Andamento";
      case "PENDING":
        return "Aguardando";
      case "COMPLETED":
        return "Concluída";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDistance = (distance) => {
    if (!distance) return "--";
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${distance.toFixed(0)} m`;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={onSheetChanges}
      handleComponent={(props) => (
        <BottomSheetHandle {...props} style={styles.bottomSheetHandle}>
          <View style={styles.handleBar} />
        </BottomSheetHandle>
      )}
    >
      <BottomSheetScrollView
        style={styles.rideInfoCard}
        showsVerticalScrollIndicator={false}
      >
        {/* Status da Corrida */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(rideData.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(rideData.status)}
            </Text>
          </View>
          <Text style={styles.rideIdText}>ID: {rideData.id.slice(-8)}</Text>
        </View>

        {/* Driver Info */}
        <View style={styles.driverInfoContainer}>
          <View style={styles.driverInfo}>
            <Image
              source={{ uri: rideData.driverImage }}
              style={styles.driverImage}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{rideData.driverName}</Text>
              <Text style={styles.driverRole}>Motorista</Text>
              <View style={styles.ratingContainer}>
                {renderStars(rideData.rating)}
                <Text style={styles.ratingText}>
                  ({rideData.rating.toFixed(1)})
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.carInfo}>
            <Text style={styles.carModel}>{rideData.carModel}</Text>
            <Text style={styles.carColor}>{rideData.carColor}</Text>
            <Text style={styles.licensePlate}>{rideData.licensePlate}</Text>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.tripDetailsSection}>
          <Text style={styles.sectionTitle}>Detalhes da Viagem</Text>

          <View style={styles.tripDetailsGrid}>
            <View style={styles.tripDetailItem}>
              <FontAwesome name="clock-o" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Horário de Partida</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.departureTime}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome
                name="hourglass-half"
                size={16}
                color={theme.primary}
              />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Duração Estimada</Text>
                <Text style={styles.tripDetailValue}>{rideData.duration}</Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="road" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Distância</Text>
                <Text style={styles.tripDetailValue}>
                  {formatDistance(rideData.estimatedDistance)}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="users" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Assentos Disponíveis</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.availableSeats}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="credit-card" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Pagamento</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.paymentMethod}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="suitcase" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Bagagem</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.allowLuggage ? "Permitida" : "Não permitida"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Route Info */}
        <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Rota</Text>

          <View style={styles.routeItem}>
            <View style={styles.routeMarker}>
              <FontAwesome name="circle" size={12} color={theme.primary} />
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Origem</Text>
              <Text style={styles.routeAddress}>
                {rideData.pickup?.address}
              </Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeItem}>
            <View style={styles.routeMarker}>
              <FontAwesome name="map-marker" size={16} color="#F44336" />
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Destino</Text>
              <Text style={styles.routeAddress}>
                {rideData.dropoff?.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Passengers Section */}
        {rideData.passengers && rideData.passengers.length > 0 && (
          <View style={styles.passengersSection}>
            <Text style={styles.sectionTitle}>
              Passageiros ({rideData.passengers.length})
            </Text>

            {rideData.passengers.map((passenger) => (
              <View key={passenger.id} style={styles.passengerCard}>
                <Image
                  source={{ uri: passenger.imgUrl }}
                  style={styles.passengerImage}
                />
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>{passenger.name}</Text>
                  <View style={styles.passengerRating}>
                    <FontAwesome name="star" size={12} color="#FFD700" />
                    <Text style={styles.passengerRatingText}>
                      {passenger.rating.toFixed(1)}
                    </Text>
                  </View>
                  {passenger.pickup && (
                    <Text style={styles.passengerPickup} numberOfLines={1}>
                      📍 {passenger.pickup.address}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Fare Details */}
        <View style={styles.fareSection}>
          <Text style={styles.sectionTitle}>Detalhes do Valor</Text>

          <View style={styles.fareDetails}>
            <View style={styles.fareItem}>
              <Text style={styles.fareLabel}>Preço por Assento</Text>
              <Text style={styles.fareAmount}>
                R$ {rideData.pricePerSeat.toFixed(2)}
              </Text>
            </View>

            <View style={styles.fareItem}>
              <Text style={styles.fareLabel}>Desconto</Text>
              <Text style={styles.fareAmount}>--</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.fareItem}>
              <Text style={styles.totalFareLabel}>Valor Total</Text>
              <Text style={styles.totalFare}>
                R$ {rideData.totalFare?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Feedback */}
        {rideData.feedback && (
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>Avaliação</Text>
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{rideData.feedback}</Text>
            </View>
          </View>
        )}

        {/* Bottom padding for better scrolling */}
        <View style={styles.bottomPadding} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
  },

  // Status Section
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  rideIdText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },

  // Driver Section
  driverInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  driverImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  driverRole: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  carInfo: {
    alignItems: "flex-end",
  },
  carModel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  carColor: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  licensePlate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontFamily: "monospace",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Section Titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },

  // Trip Details Section
  tripDetailsSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tripDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tripDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
  },
  tripDetailContent: {
    marginLeft: 8,
    flex: 1,
  },
  tripDetailLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  tripDetailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  // Route Section
  routeSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  routeMarker: {
    width: 20,
    alignItems: "center",
    paddingTop: 2,
  },
  routeContent: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 12,
  },
  routeLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#DDD",
    marginLeft: 9,
    marginVertical: 4,
  },

  // Passengers Section
  passengersSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  passengerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 8,
  },
  passengerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  passengerRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  passengerRatingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  passengerPickup: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },

  // Fare Section
  fareSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fareDetails: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  fareItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: "#666",
  },
  fareAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  totalFareLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalFare: {
    fontSize: 16,
    fontWeight: "700",
    color: lightTheme.primary,
  },

  // Feedback Section
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  feedbackText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    fontStyle: "italic",
  },

  bottomPadding: {
    height: 20,
  },
});

export default RideInfoCard;
