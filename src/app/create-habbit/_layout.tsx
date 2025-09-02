import { Stack } from "expo-router";
import { HabitFormProvider } from "@/contexts/HabitFormContext";

export default function CreateHabbitLayout() {
  return (
    <HabitFormProvider>
      <Stack
        screenOptions={{
          headerBackVisible: true,
          headerBackTitle: "Назад",
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Створити звичку",
            // TODO create ios like header right action to save
          }}
        />
        <Stack.Screen
          name="frequency"
          options={{
            title: "Частота",
          }}
        />
      </Stack>
    </HabitFormProvider>
  );
}
