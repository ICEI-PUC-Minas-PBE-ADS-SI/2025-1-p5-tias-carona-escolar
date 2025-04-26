import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/src/components/shared/TabBar";

const CustomTabBar = (props: any) => <TabBar {...props} />;

const TabLayout = () => {
  return (
    <Tabs
      tabBar={CustomTabBar}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
      backBehavior="history"
    >
      <Tabs.Screen name="home" />
    </Tabs>
  );
};

export default TabLayout;
