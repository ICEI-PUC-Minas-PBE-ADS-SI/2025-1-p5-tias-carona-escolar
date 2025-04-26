import { colors } from "@/src/constants/colors";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Text,
} from "react-native";
import StatusBadge from "./StatusBadge";
import { TypeBadge } from ".";
import {
  ParticipantsInterface,
  RideHistoryInterface,
} from "@/src/interfaces/ride-history.interface";

const RideItem = ({
  ride,
  onPress,
}: {
  ride: RideHistoryInterface;
  onPress: (ride: RideHistoryInterface) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const renderParticipant = ({ item }: { item: ParticipantsInterface }) => (
    <View style={styles.participantItem}>
      <Image source={{ uri: item.photo }} style={styles.avatar} />
      <View style={styles.participantTextInfo}>
        <Text style={styles.personName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.roleText}>
          {item.role === "driver" ? "Motorista" : "Passageiro"}
        </Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.rideCard}
      onPress={() => onPress(ride)}
      activeOpacity={0.7}
    >
      <View style={styles.rideCardHeader}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{ride.date}</Text>
          <Text style={styles.timeText}>{ride.time}</Text>
        </View>
        <View style={styles.badgeContainer}>
          <TypeBadge type={ride.type} />
          <StatusBadge status={ride.status} />
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeMarkers}>
          <View style={styles.originDot} />
          <View style={styles.routeLine} />
          <View style={styles.destinationDot} />
        </View>
        <View style={styles.routeTextContainer}>
          <Text style={styles.routeText} numberOfLines={1}>
            {ride.origin}
          </Text>
          <Text style={styles.routeText} numberOfLines={1}>
            {ride.destination}
          </Text>
        </View>
      </View>

      <View style={styles.rideInfo}>
        <View style={styles.tripMetrics}>
          <View style={styles.metricItem}>
            <Feather name="map-pin" size={14} color={colors.darkGrey} />
            <Text style={styles.metricText}>{ride.distance}</Text>
          </View>
          <View style={styles.metricItem}>
            <Feather name="clock" size={14} color={colors.darkGrey} />
            <Text style={styles.metricText}>{ride.duration}</Text>
          </View>
          <View style={styles.metricItem}>
            <Feather name="dollar-sign" size={14} color={colors.darkGrey} />
            <Text style={styles.metricText}>{ride.price}</Text>
          </View>
        </View>
      </View>

      <View style={styles.participantsContainer}>
        <FlatList
          data={expanded ? ride.participants : ride.participants.slice(0, 0)}
          renderItem={renderParticipant}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.participantsList}
        />

        {ride.participants.length > 0 && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.expandButton}
          >
            <Text style={styles.expandButtonText}>
              {expanded ? "Ver menos" : "Ver participantes"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {ride.status === "cancelled" && (
        <View style={styles.cancellationContainer}>
          <Text style={styles.cancellationText}>{ride.cancellationReason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rideCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rideCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: "column",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
  },
  timeText: {
    fontSize: 12,
    color: colors.darkGrey,
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  routeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  routeMarkers: {
    width: 24,
    alignItems: "center",
    marginRight: 8,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryPink,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryBlue,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.grey,
    marginVertical: 4,
  },
  routeTextContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: 60,
  },
  routeText: {
    fontSize: 14,
    color: colors.black,
  },
  rideInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripMetrics: {
    flexDirection: "row",
    flex: 1,
    marginRight: 8,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metricText: {
    fontSize: 12,
    color: colors.darkGrey,
    marginLeft: 4,
  },
  participantsContainer: {
    flex: 1,
    maxWidth: 160,
  },
  participantsList: {
    paddingVertical: 4,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  participantTextInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.black,
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.darkGrey,
    marginLeft: 4,
  },
  roleText: {
    fontSize: 12,
    color: colors.darkGrey,
    marginTop: 2,
  },
  expandButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  expandButtonText: {
    fontSize: 12,
    color: colors.primaryBlue,
    fontWeight: "500",
  },
  cancellationContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: `${colors.darkPink}10`,
    borderRadius: 8,
  },
  cancellationText: {
    fontSize: 12,
    color: colors.darkPink,
  },
});

export default RideItem;
