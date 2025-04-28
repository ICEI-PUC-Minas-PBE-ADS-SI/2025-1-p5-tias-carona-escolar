import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { RideItem } from ".";
import { RideHistoryInterface } from "@/src/interfaces/ride-history.interface";

// Cores do seu tema
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

// Dados de exemplo
const rideHistoryData: RideHistoryInterface[] = [
  {
    id: 1,
    date: "24 Abr, 2025",
    time: "08:15",
    type: "passenger",
    status: "completed",
    origin: "Av. Paulista, 1000",
    destination: "Shopping Ibirapuera",
    distance: "7,3 km",
    duration: "25 min",
    price: "R$ 18,50",
    participants: [
      {
        name: "Carlos Oliveira",
        rating: 4.9,
        photo: "https://via.placeholder.com/60",
        role: "driver",
      },
      {
        name: "Juliana Costa",
        rating: 4.7,
        photo: "https://via.placeholder.com/60",
        role: "driver",
      },
      {
        name: "Roberto Alves",
        rating: 4.5,
        photo: "https://via.placeholder.com/60",
        role: "driver",
      },
      {
        name: "Eduardo Lima",
        rating: 4.6,
        photo: "https://via.placeholder.com/60",
        role: "passenger",
      },
    ],
  },
  {
    id: 2,
    date: "22 Abr, 2025",
    time: "17:45",
    type: "driver",
    status: "completed",
    origin: "Estação Faria Lima",
    destination: "Aeroporto de Congonhas",
    distance: "12,5 km",
    duration: "35 min",
    price: "R$ 31,20",
    participants: [
      {
        name: "Marina Santos",
        rating: 4.8,
        photo: "https://via.placeholder.com/60",
        role: "passenger",
      },
    ],
  },
  {
    id: 3,
    date: "20 Abr, 2025",
    time: "14:30",
    type: "passenger",
    status: "completed",
    origin: "Vila Madalena",
    destination: "Parque Ibirapuera",
    distance: "8,9 km",
    duration: "30 min",
    price: "R$ 22,40",
    participants: [
      {
        name: "Juliana Costa",
        rating: 4.7,
        photo: "https://via.placeholder.com/60",
        role: "driver",
      },
      {
        name: "Roberto Alves",
        rating: 4.5,
        photo: "https://via.placeholder.com/60",
        role: "driver",
      },
      {
        name: "Eduardo Lima",
        rating: 4.6,
        photo: "https://via.placeholder.com/60",
        role: "passenger",
      },
    ],
  },
  {
    id: 4,
    date: "18 Abr, 2025",
    time: "09:10",
    type: "passenger",
    status: "cancelled",
    origin: "Rua Augusta, 500",
    destination: "Shopping Eldorado",
    distance: "6,5 km",
    duration: "20 min",
    price: "R$ 16,00",
    cancellationReason: "Motorista cancelou a viagem",
    participants: [
      {
        name: "Roberto Alves",
        rating: 4.5,
        photo: "https://via.placeholder.com/60",
        role: "driver",
      },
      {
        name: "Eduardo Lima",
        rating: 4.6,
        photo: "https://via.placeholder.com/60",
        role: "passenger",
      },
    ],
  },
  {
    id: 5,
    date: "15 Abr, 2025",
    time: "20:05",
    type: "driver",
    status: "completed",
    origin: "Estação Butantã",
    destination: "Avenida Rebouças, 1500",
    distance: "5,2 km",
    duration: "18 min",
    price: "R$ 14,75",
    participants: [
      {
        name: "Eduardo Lima",
        rating: 4.6,
        photo: "https://via.placeholder.com/60",
        role: "passenger",
      },
    ],
  },
];

const RideHistoryScreen = () => {
  const [filter, setFilter] = useState("Todos");

  const handleRidePress = () => {
    // ação ao tocar em uma carona
  };

  const filteredRides = rideHistoryData.filter((ride) => {
    if (filter === "Todos") return true;
    return ride.type === filter.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Feather name="chevron-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Caronas</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={20} color={colors.primaryBlue} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {["Todos", "Passageiro", "Motorista"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterTab,
              filter === type && styles.activeFilterTab,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === type && styles.activeFilterTabText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RideItem ride={item} onPress={handleRidePress} />
        )}
        contentContainerStyle={styles.rideList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhuma carona encontrada.
          </Text>
        }
      />
    </SafeAreaView>
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
  moreButton: {
    padding: 4,
  },
  filterButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
  },
  activeFilterTab: {
    backgroundColor: colors.primaryBlue,
  },
  filterTabText: {
    color: colors.darkGrey,
    fontWeight: "500",
  },
  activeFilterTabText: {
    color: colors.white,
  },
  rideList: {
    padding: 16,
  },
});

export default RideHistoryScreen;
