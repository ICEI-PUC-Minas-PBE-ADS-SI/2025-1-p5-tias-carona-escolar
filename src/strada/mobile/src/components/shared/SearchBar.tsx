import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  Keyboard,
  Dimensions,
  Alert,
} from "react-native";
import * as AsyncStorage from "expo-secure-store";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getStoredUser } from "@/src/services/user.service";

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

// Configuração da API do Google Places
const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const STORAGE_KEY = "recent_searches";

const AutocompleteSearch = ({
  onSelectPlace,
  onBack,
  searchType = "destination",
}) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [homeLocation, setHomeLocation] = useState<{ address: string; name: string } | null>(null);

  const inputRef = useRef(null);
  const suggestionHeight = useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = Dimensions.get("window");
  const searchTimeoutRef = useRef(null);

  // Carregar buscas recentes e endereço de casa
  useEffect(() => {
    const loadInitialData = async () => {
      // Carregar buscas recentes
      try {
        const storedSearches = await AsyncStorage.getItemAsync(STORAGE_KEY);
        if (storedSearches) {
          const parsedSearches = JSON.parse(storedSearches);
          setRecentSearches(parsedSearches.slice(0, 5));
        }
      } catch (error) {
        console.error("Erro ao carregar buscas recentes:", error);
      }

      // Carregar endereço de casa
      try {
        const userString = await getStoredUser();
        if (userString) {
          const userData = JSON.parse(userString);
          if (userData && userData.address) {
            setHomeLocation({ address: userData.address, name: "Casa" });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário para endereço de casa:", error);
      }
    };
    loadInitialData();
  }, []);

  // Foco automático no input
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  const saveRecentSearch = async (searchData) => {
    try {
      const storedSearches = await AsyncStorage.getItemAsync(STORAGE_KEY);
      let searches = storedSearches ? JSON.parse(storedSearches) : [];
      searches = searches.filter((search) => search.place_id !== searchData.place_id);
      searches.unshift({
        id: searchData.place_id,
        main: searchData.main,
        secondary: searchData.secondary,
        description: searchData.description,
        place_id: searchData.place_id,
        types: searchData.types,
        icon: searchData.icon || 'home',
        timestamp: new Date().toISOString(),
      });
      searches = searches.slice(0, 20);
      await AsyncStorage.setItemAsync(STORAGE_KEY, JSON.stringify(searches));
      setRecentSearches(searches.slice(0, 5));
    } catch (error) {
      console.error("Erro ao salvar busca recente:", error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.deleteItemAsync(STORAGE_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error("Erro ao limpar buscas recentes:", error);
    }
  };
  
  const getIconForPlace = (types) => {
    if (types.includes("airport")) return "flight";
    if (types.includes("bus_station") || types.includes("transit_station")) return "directions-bus";
    if (types.includes("subway_station")) return "directions-subway";
    if (types.includes("hospital")) return "local-hospital";
    if (types.includes("school") || types.includes("university")) return "school";
    if (types.includes("shopping_mall")) return "shopping-cart";
    if (types.includes("restaurant") || types.includes("meal_takeaway")) return "restaurant";
    if (types.includes("gas_station")) return "local-gas-station";
    if (types.includes("bank")) return "account-balance";
    return "location-on";
  };

  const searchGooglePlaces = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&language=pt-BR&components=country:br`);
      const data = await response.json();
      if (data.status === "OK") {
        const formattedSuggestions = data.predictions.map((prediction) => ({
          id: prediction.place_id,
          main: prediction.structured_formatting.main_text,
          secondary: prediction.structured_formatting.secondary_text || "",
          description: prediction.description,
          place_id: prediction.place_id,
          types: prediction.types,
          icon: getIconForPlace(prediction.types),
        }));
        setSuggestions(formattedSuggestions);
        Animated.timing(suggestionHeight, {
          toValue: Math.min(formattedSuggestions.length * 62, screenHeight * 0.4),
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar os endereços. Tente novamente.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce para pesquisa
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (searchText.length > 0) {
      searchTimeoutRef.current = setTimeout(() => searchGooglePlaces(searchText), 300);
    } else {
      setSuggestions([]);
      Animated.timing(suggestionHeight, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    }
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchText]);

  const getPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,name&key=${GOOGLE_PLACES_API_KEY}`);
      const data = await response.json();
      if (data.status === "OK") {
        const place = data.result;
        return {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          address: place.formatted_address,
          name: place.name,
        };
      }
      throw new Error("Erro ao obter detalhes do lugar");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter os detalhes do endereço.");
      return null;
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    setIsLoading(true);
    const placeDetails = await getPlaceDetails(suggestion.place_id);
    if (placeDetails) {
      const selectedPlace = { ...suggestion, ...placeDetails, searchType };
      await saveRecentSearch(suggestion);
      onSelectPlace(selectedPlace);
      setSearchText("");
      Keyboard.dismiss();
    }
    setIsLoading(false);
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}&language=pt-BR`);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          address: result.formatted_address,
          name: "Casa",
        };
      }
      throw new Error(data.error_message || "Endereço não pôde ser encontrado no mapa.");
    } catch (error) {
      Alert.alert("Erro de Localização", "Não foi possível encontrar as coordenadas para o seu endereço de casa.");
      return null;
    }
  };

  const handleSelectHome = async () => {
    if (!homeLocation || !homeLocation.address) {
      Alert.alert("Endereço de Casa", "Seu endereço de casa não foi encontrado. Por favor, verifique seu cadastro.");
      return;
    }
    setIsLoading(true);
    Keyboard.dismiss();
    const geocodedHome = await geocodeAddress(homeLocation.address);
    if (geocodedHome) {
      const placeData = {
        ...geocodedHome,
        id: `home-${geocodedHome.latitude}-${geocodedHome.longitude}`,
        place_id: `home-${geocodedHome.latitude}-${geocodedHome.longitude}`,
        main: "Casa",
        secondary: geocodedHome.address,
        icon: "home",
      };
      await saveRecentSearch(placeData);
      onSelectPlace(placeData);
    }
    setIsLoading(false);
  };

  const handleClearText = () => {
    setSearchText("");
    if (inputRef.current) inputRef.current.focus();
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)} activeOpacity={0.7}>
      <View style={styles.iconContainer}><Icon name={item.icon} size={22} color={colors.primaryBlue} /></View>
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionMainText} numberOfLines={1}>{item.main}</Text>
        <Text style={styles.suggestionSecondaryText} numberOfLines={1}>{item.secondary}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecentItem = ({ item }) => (
    <TouchableOpacity style={styles.recentItem} onPress={() => handleSelectSuggestion(item)} activeOpacity={0.7}>
      <View style={styles.iconContainer}><Icon name={item.icon || 'history'} size={18} color={colors.primaryBlue} /></View>
      <View style={styles.recentItemTextContainer}>
        <Text style={styles.recentItemMainText} numberOfLines={1}>{item.main}</Text>
        {item.secondary && <Text style={styles.recentItemSecondaryText} numberOfLines={1}>{item.secondary}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearches = () => {
    if (recentSearches.length === 0) return null;
    return (
      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Buscas recentes</Text>
          <TouchableOpacity onPress={clearRecentSearches}><Text style={styles.clearText}>Limpar</Text></TouchableOpacity>
        </View>
        <FlatList data={recentSearches} renderItem={renderRecentItem} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} scrollEnabled={false} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={22} color={colors.darkGrey} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={searchType === "start" ? "De onde você está saindo?" : "Para onde você vai?"}
            placeholderTextColor={colors.darkGrey}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearText}>
              <Icon name="cancel" size={18} color={colors.darkGrey} />
            </TouchableOpacity>
          )}
          {isLoading && <View style={styles.loadingIndicator}><Text style={styles.loadingText}>...</Text></View>}
        </View>
      </View>

      <Animated.View style={[styles.suggestionsContainer, { height: suggestionHeight, borderBottomWidth: suggestions.length > 0 ? 1 : 0 }]}>
        {suggestions.length > 0 && <FlatList data={suggestions} renderItem={renderSuggestionItem} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.suggestionsList} />}
      </Animated.View>

      {searchText.length === 0 && renderRecentSearches()}

      {searchText.length === 0 && (
        <View style={styles.commonPlacesContainer}>
          <Text style={styles.sectionTitle}>Locais comuns</Text>
          <TouchableOpacity style={styles.commonPlaceItem} onPress={handleSelectHome}>
            <View style={[styles.iconCircle, { backgroundColor: colors.softBlue }]}>
              <Icon name="home" size={18} color={colors.primaryBlue} />
            </View>
            <View style={styles.commonPlaceTextContainer}>
              <Text style={styles.commonPlaceText}>Casa</Text>
              <Text style={styles.commonPlaceDescription} numberOfLines={1}>
                {homeLocation ? homeLocation.address : "Endereço não definido no perfil"}
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.darkGrey} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.useMapButton}>
            <Icon name="map" size={18} color={colors.primaryBlue} />
            <Text style={styles.useMapText}>Selecionar no mapa</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    color: colors.black,
  },
  clearButton: {
    padding: 6,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  loadingText: {
    color: colors.darkGrey,
    fontSize: 16,
  },
  suggestionsContainer: {
    backgroundColor: colors.white,
    borderBottomColor: colors.lightGrey,
    overflow: "hidden",
  },
  suggestionsList: {
    paddingVertical: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 13,
    color: colors.darkGrey,
  },
  recentSearchesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  clearText: {
    fontSize: 14,
    color: colors.primaryBlue,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
  },
  recentItemTextContainer: {
    flex: 1,
  },
  recentItemMainText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 2,
  },
  recentItemSecondaryText: {
    fontSize: 13,
    color: colors.darkGrey,
  },
  commonPlacesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  commonPlaceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  commonPlaceTextContainer: {
    flex: 1,
  },
  commonPlaceText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 2,
  },
  commonPlaceDescription: {
    fontSize: 13,
    color: colors.darkGrey,
  },
  useMapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.softBlue,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  useMapText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primaryBlue,
    marginLeft: 8,
  },
});

export default AutocompleteSearch;