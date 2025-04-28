import { lightTheme } from "@/src/constants/theme";
import { StyleSheet, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const StatusBadge = ({
  status,
}: {
  status: "completed" | "cancelled" | "ongoing" | "scheduled";
}) => {
  const theme = lightTheme;
  const styles = getStyles();
  const getStatusInfo = (): {
    color: string;
    text: string;
    icon: "check-circle" | "x-circle" | "clock" | "calendar";
  } => {
    switch (status) {
      case "completed":
        return {
          color: theme.accentBlue,
          text: "Concluída",
          icon: "check-circle",
        };
      case "cancelled":
        return { color: theme.darkPink, text: "Cancelada", icon: "x-circle" };
      case "ongoing":
        return { color: "#4CAF50", text: "Em andamento", icon: "clock" };
      default:
        return { color: theme.grey, text: "Agendada", icon: "calendar" };
    }
  };
  const statusInfo = getStatusInfo();

  return (
    <View
      style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}
    >
      <Feather name={statusInfo.icon} size={14} color={statusInfo.color} />
      <Text style={[styles.statusText, { color: statusInfo.color }]}>
        {statusInfo.text}
      </Text>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
      marginLeft: 4,
    },
  });

export default StatusBadge;
