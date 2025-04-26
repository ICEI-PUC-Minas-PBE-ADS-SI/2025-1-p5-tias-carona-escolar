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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Mockup de dados para as sugestões
const mockSuggestions = [
  {
    id: "1",
    main: "Avenida Paulista, 1578",
    secondary: "São Paulo, SP",
    type: "location",
    icon: "location-on",
  },
  {
    id: "2",
    main: "Avenida Presidente Vargas",
    secondary: "Rio de Janeiro, RJ",
    type: "location",
    icon: "location-on",
  },
  {
    id: "3",
    main: "Aeroporto de Congonhas",
    secondary: "São Paulo, SP",
    type: "airport",
    icon: "flight",
  },
  {
    id: "4",
    main: "Avenida das Américas",
    secondary: "Rio de Janeiro, RJ",
    type: "location",
    icon: "location-on",
  },
  {
    id: "5",
    main: "Terminal Rodoviário Tietê",
    secondary: "São Paulo, SP",
    type: "bus",
    icon: "directions-bus",
  },
  {
    id: "6",
    main: "MASP - Museu de Arte",
    secondary: "São Paulo, SP",
    type: "poi",
    icon: "location-on",
  },
  {
    id: "7",
    main: "Avenida Brigadeiro Faria Lima",
    secondary: "São Paulo, SP",
    type: "location",
    icon: "location-on",
  },
  {
    id: "8",
    main: "Aeroporto Internacional de Guarulhos",
    secondary: "Guarulhos, SP",
    type: "airport",
    icon: "flight",
  },
  {
    id: "9",
    main: "Terminal Rodoviário de Campinas",
    secondary: "Campinas, SP",
    type: "bus",
    icon: "directions-bus",
  },
];

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

const AutocompleteSearch = ({ onSelectPlace, onBack }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionHeight = useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = Dimensions.get("window");

  // Filtrar sugestões quando o texto de pesquisa muda
  useEffect(() => {
    if (searchText.length > 0) {
      const filteredSuggestions = mockSuggestions.filter(
        (item) =>
          item.main.toLowerCase().includes(searchText.toLowerCase()) ||
          item.secondary.toLowerCase().includes(searchText.toLowerCase())
      );
      setSuggestions(filteredSuggestions);

      // Animar a abertura do painel de sugestões
      Animated.timing(suggestionHeight, {
        toValue: Math.min(filteredSuggestions.length * 62, screenHeight * 0.4),
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setSuggestions([]);

      // Animar o fechamento do painel de sugestões
      Animated.timing(suggestionHeight, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [searchText]);

  // Foco automático no input quando o componente é montado
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    onSelectPlace(suggestion);
    setSearchText("");
    Keyboard.dismiss();
  };

  const handleClearText = () => {
    setSearchText("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Renderiza cada item de sugestão
  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={item.icon}
          size={22}
          color={
            item.type === "location"
              ? colors.primaryBlue
              : item.type === "airport"
              ? colors.primaryPink
              : colors.darkGrey
          }
        />
      </View>
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionMainText} numberOfLines={1}>
          {item.main}
        </Text>
        <Text style={styles.suggestionSecondaryText} numberOfLines={1}>
          {item.secondary}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Renderiza itens recentes quando não há texto na busca
  const renderRecentSearches = () => (
    <View style={styles.recentSearchesContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.recentTitle}>Buscas recentes</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentItemsContainer}>
        <TouchableOpacity style={styles.recentItem}>
          <Icon name="access-time" size={16} color={colors.darkGrey} />
          <Text style={styles.recentItemText}>MASP - São Paulo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recentItem}>
          <Icon name="access-time" size={16} color={colors.darkGrey} />
          <Text style={styles.recentItemText}>Terminal Rodoviário Tietê</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recentItem}>
          <Icon name="access-time" size={16} color={colors.darkGrey} />
          <Text style={styles.recentItemText}>Aeroporto de Congonhas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho com barra de pesquisa */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <Icon name="search" size={22} color={colors.darkGrey} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Para onde você vai?"
            placeholderTextColor={colors.darkGrey}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearText}
            >
              <Icon name="cancel" size={18} color={colors.darkGrey} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de sugestões */}
      <Animated.View
        style={[
          styles.suggestionsContainer,
          {
            height: suggestionHeight,
            borderBottomWidth: suggestions.length > 0 ? 1 : 0,
          },
        ]}
      >
        {suggestions.length > 0 ? (
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsList}
          />
        ) : null}
      </Animated.View>

      {/* Mostrar buscas recentes quando não há texto */}
      {searchText.length === 0 && renderRecentSearches()}

      {/* Sugestões para origem/destino quando relevante */}
      {searchText.length === 0 && (
        <View style={styles.commonPlacesContainer}>
          <Text style={styles.sectionTitle}>Locais comuns</Text>

          <TouchableOpacity style={styles.commonPlaceItem}>
            <View
              style={[styles.iconCircle, { backgroundColor: colors.softBlue }]}
            >
              <Icon name="home" size={18} color={colors.primaryBlue} />
            </View>
            <View style={styles.commonPlaceTextContainer}>
              <Text style={styles.commonPlaceText}>Casa</Text>
              <Text style={styles.commonPlaceDescription}>
                Definir meu endereço de casa
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.commonPlaceItem}>
            <View
              style={[styles.iconCircle, { backgroundColor: colors.lightPink }]}
            >
              <Icon name="work" size={18} color={colors.primaryPink} />
            </View>
            <View style={styles.commonPlaceTextContainer}>
              <Text style={styles.commonPlaceText}>Trabalho</Text>
              <Text style={styles.commonPlaceDescription}>
                Definir meu endereço de trabalho
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
  recentItemsContainer: {
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  recentItemText: {
    fontSize: 14,
    color: colors.darkGrey,
    marginLeft: 12,
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
