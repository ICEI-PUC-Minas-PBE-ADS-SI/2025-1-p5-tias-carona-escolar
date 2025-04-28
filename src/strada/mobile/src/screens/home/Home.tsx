import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  useWindowDimensions,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppImages } from "@/src/assets";
import { colors } from "@/src/constants/colors";
import AutocompleteSearch from "@/src/components/shared/SearchBar";

// Amostra de dados para exibição
const POPULAR_ROUTES = [
  {
    id: "1",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    day: "Seg, Qua, Sex",
  },
  { id: "2", origin: "Campinas", destination: "São Paulo", day: "Ter, Qui" },
  {
    id: "3",
    origin: "Guarulhos",
    destination: "São Paulo",
    day: "Todos os dias",
  },
];

const RIDES_AVAILABLE = [
  {
    id: "1",
    driver: "Mariana S.",
    avatar: AppImages.github,
    origin: "São Paulo",
    destination: "Campinas",
    date: "Hoje, 17:30",
    price: "R$ 35",
    rating: 4.9,
    seats: 3,
  },
  {
    id: "2",
    driver: "Pedro L.",
    avatar: AppImages.github,
    origin: "São Paulo",
    destination: "Santos",
    date: "Amanhã, 09:00",
    price: "R$ 45",
    rating: 4.7,
    seats: 2,
  },
  {
    id: "3",
    driver: "Julia M.",
    avatar: AppImages.github,
    origin: "São Paulo",
    destination: "Guarulhos",
    date: "Hoje, 18:15",
    price: "R$ 25",
    rating: 4.8,
    seats: 1,
  },
];

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [searchText, setSearchText] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const openSearchModal = () => {
    setSearchModalVisible(true);
  };

  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  const handlePlaceSelected = (place) => {
    console.log("Local selecionado:", place);
    // Aqui você pode navegar para a tela de resultados de caronas
    // ou fazer qualquer outra ação necessária
    closeSearchModal();
  };

  const navigateToRideDetails = useCallback(
    (id) => {
      router.push(`/ride/${id}`);
    },
    [router]
  );

  const navigateToSearch = useCallback(() => {
    router.push("/search");
  }, [router]);

  const navigateToRideMap = useCallback(() => {
    router.push("/map/map");
  }, [router]);

  const navigateToMyRides = useCallback(() => {
    router.push("/ride-history/ride-history");
  }, [router]);

  const renderPopularRouteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.popularRouteCard}
      onPress={() => navigateToSearch()}
    >
      <View style={styles.routeIconContainer}>
        <Icon name="trending-up" size={20} color={colors.primaryPink} />
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeText}>
          {item.origin} → {item.destination}
        </Text>
        <Text style={styles.routeSchedule}>{item.day}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.grey} />
    </TouchableOpacity>
  );

  const renderRideItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rideCard}
      onPress={() => navigateToRideDetails(item.id)}
    >
      <View style={styles.rideHeader}>
        <View style={styles.driverInfo}>
          <Image
            source={item.avatar}
            style={styles.driverAvatar}
            defaultSource={AppImages.github}
          />
          <View>
            <Text style={styles.driverName}>{item.driver}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoints}>
          <View style={styles.originPoint}>
            <View style={styles.originDot} />
            <Text style={styles.routePointText}>{item.origin}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.destinationPoint}>
            <View style={styles.destinationDot} />
            <Text style={styles.routePointText}>{item.destination}</Text>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.rideDetailItem}>
            <Icon name="schedule" size={16} color={colors.darkGrey} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.rideDetailItem}>
            <Icon name="person" size={16} color={colors.darkGrey} />
            <Text style={styles.detailText}>{item.seats} vagas</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userGreeting}>
          <Text style={styles.greeting}>Olá, Usuário!</Text>
          <Text style={styles.subGreeting}>Para onde vamos hoje?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile/1")}
        >
          <Image source={AppImages.github} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={openSearchModal}>
          <Icon name="search" size={22} color={colors.darkGrey} />
          <Text style={styles.searchPlaceholder}>Para onde você vai?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton} onPress={navigateToRideMap}>
          <Icon name="map" size={22} color={colors.white} />
        </TouchableOpacity>
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToSearch}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: colors.softBlue }]}
            >
              <Icon name="search" size={22} color={colors.primaryBlue} />
            </View>
            <Text style={styles.actionText}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/offer-ride/offer-ride")}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: colors.lightPink }]}
            >
              <Icon name="add" size={24} color={colors.primaryPink} />
            </View>
            <Text style={styles.actionText}>Oferecer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToMyRides}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.neutralLight },
              ]}
            >
              <Icon name="history" size={22} color={colors.darkGrey} />
            </View>
            <Text style={styles.actionText}>Minhas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/favorites")}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: colors.lightPink }]}
            >
              <Icon name="favorite" size={22} color={colors.primaryPink} />
            </View>
            <Text style={styles.actionText}>Favoritos</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Routes */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rotas Populares</Text>
            <TouchableOpacity onPress={() => router.push("/routes")}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={POPULAR_ROUTES}
            renderItem={renderPopularRouteItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Available Rides */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Caronas Disponíveis</Text>
            <TouchableOpacity onPress={() => router.push("/rides")}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={RIDES_AVAILABLE}
            renderItem={renderRideItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  userGreeting: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.black,
    fontFamily: "WorkSans-Bold",
  },
  subGreeting: {
    fontSize: 14,
    color: colors.darkGrey,
    marginTop: 2,
    fontFamily: "WorkSans-Regular",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.lightPink,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 4,
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: "WorkSans-Medium",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    fontFamily: "WorkSans-SemiBold",
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primaryPink,
    fontFamily: "WorkSans-Medium",
  },
  popularRouteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 15,
    color: colors.black,
    fontFamily: "WorkSans-Medium",
  },
  routeSchedule: {
    fontSize: 13,
    color: colors.darkGrey,
    marginTop: 2,
    fontFamily: "WorkSans-Regular",
  },
  rideCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    fontFamily: "WorkSans-Medium",
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
    fontFamily: "WorkSans-Medium",
  },
  priceContainer: {
    backgroundColor: colors.softBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 14,
    color: colors.primaryBlue,
    fontWeight: "600",
    fontFamily: "WorkSans-SemiBold",
  },
  routeContainer: {
    marginTop: 4,
  },
  routePoints: {
    marginBottom: 12,
  },
  originPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryPink,
    marginRight: 8,
  },
  routeLine: {
    width: 1,
    height: 14,
    backgroundColor: colors.grey,
    marginLeft: 5,
    marginVertical: 2,
  },
  destinationPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryBlue,
    marginRight: 8,
  },
  routePointText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: "WorkSans-Regular",
  },
  rideDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rideDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 13,
    color: colors.darkGrey,
    marginLeft: 6,
    fontFamily: "WorkSans-Medium",
  },
});

export default HomeScreen;
