import { colors } from "@/src/constants/colors";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const DateTimeSection = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRecurringRide, setIsRecurringRide] = useState(false);
  const [dateType, setDateType] = useState("single"); // 'single' ou 'range'

  const formatDate = (date) => {
    if (!date) return "Selecionar data";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "00:00";
    return time.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDateTypeChange = (type) => {
    setDateType(type);
    if (type === "single") {
      setEndDate(null);
      setIsRecurringRide(false);
    }
  };

  const validateDateTime = () => {
    if (!startDate) {
      Alert.alert("Atenção", "Por favor, selecione uma data");
      return false;
    }
    if (dateType === "range" && !endDate) {
      Alert.alert("Atenção", "Por favor, selecione a data final");
      return false;
    }
    return true;
  };

  const getDateRangeText = () => {
    if (!startDate) return "Selecionar período";
    if (dateType === "single") return formatDate(startDate);
    if (!endDate) return `${formatDate(startDate)} - Selecionar final`;
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <View style={styles.section}>
      {/* Header da Seção */}
      <View style={styles.sectionHeader}>
        <Icon name="schedule" size={20} color={colors.primaryPink} />
        <Text style={styles.sectionTitle}>Data e Hora</Text>
        {(startDate || time) && (
          <Icon name="check-circle" size={16} color={colors.primaryPink} />
        )}
      </View>

      {/* Seletor de Tipo de Data */}
      <View style={styles.dateTypeContainer}>
        <TouchableOpacity
          style={[
            styles.dateTypeButton,
            dateType === "single" && styles.dateTypeButtonActive,
          ]}
          onPress={() => handleDateTypeChange("single")}
        >
          <Icon
            name="today"
            size={16}
            color={dateType === "single" ? colors.primaryBlue : colors.darkGrey}
          />
          <Text
            style={[
              styles.dateTypeText,
              dateType === "single" && styles.dateTypeTextActive,
            ]}
          >
            Data única
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dateTypeButton,
            dateType === "range" && styles.dateTypeButtonActive,
          ]}
          onPress={() => handleDateTypeChange("range")}
        >
          <Icon
            name="date-range"
            size={16}
            color={dateType === "range" ? colors.primaryBlue : colors.darkGrey}
          />
          <Text
            style={[
              styles.dateTypeText,
              dateType === "range" && styles.dateTypeTextActive,
            ]}
          >
            Período
          </Text>
        </TouchableOpacity>
      </View>

      {/* Container Principal de Data e Hora */}
      <View style={styles.dateTimeContainer}>
        {/* Seleção de Data */}
        <TouchableOpacity
          style={[
            styles.dateTimeInput,
            showDatePicker && styles.dateTimeInputActive,
          ]}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.inputIconContainer}>
            <Icon name="event" size={22} color={colors.primaryPink} />
          </View>

          <View style={styles.inputContentContainer}>
            <Text style={styles.inputLabel}>
              {dateType === "single" ? "Data" : "Período"}
            </Text>
            <Text
              style={[
                styles.dateTimeText,
                !startDate && styles.placeholderText,
              ]}
            >
              {getDateRangeText()}
            </Text>
          </View>

          <Icon
            name={showDatePicker ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={22}
            color={colors.darkGrey}
          />
        </TouchableOpacity>

        {/* Seleção de Hora */}
        <TouchableOpacity
          style={[
            styles.dateTimeInput,
            showTimePicker && styles.dateTimeInputActive,
          ]}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.inputIconContainer}>
            <Icon name="access-time" size={22} color={colors.primaryPink} />
          </View>

          <View style={styles.inputContentContainer}>
            <Text style={styles.inputLabel}>Horário</Text>
            <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
          </View>

          <Icon
            name={showTimePicker ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={22}
            color={colors.darkGrey}
          />
        </TouchableOpacity>
      </View>

      {/* Pickers (mostrados condicionalmente) */}
      {showDatePicker && (
        <View style={styles.pickerContainer}>
          <CustomCalendar
            minDate={new Date()}
            startDate={startDate}
            endDate={endDate}
            dateType={dateType}
            startEndDateChange={(start, end) => {
              setStartDate(start);
              if (dateType === "range") {
                setEndDate(end);
              }
            }}
            onClose={() => setShowDatePicker(false)}
          />
        </View>
      )}

      {showTimePicker && (
        <View style={styles.pickerContainer}>
          <CustomTimePicker
            time={time}
            onTimeChange={setTime}
            onClose={() => setShowTimePicker(false)}
          />
        </View>
      )}

      {/* Switch para Carona Recorrente - apenas para períodos */}
      {dateType === "range" && startDate && endDate && (
        <View style={styles.switchContainer}>
          <View style={styles.switchContent}>
            <Icon name="repeat" size={20} color={colors.primaryPink} />
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Carona recorrente</Text>
              <Text style={styles.switchDescription}>
                Repetir nos dias selecionados
              </Text>
            </View>
          </View>
          <Switch
            value={isRecurringRide}
            onValueChange={setIsRecurringRide}
            trackColor={{ false: colors.lightGrey, true: colors.lightPink }}
            thumbColor={isRecurringRide ? colors.primaryPink : colors.white}
            ios_backgroundColor={colors.lightGrey}
          />
        </View>
      )}

      {/* Componente de Dias Recorrentes */}
      {isRecurringRide && (
        <View style={styles.recurringContainer}>
          <RecurringDays />
        </View>
      )}

      {/* Resumo da Seleção */}
      {startDate && (
        <View style={styles.summaryContainer}>
          <Icon name="info-outline" size={16} color={colors.primaryBlue} />
          <Text style={styles.summaryText}>
            {dateType === "single"
              ? `Carona marcada para ${formatDate(startDate)} às ${formatTime(
                  time
                )}`
              : `Período: ${formatDate(startDate)} até ${formatDate(
                  endDate
                )} às ${formatTime(time)}`}
            {isRecurringRide && " (recorrente)"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    flex: 1,
  },

  dateTypeContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutralLight,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },

  dateTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },

  dateTypeButtonActive: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  dateTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.darkGrey,
  },

  dateTypeTextActive: {
    color: colors.primaryBlue,
    fontWeight: "600",
  },

  dateTimeContainer: {
    gap: 12,
  },

  dateTimeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  dateTimeInputActive: {
    borderColor: colors.primaryPink,
    backgroundColor: colors.softBlue,
  },

  inputIconContainer: {
    width: 24,
    alignItems: "center",
  },

  inputContentContainer: {
    flex: 1,
  },

  inputLabel: {
    fontSize: 12,
    color: colors.darkGrey,
    marginBottom: 2,
  },

  dateTimeText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
  },

  placeholderText: {
    color: colors.grey,
  },

  pickerContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  switchContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },

  switchTextContainer: {
    flex: 1,
  },

  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
  },

  switchDescription: {
    fontSize: 12,
    color: colors.darkGrey,
    marginTop: 2,
  },

  recurringContainer: {
    marginTop: 12,
  },

  summaryContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.softBlue,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },

  summaryText: {
    fontSize: 14,
    color: colors.primaryBlue,
    flex: 1,
    lineHeight: 20,
  },
});

export default DateTimeSection;
