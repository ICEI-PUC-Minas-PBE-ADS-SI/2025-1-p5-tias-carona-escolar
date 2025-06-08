import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Cores já definidas no seu app
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

/**
 * RouteSelector Component: Componente melhorado para seleção de origem e destino
 * @param {object} props - Component props
 * @param {object} props.originLocation - Localização de origem
 * @param {object} props.destinationLocation - Localização de destino
 * @param {function} props.openSearchModal - Função para abrir modal de busca
 */
const RouteSelector = ({
  originLocation,
  destinationLocation,
  openSearchModal,
}) => {
  return (
    <View style={[styles.routeContainer, styles.section]}>
      {/* Header da seção */}
      <View style={styles.routeHeader}>
        <View style={styles.routeHeaderIconContainer}>
          <Icon name="map" size={24} color={colors.primaryPink} />
        </View>
        <View style={styles.routeHeaderTextContainer}>
          <Text style={styles.routeTitle}>Rota da Viagem</Text>
          <Text style={styles.routeSubtitle}>Defina origem e destino</Text>
        </View>
      </View>

      {/* Container principal da rota */}
      <View style={styles.routeMainContainer}>
        {/* Origem */}
        <TouchableOpacity
          style={styles.locationInput}
          onPress={() => openSearchModal("origin")}
          activeOpacity={0.7}
        >
          <View style={styles.locationIconContainer}>
            <View style={[styles.locationDot, styles.originDot]} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Saída</Text>
            <Text
              style={[
                styles.locationText,
                !originLocation && styles.placeholderText,
              ]}
              numberOfLines={2}
            >
              {originLocation?.name ||
                originLocation?.address ||
                "De onde você vai partir?"}
            </Text>
          </View>
          <View style={styles.chevronContainer}>
            <Icon name="chevron-right" size={20} color={colors.darkGrey} />
          </View>
        </TouchableOpacity>

        {/* Linha conectora */}
        <View style={styles.connectorContainer}>
          <View style={styles.connectorLine} />
        </View>

        {/* Destino */}
        <TouchableOpacity
          style={styles.locationInput}
          onPress={() => openSearchModal("destination")}
          activeOpacity={0.7}
        >
          <View style={styles.locationIconContainer}>
            <View style={[styles.locationDot, styles.destinationDot]} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Chegada</Text>
            <Text
              style={[
                styles.locationText,
                !destinationLocation && styles.placeholderText,
              ]}
              numberOfLines={2}
            >
              {destinationLocation?.name ||
                destinationLocation?.address ||
                "Para onde você vai?"}
            </Text>
          </View>
          <View style={styles.chevronContainer}>
            <Icon name="chevron-right" size={20} color={colors.darkGrey} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Informação adicional */}
      {(originLocation || destinationLocation) && (
        <View style={styles.routeInfoContainer}>
          <Icon name="info-outline" size={16} color={colors.primaryBlue} />
          <Text style={styles.routeInfoText}>
            Toque nos campos para alterar os locais da viagem
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  routeHeaderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightPink,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  routeHeaderTextContainer: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 2,
  },
  routeSubtitle: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  routeMainContainer: {
    position: "relative",
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  locationIconContainer: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 24,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  originDot: {
    backgroundColor: colors.primaryPink,
    borderColor: colors.darkPink,
  },
  destinationDot: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  locationTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.darkGrey,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    lineHeight: 22,
  },
  placeholderText: {
    color: colors.darkGrey,
    fontWeight: "400",
  },
  chevronContainer: {
    padding: 4,
  },
  connectorContainer: {
    position: "relative",
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  connectorLine: {
    position: "absolute",
    left: 32,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.grey,
  },
  swapButtonContainer: {
    position: "absolute",
    right: 20,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightPink,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  routeInfoText: {
    fontSize: 13,
    color: colors.primaryBlue,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});

export default RouteSelector;
