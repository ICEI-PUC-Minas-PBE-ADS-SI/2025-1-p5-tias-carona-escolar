// src/components/ride/RideInfoCard.jsx
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { lightTheme } from "@/src/constants/theme";
import { useRouter } from "expo-router";
import { changeRideStatus } from "@/src/services/ride.service";
import { getStoredUserID } from "@/src/services/user.service";
import {
  rateRide,
  getRatingsByRideId
} from "@/src/services/rating.service";

// Interfaces TypeScript
interface Passenger {
  id: string;
  name: string;
  imgUrl: string;
  rating: number;
  pickup?: {
    address: string;
  };
}

interface RideData {
  id: string;
  status: string;
  driverId: string;
  driverName: string;
  driverImage: string;
  rating: number;
  carModel: string;
  carColor: string;
  licensePlate: string;
  departureTime: string;
  duration: string;
  estimatedDistance: number;
  availableSeats: number;
  paymentMethod: string;
  allowLuggage: boolean;
  pricePerSeat: number;
  totalFare?: number;
  pickup?: {
    address: string;
  };
  dropoff?: {
    address: string;
  };
  passengers?: Passenger[];
  feedback?: string;
}

interface RideInfoCardProps {
  rideData: RideData;
  bottomSheetRef: any;
  snapPoints: string[];
  onSheetChanges: (index: number) => void;
  isOwner?: boolean;
}

