import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { lightTheme, Theme } from "@/src/constants/theme";

function TabBar({ state, descriptors, navigation }: Readonly<any>) {
  const theme = lightTheme;

  const validRoutes = ["home", "search", "profile", "new-recipe"];

  const getIcon = (routeName: string) => {
    switch (routeName) {
      case "home":
        return "home";
      case "search":
        return "search1";
      case "profile":
        return "user";
      case "new-recipe":
        return "plus";
      default:
        return null;
    }
  };

  return (
    <View style={[styles(theme).tabBarContainer]}>
      {state.routes
        .filter((route: any) => {
          const { options } = descriptors[route.key];
          const tabBarStyle: any = options.tabBarStyle;
          return !tabBarStyle?.display || tabBarStyle.display !== "none";
        })
        .map((route: any, index: any) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const iconName = validRoutes.includes(route.name)
            ? getIcon(route.name)
            : null;

          return (
            <Pressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles(theme).tabButton,
                isFocused
                  ? { backgroundColor: theme.foreground }
                  : { backgroundColor: theme.background },
              ]}
            >
              <View style={styles(theme).iconContainer}>
                {iconName && (
                  <AntDesign
                    name={iconName}
                    size={24}
                    color={isFocused ? theme.background : theme.foreground}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
    </View>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    tabBarContainer: {
      flexDirection: "row",
      width: "50%",
      height: 100,
      position: "absolute",
      left: "25%",
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      marginHorizontal: 10,
      padding: 20,
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default TabBar;
