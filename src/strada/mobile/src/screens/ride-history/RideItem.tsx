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
  Animated,
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
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const participants = [] as ParticipantsInterface[];

  const renderParticipant = ({ item }: { item: ParticipantsInterface }) => (
    <View style={styles.participantItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.photo }} style={styles.avatar} />
        <View style={styles.onlineIndicator} />
      </View>
      <View style={styles.participantTextInfo}>
        <Text style={styles.personName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.roleContainer}>
          <View
            style={[
              styles.roleBadge,
              item.role === "driver"
                ? styles.driverBadge
                : styles.passengerBadge,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                item.role === "driver"
                  ? styles.driverText
                  : styles.passengerText,
              ]}
            >
              {item.role === "driver" ? "Motorista" : "Passageiro"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.rideCard}
        onPress={() => onPress(ride)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Header com data e badges */}
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

        {/* Rota com visual aprimorado */}
        <View style={styles.routeContainer}>
          <View style={styles.routeMarkers}>
            <View style={styles.originDot} />
            <View style={styles.routeLine}>
              <View style={styles.dottedLine} />
            </View>
            <View style={styles.destinationDot} />
          </View>
          <View style={styles.routeTextContainer}>
            <View style={styles.routeItem}>
              <Feather name="map-pin" size={14} color={colors.primaryPink} />
              <Text style={styles.routeText} numberOfLines={2}>
                {ride.origin}
              </Text>
            </View>
            <View style={styles.routeItem}>
              <Feather name="navigation" size={14} color={colors.primaryBlue} />
              <Text style={styles.routeText} numberOfLines={2}>
                {ride.destination}
              </Text>
            </View>
          </View>
        </View>

        {/* Informações da viagem com melhor layout */}
        <View style={styles.rideInfo}>
          <View style={styles.tripMetrics}>
            <View style={styles.metricItem}>
              <View style={styles.metricIcon}>
                <Feather name="map-pin" size={14} color={colors.white} />
              </View>
              <Text style={styles.metricText}>{ride.distance}</Text>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricIcon}>
                <Feather name="clock" size={14} color={colors.white} />
              </View>
              <Text style={styles.metricText}>{ride.duration}</Text>
            </View>
            <View style={styles.priceContainer}>
              <View style={styles.priceIcon}>
                <Feather name="dollar-sign" size={14} color={colors.white} />
              </View>
              <Text style={styles.priceText}>{ride.price}</Text>
            </View>
          </View>
        </View>

        {/* Seção de participantes aprimorada */}
        {participants.length > 0 && (
          <View style={styles.participantsSection}>
            <View style={styles.participantsHeader}>
              <Text style={styles.participantsTitle}>
                Participantes ({participants.length})
              </Text>
              <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                style={styles.expandButton}
              >
                <Text style={styles.expandButtonText}>
                  {expanded ? "Ver menos" : "Ver todos"}
                </Text>
                <Feather
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.primaryBlue}
                />
              </TouchableOpacity>
            </View>

            {expanded && (
              <View style={styles.participantsContainer}>
                <FlatList
                  data={participants}
                  renderItem={renderParticipant}
                  keyExtractor={(item, index) => `${item.name}-${index}`}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.participantsList}
                  ItemSeparatorComponent={() => (
                    <View style={styles.participantSeparator} />
                  )}
                />
              </View>
            )}
          </View>
        )}

        {/* Área de cancelamento aprimorada */}
        {ride.status === "cancelled" && (
          <View style={styles.cancellationContainer}>
            <View style={styles.cancellationHeader}>
              <Feather name="x-circle" size={16} color={colors.darkPink} />
              <Text style={styles.cancellationTitle}>Viagem Cancelada</Text>
            </View>
            <Text style={styles.cancellationText}>
              {ride.cancellationReason}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rideCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${colors.grey}20`,
  },
  rideCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: "column",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 14,
    color: colors.darkGrey,
    fontWeight: "500",
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  routeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingVertical: 8,
  },
  routeMarkers: {
    width: 24,
    alignItems: "center",
    marginRight: 16,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryPink,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryBlue,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  routeLine: {
    width: 2,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  dottedLine: {
    width: 2,
    height: 32,
    backgroundColor: colors.grey,
    opacity: 0.6,
  },
  routeTextContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: 70,
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  routeText: {
    fontSize: 15,
    color: colors.black,
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
  rideInfo: {
    marginBottom: 16,
  },
  tripMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primaryBlue}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  metricIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  metricText: {
    fontSize: 13,
    color: colors.darkGrey,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primaryPink}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryPink,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  priceText: {
    fontSize: 14,
    color: colors.primaryPink,
    fontWeight: "700",
  },
  participantsSection: {
    borderTopWidth: 1,
    borderTopColor: `${colors.grey}30`,
    paddingTop: 16,
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  participantsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  expandButtonText: {
    fontSize: 12,
    color: colors.primaryBlue,
    fontWeight: "600",
  },
  participantsContainer: {
    backgroundColor: `${colors.neutralLight}80`,
    borderRadius: 12,
    padding: 12,
  },
  participantsList: {
    gap: 8,
  },
  participantSeparator: {
    height: 1,
    backgroundColor: `${colors.grey}20`,
    marginVertical: 8,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: colors.white,
  },
  participantTextInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.darkGrey,
    marginLeft: 4,
    fontWeight: "500",
  },
  roleContainer: {
    alignSelf: "flex-start",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  driverBadge: {
    backgroundColor: `${colors.primaryBlue}20`,
  },
  passengerBadge: {
    backgroundColor: `${colors.primaryPink}20`,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "600",
  },
  driverText: {
    color: colors.primaryBlue,
  },
  passengerText: {
    color: colors.primaryPink,
  },
  cancellationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: `${colors.darkPink}08`,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.darkPink,
  },
  cancellationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  cancellationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.darkPink,
  },
  cancellationText: {
    fontSize: 13,
    color: colors.darkGrey,
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default RideItem;
