import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import RangeSliderView from "./RangeSliderView";
import SliderView from "./SliderView";
import MySwitch from "./Switch";
import MyPressable from "@/src/components/MyPressable";
import Config from "@/src/Config";
import { lightTheme } from "@/src/constants/theme";

interface Props {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  theme?: typeof lightTheme;
}

// Opções de filtro populares para corridas compartilhadas
const popularFilterList = [
  { titleTxt: "Ar condicionado", isSelected: false },
  { titleTxt: "Wi-Fi", isSelected: false },
  { titleTxt: "Porta-malas grande", isSelected: false },
  { titleTxt: "Aceita bagagem", isSelected: false },
  { titleTxt: "Pet friendly", isSelected: false },
  { titleTxt: "Paradas flexíveis", isSelected: false },
];

// Opções de filtro para horários de partida
const departureTimeList = [
  { titleTxt: "Qualquer horário", isSelected: false },
  { titleTxt: "Manhã (6h-12h)", isSelected: false },
  { titleTxt: "Tarde (12h-18h)", isSelected: false },
  { titleTxt: "Noite (18h-24h)", isSelected: false },
  { titleTxt: "Madrugada (0h-6h)", isSelected: false },
];

// Opções para classificação dos motoristas
const driverRatingsList = [
  { titleTxt: "Todos", isSelected: false },
  { titleTxt: "4+ estrelas", isSelected: false },
  { titleTxt: "4.5+ estrelas", isSelected: false },
  { titleTxt: "4.8+ estrelas", isSelected: false },
];

// Opções para tipo de veículos
const vehicleTypeList = [
  { titleTxt: "Todos", isSelected: false },
  { titleTxt: "Econômico", isSelected: false },
  { titleTxt: "Hatch", isSelected: false },
  { titleTxt: "Sedan", isSelected: false },
  { titleTxt: "SUV", isSelected: false },
  { titleTxt: "Minivan", isSelected: false },
];

