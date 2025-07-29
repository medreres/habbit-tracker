import { Stack } from "expo-router";
import { HabitFormProvider } from "@/contexts/HabitFormContext";

export default function CreateHabbitLayout() {
  return (
    <HabitFormProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="frequency"
          options={{
            headerBackButtonDisplayMode: 'minimal'
          }}
        />
      </Stack>
    </HabitFormProvider>
  );
}
