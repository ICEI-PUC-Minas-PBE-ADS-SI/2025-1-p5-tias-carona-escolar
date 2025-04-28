import MyPressable from "@/src/components/MyPressable";
import { lightTheme, Theme } from "@/src/constants/theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface Props {
  minDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  startEndDateChange: (startData: Date | null, endData: Date | null) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CustomCalendar: React.FC<Props> = ({
  minDate,
  startDate,
  endDate,
  startEndDateChange,
}) => {
  const [dateList, setDateList] = useState<Date[]>([]);
  const theme = lightTheme;
  const styles = getStyles(theme);

  const currentMonthDate = useRef<Date>(new Date()).current;
  const minimumDate = useRef<Date | null>(minDate).current;
  const maximumDate = useRef<Date | null>(null).current;

  const setListOfDate = useCallback((monthDate: Date) => {
    const dates: Date[] = [];
    const newDate = new Date();
    newDate.setFullYear(monthDate.getFullYear(), monthDate.getMonth(), 0);
    const prevMonthDate = newDate.getDate();
    let previousMonthDay = 0;

    if (newDate.getDay() !== 0) {
      previousMonthDay = newDate.getDay() === 0 ? 7 : newDate.getDay();
      for (let i = 1; i <= previousMonthDay; i++) {
        const date = new Date(newDate);
        date.setDate(prevMonthDate - (previousMonthDay - i));
        dates.push(date);
      }
    }
    // 42 = 7 * 6:- 7 == column, 6 == rows
    for (let i = 0; i < 42 - previousMonthDay; i++) {
      const date = new Date(newDate);
      date.setDate(prevMonthDate + (i + 1));
      dates.push(date);
    }

    setDateList(dates);
  }, []);

  useEffect(() => {
    setListOfDate(new Date());
  }, [setListOfDate]);

  const getIsInRange = (date: Date) => {
    if (startDate != null && endDate != null) {
      return date > startDate && date < endDate;
    } else {
      return false;
    }
  };

  const getIsItStartAndEndDate = (date: Date) => {
    return (
      startDate?.toDateString() === date.toDateString() ||
      endDate?.toDateString() === date.toDateString()
    );
  };

  const isStartDateRadius = (date: Date) => {
    return (
      startDate?.toDateString() === date.toDateString() || date.getDay() === 1
    );
  };

  const isEndDateRadius = (date: Date) => {
    return (
      endDate?.toDateString() === date.toDateString() || date.getDay() === 0
    );
  };

  const onDatePressedValidations = (date: Date) => {
    if (currentMonthDate.getTime() > date.getTime()) return;

    const newMinimumDate = minimumDate ? new Date(minimumDate) : null;
    const newMaximumDate = maximumDate ? new Date(maximumDate) : null;

    if (newMinimumDate) newMinimumDate.setDate(newMinimumDate.getDate());
    if (newMaximumDate) newMaximumDate.setDate(newMaximumDate.getDate() + 1);

    const isWithinRange =
      (!newMinimumDate || date > newMinimumDate) &&
      (!newMaximumDate || date < newMaximumDate);

    if (isWithinRange) {
      handleDateSelection(date);
    }
  };

  const handleDateSelection = (date: Date) => {
    let updatedStartDate = startDate;
    let updatedEndDate = endDate;

    if (!updatedStartDate || (updatedStartDate && updatedEndDate)) {
      // Se não há startDate ou se há um intervalo completo, inicia um novo intervalo
      updatedStartDate = date;
      updatedEndDate = null;
    } else if (updatedStartDate.toDateString() === date.toDateString()) {
      // Se a data clicada for a mesma do startDate, remove a seleção
      updatedStartDate = null;
    } else {
      // Se já há um startDate e a data clicada é diferente, define endDate
      updatedEndDate = date;
    }

    // Garante que startDate seja sempre menor que endDate
    if (
      updatedStartDate &&
      updatedEndDate &&
      updatedEndDate < updatedStartDate
    ) {
      [updatedStartDate, updatedEndDate] = [updatedEndDate, updatedStartDate];
    }

    startEndDateChange(updatedStartDate, updatedEndDate);
  };

  const getDaysNameUI = () => {
    if (dateList.length === 0) {
      return;
    }

    const listUI: React.JSX.Element[] = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = WEEK_DAYS[dateList[i].getDay()];

      listUI.push(
        <Text key={weekDay} style={styles.weekDayText}>
          {weekDay}
        </Text>
      );
    }
    return listUI;
  };

  const getDaysNoUI = () => {
    const noList: React.JSX.Element[] = [];
    let count = 0;

    for (let i = 0; i < dateList.length / 7; i++) {
      const listUI: React.JSX.Element[] = [];

      for (let j = 0; j < 7; j++) {
        const date = dateList[count];

        const isDateStartOrEnd = getIsItStartAndEndDate(date);
        const isDateInRange = getIsInRange(date);

        listUI.push(
          <View key={`day_${count}`} style={{ flex: 1, aspectRatio: 1.0 }}>
            <View
              style={{
                flex: 1,
                marginVertical: 3,
                backgroundColor: (() => {
                  if (startDate != null && endDate != null) {
                    return isDateStartOrEnd || isDateInRange
                      ? theme.backgroundAccent
                      : "transparent";
                  } else {
                    return "transparent";
                  }
                })(),
                paddingLeft: isStartDateRadius(date) ? 4 : 0,
                paddingRight: isEndDateRadius(date) ? 4 : 0,
                borderBottomLeftRadius: isStartDateRadius(date) ? 24 : 0,
                borderTopLeftRadius: isStartDateRadius(date) ? 24 : 0,
                borderTopRightRadius: isEndDateRadius(date) ? 24 : 0,
                borderBottomRightRadius: isEndDateRadius(date) ? 24 : 0,
              }}
            />
            <View
              style={[
                styles.dayNoBtnContainer,
                {
                  borderWidth: isDateStartOrEnd ? 2 : 0,
                  borderColor: isDateStartOrEnd ? "white" : "transparent",
                  backgroundColor: isDateStartOrEnd
                    ? theme.blue
                    : "transparent",
                },
                isDateStartOrEnd && styles.activeDatesShadow,
              ]}
            >
              <MyPressable
                style={styles.dayNoBtn}
                android_ripple={{ color: "lightgrey", borderless: true }}
                onPress={() => onDatePressedValidations(date)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: isDateStartOrEnd
                      ? "WorkSans-Bold"
                      : "WorkSans-Regular",
                    color: isDateStartOrEnd
                      ? theme.white
                      : new Date().getTime() < date.getTime()
                      ? theme.foreground
                      : theme.grey,
                  }}
                >
                  {date.getDate()}
                </Text>
                <View
                  style={[
                    styles.currentDateIndicator,
                    {
                      backgroundColor:
                        new Date().toDateString() === date.toDateString()
                          ? (() => {
                              if (isDateStartOrEnd || isDateInRange) {
                                return "white";
                              } else {
                                return theme.secondary;
                              }
                            })()
                          : "transparent",
                    },
                  ]}
                />
              </MyPressable>
            </View>
          </View>
        );

        count += 1;
      }

      noList.push(
        <View key={`daysRow_${i}`} style={styles.dayNoRowView}>
          {listUI}
        </View>
      );
    }
    return noList;
  };

  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
      <View style={{ flexDirection: "row", padding: 8 }}>
        <View style={styles.arrowContainerStyle}>
          <MyPressable
            style={styles.arrowBtnStyle}
            touchOpacity={0.6}
            onPress={() => {
              currentMonthDate.setMonth(currentMonthDate.getMonth() - 1);
              setListOfDate(currentMonthDate);
            }}
          >
            <Icon name="keyboard-arrow-left" size={28} color="grey" />
          </MyPressable>
        </View>
        <Text style={styles.monthHeaderStyle}>
          {MONTH_NAMES[currentMonthDate.getMonth()]}
          {`, ${currentMonthDate.getFullYear()}`}
        </Text>
        <View style={styles.arrowContainerStyle}>
          <MyPressable
            style={styles.arrowBtnStyle}
            touchOpacity={0.6}
            onPress={() => {
              currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
              setListOfDate(currentMonthDate);
            }}
          >
            <Icon name="keyboard-arrow-right" size={28} color="grey" />
          </MyPressable>
        </View>
      </View>
      <View style={styles.weekDayContainer}>{getDaysNameUI()}</View>
      <View style={{ paddingHorizontal: 8 }}>{getDaysNoUI()}</View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    arrowContainerStyle: {
      borderRadius: 24,
      borderWidth: 0.6,
      borderColor: theme.lightGrey,
      overflow: "hidden",
    },
    arrowBtnStyle: {
      height: 38,
      width: 38,
      justifyContent: "center",
      alignItems: "center",
    },
    monthHeaderStyle: {
      flex: 1,
      color: theme.foreground,
      fontSize: 20,
      fontFamily: "WorkSans-Medium",
      textAlign: "center",
      textAlignVertical: "center",
    },
    weekDayContainer: {
      flexDirection: "row",
      paddingHorizontal: 8,
      paddingBottom: 8,
    },
    weekDayText: {
      flex: 1,
      textAlign: "center",
      fontSize: 16,
      fontFamily: "WorkSans-Medium",
      color: theme.accent,
    },
    dayNoRowView: {
      flexDirection: "row",
      marginVertical: 1,
    },
    dayNoBtn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    dayNoBtnContainer: {
      ...StyleSheet.absoluteFillObject,
      padding: 2,
      borderRadius: "50%",
    },
    activeDatesShadow: {
      ...Platform.select({
        ios: {
          shadowColor: "grey",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 2.63,
        },
        android: { elevation: 4 },
      }),
    },
    currentDateIndicator: {
      position: "absolute",
      bottom: 6,
      height: 4,
      width: 4,
      borderRadius: 2,
    },
  });

export default CustomCalendar;
