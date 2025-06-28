import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { getStoredToken } from "@/src/services/token.service";
import { removeTokens } from "@/src/services/token.service";
import { getStoredUserID, getUser } from "@/src/services/user.service";

interface Guardian {
  id: string;
  guardianId: string;
  minorId: string;
  relationship: string;
  canRequestRides: boolean;
  canAcceptRides: boolean;
  createdAt: string;
  guardian: {
    id: string;
    name: string;
    username: string;
    phone: string | null;
  };
}

interface Minor {
  id: string;
  name: string;
  username: string;
  phone: string | null;
  birthDate: string | null;
  relationship?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  imgUrl: string | null;
  username: string;
  createdAt: string;
  isActive: boolean;
  cpf: string | null;
  rg: string | null;
  birthDate: string | null;
  phone: string | null;
  address: string | null;
  cep: string | null;
  city: string | null;
  state: string | null;
  userType: "ADULT" | "MINOR";
  guardians: Guardian[];
  minors: Minor[];
}

const UserDetailsScreen = () => {
  const router = useRouter();
  const { id: userId } = useGlobalSearchParams<{ id: string }>();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllDependents, setShowAllDependents] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState<UserData | null>(null);

  // Estados do Modal
  const [showAddDependentModal, setShowAddDependentModal] = useState(false);
  const [addingDependent, setAddingDependent] = useState(false);
  const [dependentForm, setDependentForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    birthDate: "",
    relationship: "CHILD", // CHILD, SIBLING, OTHER
    address: "",
    city: "",
    state: "",
    cep: "",
  });

  // Função para buscar dados do usuário da API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Substitua pela sua URL da API
      const userID = await getStoredUserID();
      console.log("User ID:", userID);
      if (!userID) {
        return;
      }
      const response = await getUser(userID);
      console.log(response);
      setUserData(response);
      setEditableUserData(response);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleCall = () => {
    if (userData?.phone) {
      Linking.openURL(`tel:${userData.phone}`);
    } else {
      Alert.alert("Aviso", "Telefone não disponível");
    }
  };

  const handleEmail = () => {
    if (userData?.email) {
      Linking.openURL(`mailto:${userData.email}`);
    }
  };

  const handleSaveChanges = async () => {
    if (!editableUserData || !userId) return;

    setLoading(true);
    try {
      const token = await getStoredToken();
      if (!token) {
        throw new Error("Usuário não autenticado.");
      }

      const apiUrl = `https://auth.${process.env.EXPO_PUBLIC_BASE_DOMAIN}/users/${userId}`;


      const requestBody = {
        name: editableUserData.name,
        email: editableUserData.email,
        username: editableUserData.username,
        imgUrl: editableUserData.imgUrl,
        phone: editableUserData.phone,
        address: editableUserData.address,
        city: editableUserData.city,
        state: editableUserData.state,
        cep: editableUserData.cep,
        birthDate: editableUserData.birthDate,
      };

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Enviamos o objeto completo
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar o perfil.');
      }

      const updatedUser = await response.json();

      delete updatedUser.password;

      setUserData(updatedUser);
      setEditableUserData(updatedUser);
      setIsEditing(false);

      Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');

    } catch (error: any) {
      console.error("Erro ao salvar o perfil:", error);
      Alert.alert('Erro', error.message || 'Não foi possível salvar as alterações.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDependent = () => {
    setShowAddDependentModal(true);
  };

  const resetDependentForm = () => {
    setDependentForm({
      name: "",
      username: "",
      email: "",
      phone: "",
      birthDate: "",
      relationship: "CHILD",
      address: "",
      city: "",
      state: "",
      cep: "",
    });
  };

  const handleCloseModal = () => {
    setShowAddDependentModal(false);
    resetDependentForm();
  };

  const handleSaveDependent = async () => {
    // Validações básicas
    if (!dependentForm.name.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return;
    }
    if (!dependentForm.username.trim()) {
      Alert.alert("Erro", "Nome de usuário é obrigatório");
      return;
    }
    if (!dependentForm.email.trim()) {
      Alert.alert("Erro", "Email é obrigatório");
      return;
    }

    try {
      setAddingDependent(true);

      const response = await fetch("/api/dependents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dependentForm,
          guardianId: userId,
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Dependente adicionado com sucesso");
        handleCloseModal();
        fetchUserData(); // Recarrega os dados
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar dependente");
      }
    } catch (error: any) {
      console.error("Erro ao adicionar dependente:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível adicionar o dependente"
      );
    } finally {
      setAddingDependent(false);
    }
  };

  const getRelationshipOptions = () => [
    { value: "CHILD", label: "Filho(a)" },
    { value: "SIBLING", label: "Irmão/Irmã" },
    { value: "NEPHEW", label: "Sobrinho(a)" },
    { value: "GRANDCHILD", label: "Neto(a)" },
    { value: "OTHER", label: "Outro" },
  ];

  const handleEditDependent = (dependentId: string) => {
    //router.push(`/edit-dependent/${dependentId}`);
  };

  const handleRemoveDependent = (
    dependentId: string,
    dependentName: string
  ) => {
    Alert.alert(
      "Remover Dependente",
      `Tem certeza que deseja remover ${dependentName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeDependent(dependentId),
        },
      ]
    );
  };

  const removeDependent = async (dependentId: string) => {
    try {
      const response = await fetch(`/api/dependents/${dependentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUserData(); // Recarrega os dados
        Alert.alert("Sucesso", "Dependente removido com sucesso");
      } else {
        throw new Error("Erro ao remover dependente");
      }
    } catch (error) {
      console.error("Erro ao remover dependente:", error);
      Alert.alert("Erro", "Não foi possível remover o dependente");
    }
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          removeTokens();
          router.replace("/login");
        },
      },
    ]);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getRelationshipLabel = (relationship: string) => {
    const relationships = {
      PARENT: "Pai/Mãe",
      GUARDIAN: "Responsável",
      RELATIVE: "Parente",
      OTHER: "Outro",
    };
    return relationships[relationship] || relationship;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A80F0" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#666" />
          <Text style={styles.errorText}>Usuário não encontrado</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fullAddress = [userData.address, userData.city, userData.state]
    .filter(Boolean)
    .join(", ");

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
              source={{
                uri: userData.imgUrl || "https://via.placeholder.com/150",
              }}
              style={styles.userImage}
            />
            {userData.isActive && (
              <View style={styles.verifiedBadge}>
                <Feather name="check" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.username}>@{userData.username}</Text>
          <Text style={styles.memberSince}>
            Membro desde {formatDate(userData.createdAt)}
          </Text>
          <View style={styles.userTypeContainer}>
            <Text style={styles.userType}>
              {userData.userType === "ADULT" ? "Adulto" : "Menor"}
            </Text>
          </View>
        </View>

        {/* Seção de Ações Rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              !userData.phone && styles.actionButtonDisabled,
            ]}
            onPress={handleCall}
            disabled={!userData.phone}
          >
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
            disabled={userId === userId}
            style={[styles.actionButton, styles.actionButtonDisabled]}
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

          {isEditing ? (
            // Botões SALVAR e CANCELAR (no modo de edição)
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity onPress={() => {
                setIsEditing(false);
                setEditableUserData(userData); // Descarta alterações
              }}>
                <Text style={{ color: '#D9534F', fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSaveChanges()}>
                <Text style={{ color: '#4A80F0', fontWeight: '600' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Botão EDITAR (no modo de visualização)
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={{ color: '#4A80F0', fontWeight: '600' }}>Editar</Text>
            </TouchableOpacity>
          )}


          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="user" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome completo</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput} // Reutilizando o estilo do modal
                  value={editableUserData?.name || ''}
                  onChangeText={(text) =>
                    setEditableUserData(prev => prev ? { ...prev, name: text } : null)
                  }
                />
              ) : (
                <Text style={styles.infoValue}>{userData.name}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="mail" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="phone" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Telefone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={editableUserData?.phone || ''}
                  placeholder="Não informado"
                  keyboardType="phone-pad"
                  onChangeText={(text) => setEditableUserData(prev => prev ? { ...prev, phone: text } : null)}
                />
              ) : (
                <Text style={styles.infoValue}>{userData.phone || "Não informado"}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Feather name="map-pin" size={16} color="#666" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Endereço</Text>
              {isEditing ? (
                <View>
                  <TextInput
                    style={[styles.textInput, { marginBottom: 8 }]}
                    placeholder="Endereço, número"
                    value={editableUserData?.address || ''}
                    onChangeText={(text) => setEditableUserData(prev => prev ? { ...prev, address: text } : null)}
                  />
                  <TextInput
                    style={[styles.textInput, { marginBottom: 8 }]}
                    placeholder="CEP"
                    keyboardType="numeric"
                    value={editableUserData?.cep || ''}
                    onChangeText={(text) => setEditableUserData(prev => prev ? { ...prev, cep: text } : null)}
                  />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      style={[styles.textInput, { flex: 2 }]}
                      placeholder="Cidade"
                      value={editableUserData?.city || ''}
                      onChangeText={(text) => setEditableUserData(prev => prev ? { ...prev, city: text } : null)}
                    />
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="Estado"
                      maxLength={2}
                      autoCapitalize="characters"
                      value={editableUserData?.state || ''}
                      onChangeText={(text) => setEditableUserData(prev => prev ? { ...prev, state: text } : null)}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.infoValue}>{fullAddress || "Não informado"}</Text>
                  {userData.cep && (
                    <Text style={styles.infoSubValue}>CEP: {userData.cep}</Text>
                  )}
                </>
              )}
            </View>
          </View>

          {(userData.cpf || userData.rg) && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Feather name="file-text" size={16} color="#666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Documentos</Text>
                  {userData.cpf && (
                    <Text style={styles.infoValue}>CPF: {userData.cpf}</Text>
                  )}
                  {userData.rg && (
                    <Text style={styles.infoValue}>RG: {userData.rg}</Text>
                  )}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Seção de Dependentes/Responsáveis */}
        {userData.userType === "ADULT" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dependentes</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddDependent}
              >
                <Feather name="plus" size={16} color="#4A80F0" />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {!userData.minors || userData.minors.length === 0 ? (
              <Text style={styles.noDependentsText}>
                Nenhum dependente cadastrado
              </Text>
            ) : (
              <>
                {userData.minors
                  ?.slice(0, showAllDependents ? userData.minors.length : 2)
                  ?.map((minor) => (
                    <View key={minor.id} style={styles.dependentCard}>
                      <View style={styles.dependentHeader}>
                        <View style={styles.dependentIconContainer}>
                          <Feather name="user" size={16} color="#fff" />
                        </View>
                        <View style={styles.dependentInfo}>
                          <Text style={styles.dependentName}>{minor.name}</Text>
                          <Text style={styles.dependentUsername}>
                            @{minor.username}
                          </Text>
                          {minor.birthDate && (
                            <Text style={styles.dependentAge}>
                              Nascimento: {formatDate(minor.birthDate)}
                            </Text>
                          )}
                        </View>
                        <View style={styles.dependentActions}>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditDependent(minor.id)}
                          >
                            <Feather name="edit-2" size={16} color="#4A80F0" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() =>
                              handleRemoveDependent(minor.id, minor.name)
                            }
                          >
                            <Feather name="trash-2" size={16} color="#D9534F" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}

                {userData.minors?.length > 2 && (
                  <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => setShowAllDependents(!showAllDependents)}
                  >
                    <Text style={styles.showMoreText}>
                      {showAllDependents
                        ? "Mostrar menos"
                        : `Ver todos (${userData.minors?.length})`}
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
        )}

        {/* Seção de Responsáveis (para menores) */}
        {userData.userType === "MINOR" && userData.guardians?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsáveis</Text>
            {userData.guardians.map((guardianData) => (
              <View key={guardianData.id} style={styles.dependentCard}>
                <View style={styles.dependentHeader}>
                  <View style={styles.dependentIconContainer}>
                    <Feather name="shield" size={16} color="#fff" />
                  </View>
                  <View style={styles.dependentInfo}>
                    <Text style={styles.dependentName}>
                      {guardianData.guardian.name}
                    </Text>
                    <Text style={styles.dependentUsername}>
                      @{guardianData.guardian.username}
                    </Text>
                    <Text style={styles.dependentRelation}>
                      {getRelationshipLabel(guardianData.relationship)}
                    </Text>
                    {guardianData.guardian.phone && (
                      <Text style={styles.dependentPhone}>
                        {guardianData.guardian.phone}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.permissionsContainer}>
                  <View style={styles.permissionItem}>
                    <Feather
                      name={
                        guardianData.canRequestRides
                          ? "check-circle"
                          : "x-circle"
                      }
                      size={14}
                      color={
                        guardianData.canRequestRides ? "#4CAF50" : "#D9534F"
                      }
                    />
                    <Text style={styles.permissionText}>
                      Pode solicitar caronas
                    </Text>
                  </View>
                  <View style={styles.permissionItem}>
                    <Feather
                      name={
                        guardianData.canAcceptRides
                          ? "check-circle"
                          : "x-circle"
                      }
                      size={14}
                      color={
                        guardianData.canAcceptRides ? "#4CAF50" : "#D9534F"
                      }
                    />
                    <Text style={styles.permissionText}>
                      Pode aceitar caronas
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

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

      {/* Modal para Adicionar Dependente */}
      <Modal
        visible={showAddDependentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseModal}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Adicionar Dependente</Text>
              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  addingDependent && styles.modalSaveButtonDisabled,
                ]}
                onPress={handleSaveDependent}
                disabled={addingDependent}
              >
                {addingDependent ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalForm}
              showsVerticalScrollIndicator={false}
            >
              {/* Informações Básicas */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Informações Básicas</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome Completo *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dependentForm.name}
                    onChangeText={(text) =>
                      setDependentForm((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Digite o nome completo"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome de Usuário *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dependentForm.username}
                    onChangeText={(text) =>
                      setDependentForm((prev) => ({
                        ...prev,
                        username: text.toLowerCase(),
                      }))
                    }
                    placeholder="Digite o nome de usuário"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dependentForm.email}
                    onChangeText={(text) =>
                      setDependentForm((prev) => ({ ...prev, email: text }))
                    }
                    placeholder="Digite o email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Telefone</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dependentForm.phone}
                    onChangeText={(text) =>
                      setDependentForm((prev) => ({ ...prev, phone: text }))
                    }
                    placeholder="(11) 99999-9999"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Data de Nascimento</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dependentForm.birthDate}
                    onChangeText={(text) =>
                      setDependentForm((prev) => ({ ...prev, birthDate: text }))
                    }
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Relacionamento */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Relacionamento</Text>
                <View style={styles.relationshipContainer}>
                  {getRelationshipOptions().map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.relationshipOption,
                        dependentForm.relationship === option.value &&
                        styles.relationshipOptionSelected,
                      ]}
                      onPress={() =>
                        setDependentForm((prev) => ({
                          ...prev,
                          relationship: option.value,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.relationshipOptionText,
                          dependentForm.relationship === option.value &&
                          styles.relationshipOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Endereço */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Endereço (Opcional)</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CEP</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dependentForm.cep}
                    onChangeText={(text) =>
                      setDependentForm((prev) => ({ ...prev, cep: text }))
                    }
                    placeholder="00000-000"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Endereço</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dependentForm.address}
                    onChangeText={(text) =>
                      setDependentForm((prev) => ({ ...prev, address: text }))
                    }
                    placeholder="Rua, número, complemento"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 2 }]}>
                    <Text style={styles.inputLabel}>Cidade</Text>
                    <TextInput
                      style={styles.textInput}
                      value={dependentForm.city}
                      onChangeText={(text) =>
                        setDependentForm((prev) => ({ ...prev, city: text }))
                      }
                      placeholder="Cidade"
                      autoCapitalize="words"
                    />
                  </View>
                  <View
                    style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}
                  >
                    <Text style={styles.inputLabel}>Estado</Text>
                    <TextInput
                      style={styles.textInput}
                      value={dependentForm.state}
                      onChangeText={(text) =>
                        setDependentForm((prev) => ({
                          ...prev,
                          state: text.toUpperCase(),
                        }))
                      }
                      placeholder="SP"
                      autoCapitalize="characters"
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formFooter}>
                <Text style={styles.formFooterText}>* Campos obrigatórios</Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4A80F0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },
  userTypeContainer: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userType: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "600",
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
  actionButtonDisabled: {
    opacity: 0.5,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: "#4A80F0",
    marginLeft: 4,
    fontWeight: "600",
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
    marginBottom: 2,
  },
  infoSubValue: {
    fontSize: 13,
    color: "#666",
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
    alignItems: "flex-start",
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
  dependentInfo: {
    flex: 1,
  },
  dependentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  dependentUsername: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  dependentRelation: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  dependentAge: {
    fontSize: 12,
    color: "#888",
  },
  dependentPhone: {
    fontSize: 12,
    color: "#4A80F0",
  },
  dependentActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#F0F5FF",
    borderRadius: 8,
  },
  removeButton: {
    padding: 8,
    backgroundColor: "#FFEAEA",
    borderRadius: 8,
  },
  permissionsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
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
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  modalSaveButton: {
    backgroundColor: "#4A80F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  modalSaveButtonDisabled: {
    opacity: 0.6,
  },
  modalSaveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalForm: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  relationshipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  relationshipOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
  },
  relationshipOptionSelected: {
    backgroundColor: "#4A80F0",
    borderColor: "#4A80F0",
  },
  relationshipOptionText: {
    fontSize: 14,
    color: "#666",
  },
  relationshipOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  formFooter: {
    alignItems: "center",
    paddingVertical: 16,
  },
  formFooterText: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
});

export default UserDetailsScreen;
