import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

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

/**
 * VehicleModal Component: Allows users to add or edit vehicle information.
 * @param {object} props - Component props.
 * @param {boolean} props.visible - Controls modal visibility.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onSaveVehicle - Function to call with vehicle data when saved.
 * @param {object | null} props.initialVehicle - Initial vehicle data for editing.
 */
const VehicleModal = ({
  visible,
  onClose,
  onSaveVehicle,
  initialVehicle = null,
}) => {
  const [model, setModel] = useState(initialVehicle?.model || "");
  const [color, setColor] = useState(initialVehicle?.color || "");
  const [licensePlate, setLicensePlate] = useState(
    initialVehicle?.licensePlate || ""
  );

  const handleSave = () => {
    // Validações
    if (!model.trim()) {
      Alert.alert("Erro", "Por favor, informe o modelo do veículo");
      return;
    }

    if (!color.trim()) {
      Alert.alert("Erro", "Por favor, informe a cor do veículo");
      return;
    }

    if (!licensePlate.trim()) {
      Alert.alert("Erro", "Por favor, informe a placa do veículo");
      return;
    }

    // Validação simples da placa (formato brasileiro)
    // Supports old (AAA-1234) and Mercosul (AAA1B23) plates
    const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    const cleanPlate = licensePlate.replace(/[^A-Z0-9]/g, "").toUpperCase();

    if (!plateRegex.test(cleanPlate)) {
      Alert.alert(
        "Erro",
        "Formato de placa inválido. Use o formato ABC1234 ou ABC1D23"
      );
      return;
    }

    const vehicleData = {
      model: model.trim(),
      color: color.trim(),
      licensePlate: cleanPlate,
    };

    onSaveVehicle(vehicleData);
    handleClose(); // Close the modal after saving
  };

  const handleClose = () => {
    // Clear fields only if there's no initial vehicle (new creation)
    if (!initialVehicle) {
      setModel("");
      setColor("");
      setLicensePlate("");
    }
    onClose();
  };

  const formatLicensePlate = (text) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const cleaned = text.replace(/[^A-Z0-9]/g, "").toUpperCase();

    // Limit to 7 characters and format with hyphen for old standard
    let formatted = cleaned.substring(0, 7);
    if (
      formatted.length > 3 &&
      /^[A-Z]{3}[0-9]{4}$/.test(cleaned.substring(0, 7))
    ) {
      // Apply hyphen only for old format
      formatted = formatted.substring(0, 3) + "-" + formatted.substring(3);
    } else if (
      formatted.length > 3 &&
      /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(cleaned.substring(0, 7))
    ) {
      // Mercosul format (AAA1B23) doesn't use hyphen in the middle
      formatted = cleaned; // Just ensure it's cleaned and uppercase
    }

    return formatted;
  };

  const handlePlateChange = (text) => {
    const formattedPlate = formatLicensePlate(text.toUpperCase());
    setLicensePlate(formattedPlate);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {initialVehicle ? "Editar Veículo" : "Adicionar Veículo"}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações do Veículo</Text>
            <Text style={styles.sectionDescription}>
              Informe os dados do seu veículo para compartilhar a carona
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Modelo do Veículo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Honda Civic, Toyota Corolla"
              placeholderTextColor={colors.darkGrey}
              value={model}
              onChangeText={setModel}
              autoCapitalize="words"
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cor *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Branco, Prata, Preto"
              placeholderTextColor={colors.darkGrey}
              value={color}
              onChangeText={setColor}
              autoCapitalize="words"
              maxLength={20}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Placa *</Text>
            <TextInput
              style={styles.input}
              placeholder="ABC-1234 ou ABC1D23" // Updated placeholder
              placeholderTextColor={colors.darkGrey}
              value={licensePlate}
              onChangeText={handlePlateChange}
              autoCapitalize="characters"
              maxLength={8} // 7 chars + 1 hyphen = 8
            />
            <Text style={styles.inputHelper}>
              Formato: ABC-1234 (padrão antigo) ou ABC1D23 (Mercosul)
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Icon name="info" size={20} color={colors.primaryBlue} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>
                Por que precisamos dessas informações?
              </Text>
              <Text style={styles.infoText}>
                Os dados do veículo ajudam os passageiros a identificar você no
                ponto de encontro e garantem mais segurança para todos.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/**
 * VehicleSelector Component: Displays current vehicle info and allows opening the VehicleModal.
 * @param {object} props - Component props.
 * @param {object | null} props.vehicle - Current vehicle data to display.
 * @param {function} props.onVehicleChange - Function to call when vehicle data is updated.
 */
const VehicleSelector = ({ vehicle, onVehicleChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSaveVehicle = (vehicleData) => {
    onVehicleChange(vehicleData);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.vehicleSelectCard]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={[styles.cardHeader]}>
          <View style={styles.iconContainer}>
            <Icon name="directions-car" size={24} color={colors.primaryPink} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.cardTitle}>Seu Veículo</Text>
            <Text style={styles.cardSubtitle}>
              {vehicle ? "Dados do veículo cadastrado" : "Toque para adicionar"}
            </Text>
          </View>
          <Icon
            name="chevron-right"
            size={20}
            color={colors.darkGrey}
            style={styles.chevronIcon}
          />
        </View>

        {vehicle ? (
          <View style={styles.vehicleInfoDisplay}>
            <View style={styles.vehicleInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Modelo</Text>
                <Text style={styles.infoValue}>{vehicle.model}</Text>
              </View>
            </View>
            <View style={styles.vehicleInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Cor</Text>
                <Text style={styles.infoValue}>{vehicle.color}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Placa</Text>
                <Text style={styles.infoValue}>{vehicle.licensePlate}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.addVehicleContainer}>
            <View style={styles.addVehicleContent}>
              <Icon
                name="add-circle-outline"
                size={32}
                color={colors.primaryPink}
                style={styles.addIcon}
              />
              <Text style={styles.addVehicleText}>
                Adicione as informações do seu veículo
              </Text>
              <Text style={styles.addVehicleSubtext}>
                Modelo, cor e placa para facilitar a identificação
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <VehicleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSaveVehicle={handleSaveVehicle}
        initialVehicle={vehicle}
      />
    </>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingTop: Platform.OS === "ios" ? 50 : 12,
  },
  closeButton: {
    padding: 8,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryBlue,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: colors.darkGrey,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.neutralLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  inputHelper: {
    fontSize: 13,
    color: colors.darkGrey,
    marginTop: 6,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: colors.softBlue,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  infoIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryBlue,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.primaryBlue,
    lineHeight: 18,
  },
  // --- Estilos melhorados para o VehicleSelector Card ---
  vehicleSelectCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightPink,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  vehicleInfoDisplay: {
    paddingTop: 8,
  },
  vehicleInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.darkGrey,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  addVehicleContainer: {
    paddingTop: 8,
  },
  addVehicleContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  addIcon: {
    marginBottom: 12,
  },
  addVehicleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryPink,
    textAlign: "center",
    marginBottom: 4,
  },
  addVehicleSubtext: {
    fontSize: 14,
    color: colors.darkGrey,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default VehicleSelector;
