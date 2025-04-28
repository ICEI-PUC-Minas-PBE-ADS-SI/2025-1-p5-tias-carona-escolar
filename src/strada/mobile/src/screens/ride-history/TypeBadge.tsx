import { colors } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

const TypeBadge = ({ type }: { type: "passenger" | "driver" }) => {
  const isPassenger = type === "passenger";

  return (
    <View
      style={[
        styles.typeBadge,
        {
          backgroundColor: isPassenger
            ? `${colors.primaryPink}20`
            : `${colors.primaryBlue}20`,
        },
      ]}
    >
      <Ionicons
        name={isPassenger ? "car-outline" : "people-outline"}
        size={14}
        color={isPassenger ? colors.primaryPink : colors.primaryBlue}
      />
      <Text
        style={[
          styles.typeText,
          {
            color: isPassenger ? colors.primaryPink : colors.primaryBlue,
          },
        ]}
      >
        {isPassenger ? "Passageiro" : "Motorista"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
});

export default TypeBadge;
