import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="greetings/[animValueParam]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="social-auth/[key]" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="ride/[rideId]" options={{ headerShown: false }} />
    </Stack>
  );
}
