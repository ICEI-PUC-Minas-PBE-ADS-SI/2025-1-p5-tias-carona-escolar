import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import Animated from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "@/src/constants/colors";
import { lightTheme } from "@/src/constants/theme";

const LocationPanel = ({
  isSearching,
  pickup,
  dropoff,
  currentSnapIndex,
  animatedStyle,
  onSearch,
}) => {
  const theme = lightTheme;

  return (
    <Animated.View style={[styles.locationPanel, animatedStyle]}>
      {isSearching ? (
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBar} onPress={onSearch}>
            <Icon name="search" size={22} color={colors.darkGrey} />
            <TextInput
              style={styles.searchPlaceholder}
              placeholder="Para onde você vai?"
            />
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
              <Text style={styles.locationAddress}>{pickup?.address}</Text>
            </View>
          </View>

          {/* Destination */}
          <View style={styles.locationItem}>
            <View style={styles.locationIconContainer}>
              <View style={[styles.locationDot, { backgroundColor: "#333" }]} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Where to go?</Text>
              <Text style={styles.locationAddress}>{dropoff?.address}</Text>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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

export default LocationPanel;
