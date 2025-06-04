import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { removeTokens } from "@/src/services/token.service";

const UserDetailsScreen = () => {
  const router = useRouter();
  const { id: userId } = useGlobalSearchParams<{ id: string }>();
  const userData = {
    id: "12345",
    name: "Amanda Silva",
    email: "amanda.silva@email.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123 - São Paulo, SP",
    birthDate: "15/04/1988",
    profileImage: "https://via.placeholder.com/150",
    rating: 4.8,
    totalRides: 142,
    verifiedDocuments: true,
    verifiedEmail: true,
    verifiedPhone: true,
    memberSince: "Maio 2021",
    preferredPayments: ["Cartão de Crédito", "Pix"],
    dependents: [
      {
        id: "1",
        name: "Lucas Silva",
        age: 10,
        relationship: "Filho",
        schoolAddress: "Colégio Exemplo - Rua da Educação, 500",
      },
      {
        id: "2",
        name: "Sophia Silva",
        age: 8,
        relationship: "Filha",
        schoolAddress: "Escola Modelo - Av. Principal, 200",
      },
    ],
  };

  const [showAllDependents, setShowAllDependents] = useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${userData.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${userData.email}`);
  };

  const handleLogout = () => {
    removeTokens();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com Foto e Informações Principais */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.userImageContainer}>
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.userImage}
            />
            {userData.verifiedDocuments && (
              <View style={styles.verifiedBadge}>
                <Feather name="check" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{userData.rating}</Text>
            <Text style={styles.totalRidesText}>
              {userData.totalRides} caronas
            </Text>
          </View>
          <Text style={styles.memberSince}>
            Membro desde {userData.memberSince}
          </Text>
        </View>

        {/* Seção de Ações Rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <View style={styles.actionIconContainer}>
              <Feather name="phone" size={20} color="#fff" />
            </View>
            <Text style={styles.actionText}>Ligar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <View style={styles.actionIconContainer}>
              <Feather name="mail" size={20} color="#fff" />
            </View>
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              router.push(`/chat/${userId}`);
            }}
          >
            <View style={styles.actionIconContainer}>
              <Feather name="message-circle" size={20} color="#fff" />
            </View>
            <Text style={styles.actionText}>Mensagem</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de Informações Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="user" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome completo</Text>
              <Text style={styles.infoValue}>{userData.name}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="mail" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <View style={styles.verifiedRow}>
                <Text style={styles.infoValue}>{userData.email}</Text>
                {userData.verifiedEmail && (
                  <Feather name="check-circle" size={14} color="#4CAF50" />
                )}
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="phone" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <View style={styles.verifiedRow}>
                <Text style={styles.infoValue}>{userData.phone}</Text>
                {userData.verifiedPhone && (
                  <Feather name="check-circle" size={14} color="#4CAF50" />
                )}
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="map-pin" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{userData.address}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="calendar" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Data de nascimento</Text>
              <Text style={styles.infoValue}>{userData.birthDate}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="credit-card" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Métodos de pagamento</Text>
              <Text style={styles.infoValue}>
                {userData.preferredPayments.join(", ")}
              </Text>
            </View>
          </View>
        </View>

        {/* Seção de Dependentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dependentes</Text>
          {userData.dependents.length === 0 ? (
            <Text style={styles.noDependentsText}>
              Nenhum dependente cadastrado
            </Text>
          ) : (
            <>
              {userData.dependents
                .slice(0, showAllDependents ? userData.dependents.length : 1)
                .map((dependent) => (
                  <View key={dependent.id} style={styles.dependentCard}>
                    <View style={styles.dependentHeader}>
                      <View style={styles.dependentIconContainer}>
                        <Feather name="user" size={16} color="#fff" />
                      </View>
                      <View>
                        <Text style={styles.dependentName}>
                          {dependent.name}
                        </Text>
                        <Text style={styles.dependentRelation}>
                          {dependent.relationship}, {dependent.age} anos
                        </Text>
                      </View>
                    </View>
                    <View style={styles.schoolInfo}>
                      <Feather
                        name="book"
                        size={14}
                        color="#666"
                        style={styles.schoolIcon}
                      />
                      <Text style={styles.schoolAddress}>
                        {dependent.schoolAddress}
                      </Text>
                    </View>
                  </View>
                ))}

              {userData.dependents.length > 1 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllDependents(!showAllDependents)}
                >
                  <Text style={styles.showMoreText}>
                    {showAllDependents
                      ? "Mostrar menos"
                      : `Ver todos (${userData.dependents.length})`}
                  </Text>
                  <Feather
                    name={showAllDependents ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#4A80F0"
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Footer com opções adicionais */}
        <View style={styles.footerActions}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              router.push("/ride-history/ride-history");
            }}
          >
            <Feather name="file-text" size={16} color="#666" />
            <Text style={styles.footerButtonText}>
              Ver histórico de caronas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Feather name="alert-circle" size={16} color="#666" />
            <Text style={styles.footerButtonText}>Reportar usuário</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: "#FFEAEA" }]}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={16} color="#D9534F" />
            <Text style={[styles.footerButtonText, { color: "#D9534F" }]}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  userImageContainer: {
    marginBottom: 16,
    position: "relative",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E1E8F0",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  totalRidesText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#666",
  },
  memberSince: {
    fontSize: 13,
    color: "#888",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A80F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    color: "#555",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F5FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  noDependentsText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  dependentCard: {
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  dependentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dependentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A80F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dependentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  dependentRelation: {
    fontSize: 13,
    color: "#666",
  },
  schoolInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 44,
  },
  schoolIcon: {
    marginRight: 6,
  },
  schoolAddress: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  showMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 4,
  },
  showMoreText: {
    fontSize: 14,
    color: "#4A80F0",
    marginRight: 4,
  },
  footerActions: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  footerButtonText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 12,
  },
});

export default UserDetailsScreen;