const FilterModal: React.FC<Props> = ({
  showFilter,
  setShowFilter,
  theme = lightTheme,
}) => {
  const [popularFilters, setPopularFilters] = useState(popularFilterList);
  const [vehicleTypes, setVehicleTypes] = useState(vehicleTypeList);
  const [departureTimes, setDepartureTimes] = useState(departureTimeList);
  const [driverRatings, setDriverRatings] = useState(driverRatingsList);

  const styles = getStyles(theme);

  const getPList = () => {
    const noList: React.JSX.Element[] = [];
    let count = 0;
    const columnCount = 2;

    for (let i = 0; i < popularFilters.length / columnCount; i++) {
      const listUI: React.JSX.Element[] = [];
      for (let j = 0; j < columnCount; j++) {
        const data = popularFilters[count];
        listUI.push(
          <View
            key={`popular_${j}`}
            style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
          >
            <MyPressable
              style={styles.checkBoxBtn}
              touchOpacity={0.6}
              onPress={() => {
                data.isSelected = !data.isSelected;
                setPopularFilters([...popularFilters]);
              }}
            >
              <Icon
                name={data.isSelected ? "check-box" : "check-box-outline-blank"}
                size={25}
                color={data.isSelected ? theme.primary : theme.lightGrey}
              />
              <Text style={styles.checkTitle}>{data.titleTxt}</Text>
            </MyPressable>
          </View>
        );

        if (count < popularFilters.length - 1) {
          count += 1;
        } else {
          break;
        }
      }
      noList.push(
        <View key={noList.length} style={{ flex: 1, flexDirection: "row" }}>
          {listUI}
        </View>
      );
    }

    return noList;
  };

  const checkVehicleType = (index: number) => {
    if (index === 0) {
      const isAllSelected = vehicleTypes[0].isSelected;
      vehicleTypes.forEach((d) => (d.isSelected = !isAllSelected));
    } else {
      vehicleTypes[index].isSelected = !vehicleTypes[index].isSelected;

      let count = 0;
      for (let i = 0; i < vehicleTypes.length; i++) {
        if (i !== 0) {
          const data = vehicleTypes[i];
          if (data.isSelected) {
            count += 1;
          }
        }
      }

      vehicleTypes[0].isSelected = count === vehicleTypes.length - 1;
    }

    setVehicleTypes([...vehicleTypes]);
  };

  const checkDepartureTime = (index: number) => {
    // Tratamento para seleção única (radio button behavior)
    departureTimes.forEach((item, i) => {
      item.isSelected = i === index;
    });

    setDepartureTimes([...departureTimes]);
  };

  const checkDriverRating = (index: number) => {
    // Tratamento para seleção única (radio button behavior)
    driverRatings.forEach((item, i) => {
      item.isSelected = i === index;
    });

    setDriverRatings([...driverRatings]);
  };

  const getVehicleTypeUI = () => {
    const noList: React.JSX.Element[] = [];
    for (let i = 0; i < vehicleTypes.length; i++) {
      const data = vehicleTypes[i];
      noList.push(
        <View key={i} style={{ borderRadius: 8, overflow: "hidden" }}>
          <MyPressable
            style={{ flexDirection: "row", padding: 12 }}
            touchOpacity={0.6}
            onPress={() => checkVehicleType(i)}
          >
            <Text style={styles.switchText}>{data.titleTxt}</Text>
            <MySwitch
              onColor={theme.primary}
              offColor={theme.lightGrey}
              thumbColor={theme.white}
              value={data.isSelected}
              onValueChange={() => checkVehicleType(i)}
            />
          </MyPressable>
        </View>
      );
      if (i === 0) {
        noList.push(<View key="divider" style={styles.divider} />);
      }
    }
    return noList;
  };

  const getDepartureTimeUI = () => {
    return departureTimes.map((data, i) => (
      <View key={i} style={{ borderRadius: 8, overflow: "hidden" }}>
        <MyPressable
          style={styles.radioItem}
          touchOpacity={0.6}
          onPress={() => checkDepartureTime(i)}
        >
          <Icon
            name={
              data.isSelected
                ? "radio-button-checked"
                : "radio-button-unchecked"
            }
            size={24}
            color={data.isSelected ? theme.primary : theme.lightGrey}
          />
          <Text style={styles.radioText}>{data.titleTxt}</Text>
        </MyPressable>
      </View>
    ));
  };

  const getDriverRatingUI = () => {
    return driverRatings.map((data, i) => (
      <View key={i} style={{ borderRadius: 8, overflow: "hidden" }}>
        <MyPressable
          style={styles.radioItem}
          touchOpacity={0.6}
          onPress={() => checkDriverRating(i)}
        >
          <Icon
            name={
              data.isSelected
                ? "radio-button-checked"
                : "radio-button-unchecked"
            }
            size={24}
            color={data.isSelected ? theme.primary : theme.lightGrey}
          />
          <Text style={styles.radioText}>{data.titleTxt}</Text>
        </MyPressable>
      </View>
    ));
  };

  return (
    <Modal
      visible={showFilter}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilter(false)}
    >
      <StatusBar backgroundColor={theme.background} barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={styles.header}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <MyPressable
              style={{ padding: 8 }}
              android_ripple={{
                color: theme.lightGrey,
                radius: 20,
                borderless: true,
              }}
              touchOpacity={0.6}
              onPress={() => setShowFilter(false)}
            >
              <Icon name="close" size={25} color={theme.text} />
            </MyPressable>
          </View>
          <Text style={styles.headerText}>Filtros</Text>
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.headerShadow} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Preço (por assento)</Text>
          <RangeSliderView />
          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { paddingVertical: 12 }]}>
            Filtros populares
          </Text>
          <View style={{ paddingHorizontal: 16 }}>{getPList()}</View>
          <View style={styles.divider} />

          <Text
            style={[styles.sectionTitle, { paddingTop: 16, paddingBottom: 24 }]}
          >
            Distância máxima até o ponto de partida
          </Text>
          <SliderView />
          <View style={styles.divider} />

          <Text
            style={[styles.sectionTitle, { paddingTop: 16, paddingBottom: 8 }]}
          >
            Horário de partida
          </Text>
          <View style={{ paddingHorizontal: 16 }}>{getDepartureTimeUI()}</View>
          <View style={styles.divider} />

          <Text
            style={[styles.sectionTitle, { paddingTop: 16, paddingBottom: 8 }]}
          >
            Classificação do motorista
          </Text>
          <View style={{ paddingHorizontal: 16 }}>{getDriverRatingUI()}</View>
          <View style={styles.divider} />

          <Text
            style={[styles.sectionTitle, { paddingTop: 16, paddingBottom: 8 }]}
          >
            Tipo de veículo
          </Text>
          <View style={{ paddingHorizontal: 16 }}>{getVehicleTypeUI()}</View>
        </ScrollView>

        <View style={styles.divider} />
        <View style={styles.buttonWrapper}>
          <View style={styles.resetButtonContainer}>
            <MyPressable
              style={styles.resetButton}
              touchOpacity={0.6}
              onPress={() => {
                // Implementar lógica para resetar filtros
                setShowFilter(false);
              }}
            >
              <Text style={styles.resetButtonText}>Limpar</Text>
            </MyPressable>
          </View>
          <View style={styles.applyButtonContainer}>
            <MyPressable
              style={styles.applyButton}
              touchOpacity={0.6}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </MyPressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const getStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    headerText: {
      color: theme.text,
      fontSize: 22,
      fontFamily: "WorkSans-Bold",
      textAlign: "center",
      textAlignVertical: "center",
    },
    headerShadow: {
      height: Config.isAndroid ? 0.2 : 1,
      elevation: 4,
      backgroundColor: theme.lightGrey,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.lightGrey,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "WorkSans-SemiBold",
      color: theme.text,
      paddingHorizontal: 16,
    },
    checkBoxBtn: {
      alignSelf: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      padding: 10,
    },
    checkTitle: {
      color: theme.text,
      marginStart: 8,
      fontFamily: "WorkSans-Regular",
      fontSize: 15,
    },
    radioItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginVertical: 2,
    },
    radioText: {
      color: theme.text,
      marginStart: 8,
      fontFamily: "WorkSans-Regular",
      fontSize: 15,
    },
    switchText: {
      flex: 1,
      color: theme.text,
      fontFamily: "WorkSans-Regular",
      fontSize: 15,
      alignSelf: "center",
    },
    buttonWrapper: {
      flexDirection: "row",
      padding: 16,
      paddingTop: 8,
      backgroundColor: theme.background,
    },
    resetButtonContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 24,
      marginRight: 8,
      overflow: "hidden",
    },
    resetButton: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 24,
    },
    resetButtonText: {
      fontSize: 16,
      color: theme.primary,
      fontFamily: "WorkSans-Medium",
    },
    applyButtonContainer: {
      flex: 2,
      backgroundColor: theme.primary,
      borderRadius: 24,
      elevation: 8,
      shadowColor: "grey",
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: "hidden",
    },
    applyButton: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 24,
    },
    applyButtonText: {
      fontSize: 16,
      color: "white",
      fontFamily: "WorkSans-Medium",
    },
  });

export default FilterModal;