const RideInfoCard: React.FC<RideInfoCardProps> = ({
  rideData,
  bottomSheetRef,
  snapPoints,
  onSheetChanges,
  isOwner = false,
}) => {
  const theme = lightTheme;
  const router = useRouter();

  // Estados para avaliação
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [rideRatings, setRideRatings] = useState<any[]>([]);

  // Verificar se o usuário já avaliou a corrida
  useEffect(() => {
    const checkIfUserRated = async () => {
      try {
        const userId = await getStoredUserID();
        setCurrentUserId(userId);

        if (userId && rideData.id) {
          // Verificar se já existe uma avaliação do usuário

          // Buscar avaliações da corrida
          try {
            const ratingsResponse = await getRatingsByRideId(rideData.id);
            setRideRatings(ratingsResponse.data || []);
          } catch (error) {
            console.error("Erro ao buscar avaliações da corrida:", error);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar avaliação:", error);
      }
    };

    checkIfUserRated();
  }, [rideData.id, isOwner, rideData.driverId]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`star-${i}`} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesome
          key="half-star"
          name="star-half-o"
          size={16}
          color="#FFD700"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FontAwesome
          key={`empty-star-${i}`}
          name="star-o"
          size={16}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#4CAF50";
      case "PENDING":
        return "#FF9800";
      case "COMPLETED":
        return "#2196F3";
      case "CANCELLED":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Em Andamento";
      case "PENDING":
        return "Aguardando";
      case "COMPLETED":
        return "Concluída";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDistance = (distance: number) => {
    if (!distance) return "--";
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${distance.toFixed(0)} m`;
  };

  const startRide = async () => {
    await changeRideStatus(rideData.id, "ACTIVE");
    router.push(`/map/${rideData.id}`);
  };

  const finalizarCorrida = async () => {
    console.log("Finalizando corrida...");
    await changeRideStatus(rideData.id, "COMPLETED");
    router.push(`/map/${rideData.id}`);
  };

  const handleRatingPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert("Avaliação", "Por favor, selecione uma avaliação.");
      return;
    }

    if (!currentUserId) {
      Alert.alert("Erro", "Usuário não identificado.");
      return;
    }

    setIsSubmittingRating(true);
    try {
      // Determinar quem está sendo avaliado
      let ratedId: string;
      let ratingType: "DRIVER_TO_PASSENGER" | "PASSENGER_TO_DRIVER";

      if (isOwner) {
        // Motorista avaliando passageiros - avaliar todos os passageiros
        if (rideData.passengers && rideData.passengers.length > 0) {
          for (const passenger of rideData.passengers) {
            await rateRide(
              rideData.id,
              passenger.id,
              rating,
              comment,
              "DRIVER_TO_PASSENGER"
            );
          }
        }
      } else {
        // Passageiro avaliando motorista
        ratedId = rideData.driverId;
        ratingType = "PASSENGER_TO_DRIVER";

        await rateRide(
          rideData.id,
          ratedId,
          rating,
          comment,
          ratingType
        );
      }

      setHasRated(true);
      setShowRatingModal(false);
      setRating(0);
      setComment("");

      // Atualizar lista de avaliações
      try {
        const ratingsResponse = await getRatingsByRideId(rideData.id);
        setRideRatings(ratingsResponse.data || []);
      } catch (error) {
        console.error("Erro ao atualizar avaliações:", error);
      }

      Alert.alert(
        "Avaliação Enviada",
        "Obrigado por avaliar sua corrida!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar sua avaliação. Tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const canRateRide = () => {
    // Só pode avaliar se:
    // 1. A corrida está concluída
    // 2. O usuário não é o motorista
    // 3. O usuário ainda não avaliou
    // 4. O usuário é um passageiro da corrida OU é o motorista avaliando passageiros
    console.log("Status da corrida:", rideData.status);
    console.log("É proprietário:", isOwner);
    console.log("Já avaliou:", hasRated);
    console.log("Usuário atual:", currentUserId);
    console.log("Passageiros:", rideData.passengers);

    // Verificar se é passageiro
    const isPassenger = rideData.passengers?.some((passenger: Passenger) => passenger.id === currentUserId);
    console.log("É passageiro:", isPassenger);

    return (
      rideData.status === "COMPLETED" &&
      !hasRated &&
      currentUserId &&
      (isPassenger || isOwner) // Permitir que motorista também avalie
    );
  };

  // Renderizar avaliações da corrida
  const renderRideRatings = () => {
    if (!rideRatings || rideRatings.length === 0) return null;

    return (
      <View style={styles.ratingsSection}>
        <Text style={styles.sectionTitle}>
          Avaliações da Corrida ({rideRatings.length})
        </Text>
        {rideRatings.slice(0, 3).map((rating: any, index: number) => (
          <View key={rating.id || index} style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <Text style={styles.ratingAuthor}>
                {rating.raterName || "Usuário"}
              </Text>
              <View style={styles.ratingStars}>
                {renderStars(rating.rating)}
              </View>
            </View>
            {rating.comment && (
              <Text style={styles.ratingComment}>{rating.comment}</Text>
            )}
            <Text style={styles.ratingDate}>
              {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        ))}
        {rideRatings.length > 3 && (
          <Text style={styles.moreRatingsText}>
            +{rideRatings.length - 3} mais avaliações
          </Text>
        )}
      </View>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={onSheetChanges}
      handleComponent={(props) => (
        <BottomSheetHandle {...props} style={styles.bottomSheetHandle}>
          <View style={styles.handleBar} />
        </BottomSheetHandle>
      )}
    >
      <BottomSheetScrollView
        style={styles.rideInfoCard}
        showsVerticalScrollIndicator={false}
      >
        {/* Status da Corrida */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(rideData.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(rideData.status)}
            </Text>
          </View>
          <Text style={styles.rideIdText}>ID: {rideData.id.slice(-8)}</Text>
        </View>

        {/* Driver Info */}
        <TouchableOpacity
          onPress={() => router.push(`/chat/${rideData.driverId}`)}
          style={styles.driverInfoContainer}
        >
          <View style={styles.driverInfo}>
            <Image
              source={{ uri: rideData.driverImage }}
              style={styles.driverImage}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{rideData.driverName}</Text>
              <Text style={styles.driverRole}>Motorista</Text>
              <View style={styles.ratingContainer}>
                {renderStars(rideData.rating)}
                <Text style={styles.ratingText}>
                  ({rideData.rating.toFixed(1)})
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.carInfo}>
            <Text style={styles.carModel}>{rideData.carModel}</Text>
            <Text style={styles.carColor}>{rideData.carColor}</Text>
            <Text style={styles.licensePlate}>{rideData.licensePlate}</Text>
          </View>
        </TouchableOpacity>

        {/* Trip Details */}
        <View style={styles.tripDetailsSection}>
          <Text style={styles.sectionTitle}>Detalhes da Viagem</Text>

          <View style={styles.tripDetailsGrid}>
            <View style={styles.tripDetailItem}>
              <FontAwesome name="clock-o" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Horário de Partida</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.departureTime}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome
                name="hourglass-half"
                size={16}
                color={theme.primary}
              />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Duração Estimada</Text>
                <Text style={styles.tripDetailValue}>{rideData.duration}</Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="road" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Distância</Text>
                <Text style={styles.tripDetailValue}>
                  {formatDistance(rideData.estimatedDistance)}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="users" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Assentos Disponíveis</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.availableSeats}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="credit-card" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Pagamento</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.paymentMethod}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <FontAwesome name="suitcase" size={16} color={theme.primary} />
              <View style={styles.tripDetailContent}>
                <Text style={styles.tripDetailLabel}>Bagagem</Text>
                <Text style={styles.tripDetailValue}>
                  {rideData.allowLuggage ? "Permitida" : "Não permitida"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Route Info */}
        <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Rota</Text>

          <View style={styles.routeItem}>
            <View style={styles.routeMarker}>
              <FontAwesome name="circle" size={12} color={theme.primary} />
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Origem</Text>
              <Text style={styles.routeAddress}>
                {rideData.pickup?.address}
              </Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeItem}>
            <View style={styles.routeMarker}>
              <FontAwesome name="map-marker" size={16} color="#F44336" />
            </View>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Destino</Text>
              <Text style={styles.routeAddress}>
                {rideData.dropoff?.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Passengers Section */}
        {rideData.passengers && rideData.passengers.length > 0 && (
          <View style={styles.passengersSection}>
            <Text style={styles.sectionTitle}>
              Passageiros ({rideData.passengers.length})
            </Text>

            {rideData.passengers.map((passenger: Passenger) => (
              <View key={passenger.id} style={styles.passengerCard}>
                <Image
                  source={{ uri: passenger.imgUrl }}
                  style={styles.passengerImage}
                />
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>{passenger.name}</Text>
                  <View style={styles.passengerRating}>
                    <FontAwesome name="star" size={12} color="#FFD700" />
                    <Text style={styles.passengerRatingText}>
                      {passenger.rating.toFixed(1)}
                    </Text>
                  </View>
                  {passenger.pickup && (
                    <Text style={styles.passengerPickup} numberOfLines={1}>
                      📍 {passenger.pickup.address}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Fare Details */}
        <View style={styles.fareSection}>
          <Text style={styles.sectionTitle}>Detalhes do Valor</Text>

          <View style={styles.fareDetails}>
            <View style={styles.fareItem}>
              <Text style={styles.fareLabel}>Preço por Assento</Text>
              <Text style={styles.fareAmount}>
                R$ {rideData.pricePerSeat.toFixed(2)}
              </Text>
            </View>

            <View style={styles.fareItem}>
              <Text style={styles.fareLabel}>Desconto</Text>
              <Text style={styles.fareAmount}>--</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.fareItem}>
              <Text style={styles.totalFareLabel}>Valor Total</Text>
              <Text style={styles.totalFare}>
                R$ {rideData.totalFare?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        {canRateRide() && (
          <View style={styles.ratingSection}>
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => setShowRatingModal(true)}
            >
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.rateButtonText}>
                Avaliar Corrida
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mostrar se já avaliou */}
        {hasRated && (
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Sua Avaliação</Text>
            <View style={styles.userRatingContainer}>
              <View style={styles.userRatingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name="star"
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.userRatingText}>
                Obrigado por avaliar esta corrida!
              </Text>
            </View>
          </View>
        )}

        {/* Ride Ratings Section */}
        {renderRideRatings()}

        {/* Feedback - MOVER PARA DEPOIS DA AVALIAÇÃO */}
        {rideData.feedback && (
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>Avaliação</Text>
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{rideData.feedback}</Text>
            </View>
          </View>
        )}

        {/* Owner Actions - MANTER NO FINAL */}
        {isOwner && (
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>Ações do Proprietário</Text>
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => {
                rideData.status === "ACTIVE" ? finalizarCorrida() : startRide();
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {rideData.status === "ACTIVE"
                  ? "Finalizar Corrida"
                  : "Iniciar Corrida"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom padding for better scrolling */}
        <View style={styles.bottomPadding} />
      </BottomSheetScrollView>

      {/* Rating Modal */}
      {showRatingModal && (
        <View style={styles.ratingModalOverlay}>
          <View style={styles.ratingModal}>
            <View style={styles.ratingModalHeader}>
              <Text style={styles.ratingModalTitle}>Avaliar Corrida</Text>
              <TouchableOpacity
                onPress={() => setShowRatingModal(false)}
                style={styles.closeRatingButton}
              >
                <FontAwesome name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingStarsContainer}>
              <Text style={styles.ratingLabel}>Sua avaliação:</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRatingPress(star)}
                    style={styles.starButton}
                  >
                    <FontAwesome
                      name={star <= rating ? "star" : "star-o"}
                      size={32}
                      color={star <= rating ? "#FFD700" : "#DDD"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modalRatingText}>
                {rating === 0 && "Toque nas estrelas para avaliar"}
                {rating === 1 && "Ruim"}
                {rating === 2 && "Regular"}
                {rating === 3 && "Bom"}
                {rating === 4 && "Muito Bom"}
                {rating === 5 && "Excelente"}
              </Text>
            </View>

            <View style={styles.commentContainer}>
              <Text style={styles.commentLabel}>Comentário (opcional):</Text>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Conte como foi sua experiência..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
              <Text style={styles.commentCounter}>
                {comment.length}/500
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitRatingButton,
                (rating === 0 || isSubmittingRating) && styles.submitRatingButtonDisabled
              ]}
              onPress={handleSubmitRating}
              disabled={rating === 0 || isSubmittingRating}
            >
              {isSubmittingRating ? (
                <Text style={styles.submitRatingButtonText}>Enviando...</Text>
              ) : (
                <Text style={styles.submitRatingButtonText}>Enviar Avaliação</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetHandle: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 3,
    backgroundColor: "#DDDDDD",
    borderRadius: 3,
  },
  rideInfoCard: {
    backgroundColor: "white",
    paddingHorizontal: 20,
  },

  // Status Section
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  rideIdText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },

  // Driver Section
  driverInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  driverImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  driverRole: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  carInfo: {
    alignItems: "flex-end",
  },
  carModel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  carColor: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  licensePlate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontFamily: "monospace",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Section Titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },

  // Trip Details Section
  tripDetailsSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tripDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tripDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
  },
  tripDetailContent: {
    marginLeft: 8,
    flex: 1,
  },
  tripDetailLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  tripDetailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  // Route Section
  routeSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  routeMarker: {
    width: 20,
    alignItems: "center",
    paddingTop: 2,
  },
  routeContent: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 12,
  },
  routeLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#DDD",
    marginLeft: 9,
    marginVertical: 4,
  },

  // Passengers Section
  passengersSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  passengerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 8,
  },
  passengerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: lightTheme.primary,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  passengerRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  passengerRatingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  passengerPickup: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },

  // Fare Section
  fareSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fareDetails: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  fareItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: "#666",
  },
  fareAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  totalFareLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalFare: {
    fontSize: 16,
    fontWeight: "700",
    color: lightTheme.primary,
  },

  // Feedback Section
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  feedbackText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    fontStyle: "italic",
  },

  bottomPadding: {
    height: 20,
  },

  // Rating Section
  ratingSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  rateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  userRatingContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  userRatingStars: {
    flexDirection: "row",
    marginBottom: 8,
  },
  userRatingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  // Ratings Section
  ratingsSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  ratingCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingAuthor: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  ratingStars: {
    flexDirection: "row",
  },
  ratingComment: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  ratingDate: {
    fontSize: 12,
    color: "#999",
  },
  moreRatingsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },

  // Rating Modal
  ratingModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  ratingModal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: "90%",
    maxWidth: 400,
  },
  ratingModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeRatingButton: {
    padding: 4,
  },
  ratingStarsContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
  },
  modalRatingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  commentContainer: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 80,
    textAlignVertical: "top",
  },
  commentCounter: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  submitRatingButton: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitRatingButtonDisabled: {
    backgroundColor: "#CCC",
  },
  submitRatingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RideInfoCard;
