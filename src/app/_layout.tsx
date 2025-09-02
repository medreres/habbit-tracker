import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useLayoutEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/components/useColorScheme";
import { router, Slot, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";

import "../global.css";
import { QueryProvider } from "../components/query-provider";
import { useDatabase } from "@/hooks/useDatabase";
import { HStack } from "@/components/ui/hstack";
import { ChevronLeft, Edit3, MoreVertical } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { TouchableOpacity } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "gluestack",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isInitialized, error: dbError } = useDatabase();
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error || dbError) throw error || dbError;
  }, [error, dbError]);

  if (!loaded || !isInitialized) {
    return null;
  }

  return (
    <QueryProvider
      onRestored={() => {
        SplashScreen.hideAsync();
      }}>
      <RootLayoutNav />
    </QueryProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* TODO add support for dark mode */}
      <GluestackUIProvider mode={"light"}>
      {/* <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}> */}
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="create-habbit"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="habbit/[id]"
              options={{
                presentation: "modal",
              }}
            />
          </Stack>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
