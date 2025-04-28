import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  ListRenderItemInfo,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { RatingBar } from "@aashu-dubey/react-native-rating-bar";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RideListType } from "./model/ride_list_data";
import { lightTheme, Theme } from "@/src/constants/theme";
import Avatar from "@/src/components/Avatar";

interface Props {
  data: ListRenderItemInfo<RideListType>;
  onPress?: (item: RideListType) => void;
  onFavoritePress?: (item: RideListType) => void;
  theme?: Theme;
}

const RideListItem: React.FC<Props> = ({
  data,
  onPress,
  onFavoritePress,
  theme = lightTheme,
}) => {
  const { item, index } = data;
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const translateY = useRef<Animated.Value>(new Animated.Value(50)).current;
  const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * (400 / 3),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * (400 / 3),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  const handlePress = () => onPress?.(item);
  const handleFavoritePress = () => onFavoritePress?.(item);
  const favoriteIcon = item.isFavorite ? "favorite" : "favorite-border";

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View
        style={[styles.container, { opacity, transform: [{ translateY }] }]}
      >
        {/* Imagem de capa com informações sobrepostas */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.coverImage}
            source={{ uri: item.imagePath }}
            resizeMode="cover"
          />

          {/* Botão de favorito */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Icon name={favoriteIcon} size={24} color={theme.primary} />
          </TouchableOpacity>

          {/* Tag de preço */}
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>R${item.pricePerSeat}</Text>
            <Text style={styles.priceSubtext}>/assento</Text>
          </View>
        </View>

        {/* Informações da carona */}
        <View style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Avatar imgUrl={item.driverImage} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.driverName}>{item.driverName}</Text>
            <View style={styles.carBadge}>
              <Icon name="directions-car" size={16} color={theme.accent} />
              <Text style={styles.carText}>{item.carModel}</Text>
            </View>
          </View>

          {/* Informações sobre o trajeto */}
          <View style={styles.routeContainer}>
            <View style={styles.routeHeader}>
              <View style={styles.locationBadge}>
                <Icon name="location-pin" size={16} color="#fff" />
                <Text style={styles.locationText}>
                  {item.departureLocation}
                </Text>
              </View>
              <Text style={styles.destinationText}>
                {Number(item.dist.toPrecision(2))} km • {item.destination}
              </Text>
            </View>

            <View style={styles.rideDetailsRow}>
              <View style={styles.detailBadge}>
                <Icon name="access-time" size={16} color={theme.accent} />
                <Text style={styles.detailText}>
                  {item.departureTime} • {item.duration}
                </Text>
              </View>
              <View style={styles.detailBadge}>
                <Icon name="event-seat" size={16} color={theme.accent} />
                <Text style={styles.detailText}>
                  {item.availableSeats || item.seatsAvailable} assentos
                </Text>
              </View>
            </View>
          </View>

          {/* Avaliações */}
          <View style={styles.ratingContainer}>
            <RatingBar
              initialRating={item.rating}
              direction="horizontal"
              allowHalfRating
              itemCount={5}
              itemSize={16}
              glowColor={theme.primary}
              ratingElement={{
                full: <Icon name="star-rate" color={theme.primary} size={16} />,
                half: <Icon name="star-half" color={theme.primary} size={16} />,
                empty: (
                  <Icon name="star-border" color={theme.primary} size={16} />
                ),
              }}
            />
            <Text style={styles.reviewText}>{item.reviews} avaliações</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginVertical: 12,
      marginHorizontal: 16,
      borderRadius: 20,
      backgroundColor: theme.background,
      overflow: "hidden",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      position: "relative",
    },
    imageContainer: {
      position: "relative",
      height: 160,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: "hidden",
    },
    coverImage: {
      width: "100%",
      height: "100%",
    },
    favoriteButton: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      justifyContent: "center",
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    priceTag: {
      position: "absolute",
      top: 12,
      left: 12,
      backgroundColor: theme.primary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    priceText: {
      color: theme.background,
      fontSize: 16,
      fontFamily: "WorkSans-Bold",
    },
    priceSubtext: {
      color: theme.background,
      fontSize: 10,
      fontFamily: "WorkSans-Regular",
      marginLeft: 2,
      opacity: 0.9,
    },
    avatarContainer: {
      position: "absolute",
      left: 12,
      top: -20,
    },
    infoContainer: {
      padding: 16,
      paddingTop: 36,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    driverName: {
      flex: 1,
      color: theme.text,
      fontSize: 20,
      fontFamily: "WorkSans-SemiBold",
      lineHeight: 24,
    },
    carBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.backgroundAccent,
      borderRadius: 12,
    },
    carText: {
      color: theme.text,
      fontFamily: "WorkSans-Medium",
      fontSize: 13,
      marginLeft: 6,
    },
    routeContainer: {
      marginTop: 6,
      backgroundColor: "rgba(0, 0, 0, 0.03)",
      borderRadius: 16,
      padding: 12,
    },
    routeHeader: {
      marginBottom: 10,
    },
    locationBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.accent,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginBottom: 6,
    },
    locationText: {
      color: "#fff",
      fontFamily: "WorkSans-Medium",
      fontSize: 14,
      marginLeft: 6,
    },
    destinationText: {
      color: theme.text,
      fontFamily: "WorkSans-Regular",
      fontSize: 14,
      opacity: 0.8,
      marginLeft: 6,
    },
    rideDetailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
      gap: 10,
    },
    detailBadge: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundAccent,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    detailText: {
      marginLeft: 6,
      color: theme.text,
      fontFamily: "WorkSans-Medium",
      fontSize: 13,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 14,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      borderRadius: 10,
      alignSelf: "flex-start",
    },
    reviewText: {
      color: theme.text,
      fontFamily: "WorkSans-Regular",
      fontSize: 12,
      marginLeft: 8,
      opacity: 0.8,
    },
  });

export default RideListItem;
