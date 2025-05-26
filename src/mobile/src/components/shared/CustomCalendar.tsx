import MyPressable from "@/src/components/MyPressable";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export const colors = {
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

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundAccent: string;
  foreground: string;
  white: string;
  grey: string;
  lightGrey: string;
  darkGrey: string;
}

const lightTheme: Theme = {
  primary: colors.primaryPink,
  secondary: colors.darkPink,
  accent: colors.darkGrey,
  background: colors.white,
  backgroundAccent: colors.lightPink,
  foreground: colors.black,
  white: colors.white,
  grey: colors.grey,
  lightGrey: colors.lightGrey,
  darkGrey: colors.darkGrey,
};

interface Props {
  minDate?: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  startEndDateChange: (startDate: Date | null, endDate: Date | null) => void;
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
  const [currentMonthDisplayed, setCurrentMonthDisplayed] = useState(
    new Date()
  );
  const theme = lightTheme;
  const styles = getStyles(theme);

  const isSameDay = (d1: Date | null, d2: Date | null) =>
    d1 && d2 && d1.toDateString() === d2.toDateString();

  const setListOfDate = useCallback((monthDate: Date) => {
    const dates: Date[] = [];
    const firstDayOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    );
    const lastDayOfPrevMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      0
    );
    const prevMonthDaysToShow = firstDayOfMonth.getDay();

    for (let i = prevMonthDaysToShow; i > 0; i--) {
      const date = new Date(lastDayOfPrevMonth);
      date.setDate(lastDayOfPrevMonth.getDate() - (i - 1));
      dates.push(date);
    }

