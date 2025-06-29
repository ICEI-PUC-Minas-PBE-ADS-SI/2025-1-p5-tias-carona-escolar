import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getStoredUser, getStoredUserID, updateUser } from "@/src/services/user.service";
import { IUserRequest } from "@/src/interfaces/user-request.interface";

// Cores
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
  success: '#28a745', 
  danger: '#dc3545',   
};

const VehicleModal = ({
  visible,
  onClose,
  onSave,
  initialVehicle,
  initialCnh,
  isSaving,
}) => {
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [cnh, setCnh] = useState("");
  const [cnhStatus, setCnhStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle");

  // Efeito para sincronizar o estado interno quando o modal abre
  useEffect(() => {
    if (visible) {
      setModel(initialVehicle?.model || "");
      setColor(initialVehicle?.color || "");
      setLicensePlate(initialVehicle?.licensePlate || "");
      setCnh(initialCnh || "");
      setCnhStatus(initialCnh ? 'valid' : 'idle');
    }
  }, [visible, initialVehicle, initialCnh]);
  
  // Efeito para lidar com a simulação de validação da CNH
  useEffect(() => {
    if (cnhStatus !== 'validating') return;
    const timer = setTimeout(() => {
      if (cnh.endsWith("0")) {
        setCnhStatus('invalid');
        Alert.alert("Validação Falhou", "Este número de CNH não pôde ser validado.");
      } else {
        setCnhStatus('valid');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [cnhStatus]);

  const handleValidateCnh = () => {
    Keyboard.dismiss();
    if (cnh.length !== 11) {
      Alert.alert("CNH Inválida", "A CNH deve conter exatamente 11 números.");
      return;
    }
    setCnhStatus('validating');
  };
  
  const handleSave = () => {
    if (!model.trim() || !color.trim() || !licensePlate.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os dados do veículo.");
      return;
    }
    if (cnhStatus !== 'valid') {
      Alert.alert("Validação Pendente", "Por favor, valide sua CNH para continuar.");
      return;
    }
    const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    if (!plateRegex.test(licensePlate)) {
      Alert.alert("Erro", "Formato de placa inválido.");
      return;
    }
    
    onSave({
      model: model.trim(),
      color: color.trim(),
      licensePlate,
      cnh,
    });
  };

  const handlePlateChange = (text) => {
    setLicensePlate(text.replace(/[^A-Z0-9]/g, "").toUpperCase().substring(0, 7));
  };

  const renderValidationButtonContent = () => {
    switch (cnhStatus) {
      case 'validating': return <ActivityIndicator size="small" color={colors.primaryBlue} />;
      case 'valid': return <><Icon name="check-circle" size={20} color={colors.success} /><Text style={[styles.validationButtonText, { color: colors.success }]}> Válida</Text></>;
      case 'invalid': return <><Icon name="error" size={20} color={colors.danger} /><Text style={[styles.validationButtonText, { color: colors.danger }]}> Inválida</Text></>;
      default: return <Text style={styles.validationButtonText}>Validar</Text>;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}><Icon name="close" size={24} color={colors.black} /></TouchableOpacity>
          <Text style={styles.headerTitle}>{initialVehicle ? "Editar Dados" : "Adicionar Dados"}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color={colors.primaryBlue} /> : <Text style={styles.saveButtonText}>Salvar</Text>}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações para Carona</Text>
            <Text style={styles.sectionDescription}>Informe seus dados de motorista e do veículo para compartilhar a carona.</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Número da CNH *</Text>
            <View style={styles.cnhInputWrapper}>
              <TextInput
                style={[styles.cnhInput, cnhStatus === 'valid' && {backgroundColor: '#e9f7ef'}]}
                placeholder="01234567890"
                placeholderTextColor={colors.darkGrey}
                value={cnh}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/[^0-9]/g, '');
                  setCnh(cleanedText);
                  if (cnhStatus !== 'idle') {
                    setCnhStatus('idle');
                  }
                }}
                keyboardType="numeric"
                maxLength={11}
                editable={cnhStatus !== 'valid'}
              />
              <TouchableOpacity
                style={[
                  styles.validationButton,
                  (cnh.length !== 11 || cnhStatus === 'valid') && styles.disabledButton,
                  styles[`${cnhStatus}Button`]
                ]}
                onPress={handleValidateCnh}
                disabled={cnh.length !== 11 || cnhStatus === 'validating' || cnhStatus === 'valid'}
              >
                {renderValidationButtonContent()}
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHelper}>Digite os 11 números da sua CNH.</Text>
          </View>
          
          <View style={styles.inputContainer}><Text style={styles.inputLabel}>Modelo do Veículo *</Text><TextInput style={styles.input} placeholder="Ex: Honda Civic" placeholderTextColor={colors.darkGrey} value={model} onChangeText={setModel} autoCapitalize="words" maxLength={50} /></View>
          <View style={styles.inputContainer}><Text style={styles.inputLabel}>Cor *</Text><TextInput style={styles.input} placeholder="Ex: Prata" placeholderTextColor={colors.darkGrey} value={color} onChangeText={setColor} autoCapitalize="words" maxLength={20} /></View>
          <View style={styles.inputContainer}><Text style={styles.inputLabel}>Placa *</Text><TextInput style={styles.input} placeholder="ABC1D23" placeholderTextColor={colors.darkGrey} value={licensePlate} onChangeText={handlePlateChange} autoCapitalize="characters" maxLength={7} /><Text style={styles.inputHelper}>Formato: ABC1D23 (Mercosul) ou ABC1234</Text></View>
          <View style={styles.infoCard}><View style={styles.infoIconContainer}><Icon name="info" size={20} color={colors.primaryBlue} /></View><View style={styles.infoTextContainer}><Text style={styles.infoTitle}>Por que precisamos dessas informações?</Text><Text style={styles.infoText}>Os dados do veículo e da CNH garantem mais segurança para todos os usuários da plataforma.</Text></View></View>
        
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};


const VehicleSelector = ({ vehicle, onVehicleChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserCnh, setCurrentUserCnh] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega os dados do usuário sempre que o modal for ser aberto
  const handleOpenModal = async () => {
    try {
      const userString = await getStoredUser();
      if (userString) {
        const userData = JSON.parse(userString);
        setCurrentUserCnh(userData.cnh || null);
      }
    } catch (e) {
      console.error("Falha ao carregar dados do usuário", e);
      setCurrentUserCnh(null);
    } finally {
      setModalVisible(true);
    }
  };

  const handleSaveData = async (data: { model: string; color: string; licensePlate: string; cnh: string }) => {
    setIsSaving(true);
    try {
      const userId = await getStoredUserID();
      if (!userId) throw new Error("ID do usuário não encontrado.");

      const userString = await getStoredUser();
      const existingUserData = userString ? JSON.parse(userString) : {};

      const payload: IUserRequest = {
        ...existingUserData,
        vehicle_model: data.model,
        vehicle_color: data.color,
        license_plate: data.licensePlate,
        cnh: data.cnh,
      };

      await updateUser(userId, payload);
      
      onVehicleChange({ model: data.model, color: data.color, licensePlate: data.licensePlate });
      setCurrentUserCnh(data.cnh);
      
      Alert.alert("Sucesso!", "Seus dados foram salvos.");
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      Alert.alert("Erro", "Não foi possível salvar seus dados. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={[styles.vehicleSelectCard]} onPress={handleOpenModal} activeOpacity={0.7}>
        <View style={[styles.cardHeader]}>
          <View style={styles.iconContainer}><Icon name="directions-car" size={24} color={colors.primaryPink} /></View>
          <View style={styles.headerTextContainer}><Text style={styles.cardTitle}>Seu Veículo</Text><Text style={styles.cardSubtitle}>{vehicle ? "Clique para editar seus dados" : "Adicione seus dados para continuar"}</Text></View>
          <Icon name="chevron-right" size={20} color={colors.darkGrey} style={styles.chevronIcon} />
        </View>
        {vehicle ? (
          <View style={styles.vehicleInfoDisplay}>
            <View style={styles.vehicleInfoRow}><View style={styles.infoItem}><Text style={styles.infoLabel}>Modelo</Text><Text style={styles.infoValue}>{vehicle.model}</Text></View></View>
            <View style={styles.vehicleInfoRow}><View style={styles.infoItem}><Text style={styles.infoLabel}>Cor</Text><Text style={styles.infoValue}>{vehicle.color}</Text></View><View style={styles.infoItem}><Text style={styles.infoLabel}>Placa</Text><Text style={styles.infoValue}>{vehicle.licensePlate}</Text></View></View>
          </View>
        ) : (
          <View style={styles.addVehicleContainer}><View style={styles.addVehicleContent}><Icon name="add-circle-outline" size={32} color={colors.primaryPink} style={styles.addIcon} /><Text style={styles.addVehicleText}>Adicionar dados do Veículo e CNH</Text><Text style={styles.addVehicleSubtext}>Essas informações são necessárias para oferecer caronas</Text></View></View>
        )}
      </TouchableOpacity>
      <VehicleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveData}
        initialVehicle={vehicle}
        initialCnh={currentUserCnh}
        isSaving={isSaving}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.lightGrey, paddingTop: Platform.OS === "ios" ? 50 : 12 },
  closeButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: colors.black },
  saveButton: { padding: 8 },
  saveButtonText: { fontSize: 16, fontWeight: "600", color: colors.primaryBlue },
  content: { flex: 1, paddingHorizontal: 16 },
  section: { paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.black },
  sectionDescription: { fontSize: 15, color: colors.darkGrey, lineHeight: 22, marginTop: 4 },
  inputContainer: { marginBottom: 24 },
  inputLabel: { fontSize: 16, fontWeight: "600", color: colors.black, marginBottom: 8 },
  input: { backgroundColor: colors.neutralLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.black, borderWidth: 1, borderColor: colors.lightGrey },
  inputHelper: { fontSize: 13, color: colors.darkGrey, marginTop: 6 },
  infoCard: { flexDirection: "row", backgroundColor: colors.softBlue, borderRadius: 12, padding: 16, marginTop: 20, marginBottom: 30 },
  infoIconContainer: { marginRight: 12, marginTop: 2 },
  infoTextContainer: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: "600", color: colors.primaryBlue, marginBottom: 6 },
  infoText: { fontSize: 13, color: colors.primaryBlue, lineHeight: 18 },
  vehicleSelectCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginHorizontal: 16, marginVertical: 12, borderWidth: 1, borderColor: colors.lightGrey, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.lightPink, justifyContent: "center", alignItems: "center", marginRight: 16 },
  headerTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.black, marginBottom: 2 },
  cardSubtitle: { fontSize: 14, color: colors.darkGrey },
  chevronIcon: { marginLeft: 8 },
  vehicleInfoDisplay: { paddingTop: 8 },
  vehicleInfoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  infoItem: { flex: 1, marginRight: 16 },
  infoLabel: { fontSize: 12, fontWeight: "600", color: colors.darkGrey, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: "600", color: colors.black },
  addVehicleContainer: { paddingTop: 8 },
  addVehicleContent: { alignItems: "center", paddingVertical: 20 },
  addIcon: { marginBottom: 12 },
  addVehicleText: { fontSize: 16, fontWeight: "600", color: colors.primaryPink, textAlign: "center", marginBottom: 4 },
  addVehicleSubtext: { fontSize: 14, color: colors.darkGrey, textAlign: "center", lineHeight: 20 },
  cnhInputWrapper: { flexDirection: 'row', alignItems: 'center' },
  cnhInput: { flex: 1, backgroundColor: colors.neutralLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.black, borderWidth: 1, borderColor: colors.lightGrey },
  validationButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 10, paddingHorizontal: 16, height: 50, borderRadius: 12, backgroundColor: colors.softBlue },
  validationButtonText: { fontSize: 15, fontWeight: '600', color: colors.primaryBlue },
  idleButton: {},
  validatingButton: { backgroundColor: colors.lightGrey },
  validButton: { backgroundColor: '#e9f7ef', borderColor: colors.success, borderWidth: 1 },
  invalidButton: { backgroundColor: '#fdecea', borderColor: colors.danger, borderWidth: 1 },
  disabledButton: { backgroundColor: colors.lightGrey, opacity: 0.7, },
});

export default VehicleSelector;