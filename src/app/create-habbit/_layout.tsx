import { router, Stack } from "expo-router";
import { HabitFormProvider } from "@/contexts/HabitFormContext";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";

export default function CreateHabbitLayout() {
  return (
    <HabitFormProvider>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <Pressable
              onPress={() => {
                router.back();
              }}>
              <Text className="text-blue-500 text-base font-medium">Скасувати</Text>
            </Pressable>
          ),
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="frequency"
          options={{}}
        />
      </Stack>
    </HabitFormProvider>
  );
}
