import React, { useState, useCallback, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppImages } from "@/src/assets";
import { colors } from "@/src/constants/colors";
import AutocompleteSearch from "@/src/components/shared/SearchBar";
import { getPopularRoutes, searchRides } from "@/src/services/ride.service";

interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  frequency: number;
  lastUsed: string;
  start_address: string;
  end_address: string;
}

interface RideData {
  actual_distance: number | null;
  actual_duration: number | null;
  actual_end_time: string | null; // ISO date string
  actual_route_wkt: string | null;
  actual_start_time: string | null;
  allow_luggage: boolean;
  available_seats: number;
  bounding_box_wkt: string;
  created_at: string; // ISO date string
  current_latitude: number | null;
  current_location_wkt: string | null;
  current_longitude: number | null;
  departure_time: string; // ISO date string
  driver_id: string;
  end_address: string;
  end_distance: number;
  end_point_wkt: string;
  estimated_distance: number;
  estimated_duration: number;
  id: string;
  last_location_update: string | null; // ISO date string or null
  license_plate: string;
  planned_route_wkt: string;
  price_per_seat: number;
  driver: null;
  start_address: string;
  start_distance: number;
  start_point_wkt: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;
  total_distance: number;
  updated_at: string; // ISO date string
  vehicle_color: string;
  vehicle_model: string;
}

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [searchText, setSearchText] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
  const [availableRides, setAvailableRides] = useState<RideData[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingRides, setLoadingRides] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const getUserLocation = useCallback(async () => {
    setUserLocation({ lat: -23.5505, lng: -46.6333 });
  }, []);

  const loadPopularRoutes = useCallback(async () => {
    try {
      setLoadingRoutes(true);
      if (userLocation) {
        const routes = await getPopularRoutes(
          userLocation.lat,
          userLocation.lng
        );
        routes.map((route: PopularRoute) => {
          route.start_address = route.start_address.split(",")[0];
          route.end_address = route.end_address.split(",")[0];
          route.frequency = route.frequency || 0;
          return route;
        });
        setPopularRoutes(routes.slice(0, 3));
      }
    } catch (error) {
      console.error("Erro ao carregar rotas populares:", error);
      Alert.alert("Erro", "Não foi possível carregar as rotas populares");
    } finally {
      setLoadingRoutes(false);
    }
  }, [userLocation]);

  const loadAvailableRides = useCallback(async () => {
    try {
      setLoadingRides(true);
      if (userLocation) {
        const searchParams = {
          startLat: userLocation.lat,
          startLng: userLocation.lng,
          endLng: userLocation.lng + 3000,
          endLat: userLocation.lat + 3000,
          limit: 10,
          maxEndDistance: 5000,
          sortBy: "time" as const,
        };

        const { rides } = await searchRides(searchParams);
        setAvailableRides(rides);
      }
    } catch (error) {
      console.error("Erro ao carregar caronas:", error);
      Alert.alert("Erro", "Não foi possível carregar as caronas disponíveis");
    } finally {
      setLoadingRides(false);
    }
  }, [userLocation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      getUserLocation(),
      loadPopularRoutes(),
      loadAvailableRides(),
    ]);
    setRefreshing(false);
  }, [getUserLocation, loadPopularRoutes, loadAvailableRides]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (userLocation) {
      loadPopularRoutes();
      loadAvailableRides();
    }
  }, [userLocation, loadPopularRoutes, loadAvailableRides]);

  const openSearchModal = () => {
    setSearchModalVisible(true);
  };

  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  const handlePlaceSelected = async (place) => {
    if (userLocation && place.geometry) {
      try {
        const searchParams = {
          startLat: userLocation.lat,
          startLng: userLocation.lng,
          endLat: place.geometry.location.lat,
          endLng: place.geometry.location.lng,
          limit: 20,
          maxStartDistance: 2000,
          maxEndDistance: 2000,
          sortBy: "time" as const,
        };

        const results = await searchRides(searchParams);

        router.push({
          pathname: "/search-results",
          params: {
            origin: `${userLocation.lat},${userLocation.lng}`,
            destination: `${place.geometry.location.lat},${place.geometry.location.lng}`,
            destinationName: place.description,
            results: JSON.stringify(results.data || results),
          },
        });
      } catch (error) {
        console.error("Erro na busca:", error);
        Alert.alert("Erro", "Erro ao buscar caronas para este destino");
      }
    }

    closeSearchModal();
  };

  const navigateToRideDetails = useCallback(
    (id: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã, ${date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const renderPopularRouteItem = ({ item }: { item: PopularRoute }) => (
    <TouchableOpacity
      style={styles.popularRouteCard}
      onPress={() => navigateToSearch()}
    >
      <View style={styles.routeIconContainer}>
        <Icon name="trending-up" size={20} color={colors.primaryPink} />
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeText}>
          {item.start_address} → {item.end_address}
        </Text>
        <Text style={styles.routeSchedule}>
          {item.frequency} viagens esta semana
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.grey} />
    </TouchableOpacity>
  );

  const renderRideItem = ({ item }: { item: RideData }) => (
    <TouchableOpacity
      style={styles.rideCard}
      onPress={() => navigateToRideDetails(item.id)}
    >
      <View style={styles.rideHeader}>
        <View style={styles.driverInfo}>
          <Icon
            name="account-circle"
            size={50}
            color={colors.primaryPink}
            style={styles.driverAvatar}
          />

          <View>
            <Text style={styles.driverName}>{item.driver?.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.driver?.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            R$ {item.price_per_seat?.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoints}>
          <View style={styles.originPoint}>
            <View style={styles.originDot} />
            <Text style={styles.routePointText} numberOfLines={1}>
              {item.start_address}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.destinationPoint}>
            <View style={styles.destinationDot} />
            <Text style={styles.routePointText} numberOfLines={1}>
              {item.end_address}
            </Text>
          </View>
        </View>
        <View style={styles.rideDetails}>
          <View style={styles.rideDetailItem}>
            <Icon name="schedule" size={16} color={colors.darkGrey} />
            <Text style={styles.detailText}>
              {formatDate(item.departure_time)}
            </Text>
          </View>
          <View style={styles.rideDetailItem}>
            <Icon name="person" size={16} color={colors.darkGrey} />
            <Text style={styles.detailText}>{item.available_seats} vagas</Text>
          </View>
          {/* Ícones de comodidades */}
          <View style={styles.amenitiesContainer}>
            {item.allow_luggage && (
              <Icon name="luggage" size={14} color={colors.primaryBlue} />
            )}
            {item.allowPets && (
              <Icon name="pets" size={14} color={colors.primaryBlue} />
            )}
            {item.allowSmoking && (
              <Icon name="smoking-rooms" size={14} color={colors.primaryBlue} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLoadingCard = () => (
    <View style={styles.loadingCard}>
      <ActivityIndicator size="small" color={colors.primaryBlue} />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
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

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={openSearchModal}>
          <Icon name="search" size={22} color={colors.darkGrey} />
          <Text style={styles.searchPlaceholder}>Para onde você vai?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton} onPress={navigateToRideMap}>
          <Icon name="map" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        onRequestClose={closeSearchModal}
      >
        <AutocompleteSearch
          onSelectPlace={handlePlaceSelected}
          onBack={closeSearchModal}
          currentLocation={userLocation}
        />
      </Modal>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

          {loadingRoutes ? (
            renderLoadingCard()
          ) : popularRoutes.length > 0 ? (
            <FlatList
              data={popularRoutes}
              renderItem={renderPopularRouteItem}
              keyExtractor={(item, index) => `route-${item.id}-${index}`}
              scrollEnabled={false}
              removeClippedSubviews={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="route" size={48} color={colors.grey} />
              <Text style={styles.emptyStateText}>
                Nenhuma rota popular encontrada na sua região
              </Text>
            </View>
          )}
        </View>

        {/* Available Rides */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Caronas Disponíveis</Text>
            <TouchableOpacity onPress={() => router.push("/rides")}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {loadingRides ? (
            renderLoadingCard()
          ) : availableRides.length > 0 ? (
            <FlatList
              data={availableRides}
              renderItem={renderRideItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="directions-car" size={48} color={colors.grey} />
              <Text style={styles.emptyStateText}>
                Nenhuma carona disponível no momento
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={onRefresh}
              >
                <Text style={styles.refreshButtonText}>Atualizar</Text>
              </TouchableOpacity>
            </View>
          )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userGreeting: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: colors.darkGrey,
  },
  mapButton: {
    backgroundColor: colors.primaryPink,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.black,
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primaryPink,
    fontWeight: "500",
  },
  popularRouteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightPink,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  routeSchedule: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  rideCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.darkGrey,
    fontWeight: "500",
  },
  priceContainer: {
    backgroundColor: colors.lightPink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryPink,
  },
  routeContainer: {
    gap: 12,
  },
  routePoints: {
    gap: 8,
  },
  originPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  destinationPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryBlue,
  },
  destinationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryPink,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.grey,
    marginLeft: 3,
  },
  routePointText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  rideDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rideDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: colors.darkGrey,
  },
  amenitiesContainer: {
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto",
  },
  loadingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 14,
    color: colors.darkGrey,
    marginTop: 8,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default HomeScreen;