    const totalDaysInMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      dates.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), i));
    }

    let dayCount = dates.length;
    let nextMonthDay = 1;
    while (dayCount < 42) {
      dates.push(
        new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          nextMonthDay
        )
      );
      nextMonthDay++;
      dayCount++;
    }

    setDateList(dates);
  }, []);

  useEffect(() => {
    setListOfDate(currentMonthDisplayed);
  }, [currentMonthDisplayed, setListOfDate]);

  const getIsInRange = (date: Date) =>
    startDate && endDate ? date > startDate && date < endDate : false;

  const onDatePressedValidations = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const effectiveMinDate = minDate ? new Date(minDate) : today;
    effectiveMinDate.setHours(0, 0, 0, 0);

    if (date.getTime() < effectiveMinDate.getTime()) return;

    if (!startDate) {
      // No start date selected, set this date as startDate
      startEndDateChange(date, null);
    } else if (!endDate) {
      // Start date is selected, but no end date. Set this date as endDate.
      if (isSameDay(startDate, date)) {
        // If clicking the same date again, reset the selection
        startEndDateChange(startDate, startDate);
      } else if (date < startDate) {
        // If the new date is earlier than startDate, make it the new startDate
        startEndDateChange(date, startDate);
      } else {
        // New date is later than startDate, set it as endDate
        startEndDateChange(startDate, date);
      }
    } else {
      // Both startDate and endDate are selected, start a new selection
      startEndDateChange(date, null);
    }
  };

  const getDaysNameUI = () =>
    WEEK_DAYS.map((day) => (
      <Text key={day} style={styles.weekDayText}>
        {day}
      </Text>
    ));

  const getDaysNoUI = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dateList.map((date, index) => {
      const isDateCurrentMonth =
        date.getMonth() === currentMonthDisplayed.getMonth();
      const isDateStart = isSameDay(date, startDate);
      const isDateEnd = isSameDay(date, endDate);
      const isDateStartOrEnd = isDateStart || isDateEnd;
      const isDateInRange = getIsInRange(date);
      const isToday = isSameDay(date, today);

      const effectiveMinDate = minDate ? new Date(minDate) : today;
      effectiveMinDate.setHours(0, 0, 0, 0);
      const isDisabled = date.getTime() < effectiveMinDate.getTime();

      const applyLeftRadius =
        isDateStart || (isDateInRange && date.getDay() === 0);
      const applyRightRadius =
        isDateEnd || (isDateInRange && date.getDay() === 6);

      return (
        <View key={`day_${index}`} style={styles.dayCell}>
          <View
            style={[
              styles.rangeBackground,
              {
                backgroundColor:
                  isDateStartOrEnd || isDateInRange
                    ? theme.backgroundAccent
                    : "transparent",
                borderBottomLeftRadius: applyLeftRadius ? 24 : 0,
                borderTopLeftRadius: applyLeftRadius ? 24 : 0,
                borderTopRightRadius: applyRightRadius ? 24 : 0,
                borderBottomRightRadius: applyRightRadius ? 24 : 0,
              },
            ]}
          />
          <View
            style={[
              styles.dayNoBtnContainer,
              {
                borderWidth: isDateStartOrEnd ? 2 : 0,
                borderColor: isDateStartOrEnd ? theme.primary : "transparent",
                backgroundColor: isDateStartOrEnd
                  ? theme.primary
                  : "transparent",
              },
              isDateStartOrEnd && styles.activeDatesShadow,
            ]}
          >
            <MyPressable
              style={styles.dayNoBtn}
              android_ripple={{ color: colors.lightPink, borderless: true }}
              onPress={() => onDatePressedValidations(date)}
              disabled={isDisabled}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: isDateStartOrEnd
                    ? "WorkSans-Bold"
                    : "WorkSans-Regular",
                  color: isDateStartOrEnd
                    ? theme.white
                    : isDateCurrentMonth && !isDisabled
                    ? theme.foreground
                    : theme.grey,
                }}
              >
                {date.getDate()}
              </Text>
              {isToday && (
                <View
                  style={[
                    styles.currentDateIndicator,
                    {
                      backgroundColor:
                        isDateStartOrEnd || isDateInRange
                          ? theme.white
                          : theme.secondary,
                    },
                  ]}
                />
              )}
            </MyPressable>
          </View>
        </View>
      );
    });
  };

  const renderCalendarRows = () => {
    const rows = [];
    const days = getDaysNoUI();
    for (let i = 0; i < days.length; i += 7) {
      rows.push(
        <View key={`row_${i / 7}`} style={styles.dayNoRowView}>
          {days.slice(i, i + 7)}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
      <View style={{ flexDirection: "row", padding: 8 }}>
        <View style={styles.arrowContainerStyle}>
          <MyPressable
            style={styles.arrowBtnStyle}
            touchOpacity={0.6}
            onPress={() => {
              const newMonth = new Date(currentMonthDisplayed);
              newMonth.setMonth(newMonth.getMonth() - 1);
              setCurrentMonthDisplayed(newMonth);
            }}
          >
            <Icon name="keyboard-arrow-left" size={28} />
          </MyPressable>
        </View>
        <View style={styles.monthTextView}>
          <Text style={[styles.monthText]}>
            {MONTH_NAMES[currentMonthDisplayed.getMonth()]}{" "}
            {currentMonthDisplayed.getFullYear()}
          </Text>
        </View>
        <View style={styles.arrowContainerStyle}>
          <MyPressable
            style={styles.arrowBtnStyle}
            touchOpacity={0.6}
            onPress={() => {
              const newMonth = new Date(currentMonthDisplayed);
              newMonth.setMonth(newMonth.getMonth() + 1);
              setCurrentMonthDisplayed(newMonth);
            }}
          >
            <Icon name="keyboard-arrow-right" size={28} />
          </MyPressable>
        </View>
      </View>
      <View style={styles.weekDaysRow}>{getDaysNameUI()}</View>
      {renderCalendarRows()}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    arrowContainerStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: 48,
    },
    arrowBtnStyle: {
      height: 48,
      width: 48,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      borderColor: theme.grey,
      borderWidth: 0.3,
    },
    monthTextView: {
      flex: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    monthText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.foreground,
      fontFamily: "WorkSans-Bold",
    },
    weekDaysRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 4,
    },
    weekDayText: {
      fontSize: 16,
      fontWeight: "600",
      fontFamily: "WorkSans-SemiBold",
      color: theme.grey,
      flex: 1,
      textAlign: "center",
    },
    dayNoRowView: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 4,
    },
    dayCell: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    rangeBackground: {
      position: "absolute",
      height: 48,
      width: "110%",
      left: "-5%",
      borderRadius: 24,
      zIndex: -1,
    },
    dayNoBtnContainer: {
      height: 44,
      width: 44,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    dayNoBtn: {
      height: 44,
      width: 44,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    activeDatesShadow: {
      shadowColor: theme.primary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 5,
    },
    currentDateIndicator: {
      position: "absolute",
      bottom: 6,
      left: "50%",
      transform: [{ translateX: -6 }],
      height: 12,
      width: 12,
      borderRadius: 6,
    },
  });

export default CustomCalendar;
