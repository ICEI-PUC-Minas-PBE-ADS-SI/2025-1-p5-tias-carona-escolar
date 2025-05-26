import { colors } from "@/src/constants/colors";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const daysOfWeek = [
  { label: "S", id: 0 }, // Domingo
  { label: "T", id: 1 }, // Segunda
  { label: "Q", id: 2 }, // Terça
  { label: "Q", id: 3 }, // Quarta
  { label: "S", id: 4 }, // Quinta
  { label: "S", id: 5 }, // Sexta
  { label: "D", id: 6 }, // Sábado
];

const RecurringInDays = () => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => {
        const isSelected = selectedDays.includes(day.id);
        return (
          <TouchableOpacity
            key={day.id}
            style={[
              styles.recurringDayOption,
              isSelected && styles.selectedDay,
            ]}
            onPress={() => toggleDay(day.id)}
          >
            <Text style={isSelected ? styles.selectedDayText : styles.dayText}>
              {day.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  recurringOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  recurringDayOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDay: {
    backgroundColor: colors.primaryPink,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.darkGrey,
  },
  selectedDayText: {
    color: colors.white,
  },
});

export default RecurringInDays;
