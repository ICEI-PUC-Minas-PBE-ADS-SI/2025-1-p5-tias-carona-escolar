// src/components/ride/RideInfoCard.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetView,
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
            <Text style={styles.tripDetailValue}>{rideData.paymentMethod}</Text>
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
                  <Text style={styles.passengerItemName}>{passenger.name}</Text>
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
    borderColor: lightTheme.primary,
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
    color: lightTheme.primary,
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
});

export default RideInfoCard;
