import React, { ReactNode, useCallback, useEffect } from "react";
import { View, ScrollView, TextInput, Pressable, StatusBar } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useNavigation, useRouter } from "expo-router";
import { useHabbits } from "@/hooks/useHabbits";
import { ChevronRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useHabitForm } from "@/contexts/HabitFormContext";
import { locale } from "@/constants/locale";

export default function HabitFormModal() {
  const router = useRouter();
  const navigation = useNavigation();
  const { addHabit } = useHabbits();
  const { formData, updateFormData } = useHabitForm();

  // Helper function to format day names using Intl API
  const formatSelectedDays = (selectedDays: Map<string, boolean>) => {
    if (Array.from(selectedDays.values()).filter(Boolean).length === 7) {
      return "Щодня";
    }

    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

    const dayMap: { [key: string]: Date } = {
      monday: new Date(2024, 0, 1), // Monday
      tuesday: new Date(2024, 0, 2), // Tuesday
      wednesday: new Date(2024, 0, 3), // Wednesday
      thursday: new Date(2024, 0, 4), // Thursday
      friday: new Date(2024, 0, 5), // Friday
      saturday: new Date(2024, 0, 6), // Saturday
      sunday: new Date(2024, 0, 7), // Sunday
    };

    return Array.from(selectedDays.entries())
      .filter(([_, value]) => value)
      .map(([key]) => formatter.format(dayMap[key]))
      .join(", ");
  };

  // Helper function to format required value and type
  const formatRequiredValue = (value: number, type: string) => {
    const typeMap: { [key: string]: string } = {
      minutes: "хв",
      hours: "год",
      times: "раз",
      liters: "л",
    };
    const typeText = typeMap[type] || type;
    return `${value} ${typeText}`;
  };

  const handleSave = useCallback(async () => {
    // Pass data back to previous screen
    await addHabit({
      name: formData.name,
      requiredValue: formData.requiredValue,
      requiredType: formData.requiredType,
    });
    router.back();
    // You can also use router.setParams() to pass data back
  }, [formData, addHabit, router]);

  // Set header buttons from the screen itself
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            router.back();
          }}>
          <Text className="text-blue-500 text-base font-medium">Скасувати</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleSave}>
          <Text className="text-blue-500 text-base font-medium">Зберегти</Text>
        </Pressable>
      ),
    });
  }, [router, handleSave]); // Re-run when form data changes

  const SelectionRow = ({
    icon,
    label,
    value,
    onPress,
  }: {
    icon: ReactNode;
    label: string;
    value: string;
    onPress: () => void;
  }) => (
    <Pressable onPress={onPress}>
      <HStack
        className="justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm"
        space="md">
        <HStack
          space="md"
          className="items-center flex-1">
          <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center">
            <Text className="text-lg">{icon}</Text>
          </View>
          <VStack space="xs">
            <Text className="text-gray-500 text-xs uppercase tracking-wide font-medium">{label}</Text>
            <Text className="text-black text-base">{value}</Text>
          </VStack>
        </HStack>
        <Icon
          as={ChevronRight}
          className="color-gray-400"
        />
      </HStack>
    </Pressable>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-4">
        <VStack space="md">
          {/* Name Input */}
          <HStack
            className="bg-white p-4 rounded-lg shadow-sm"
            space="md">
            <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center">
              <Text className="text-red-500 text-lg">❓</Text>
            </View>
            <TextInput
              className="flex-1 text-base text-black"
              placeholder="Назва"
              placeholderTextColor="#9CA3AF"
              value={formData.name}
              onChangeText={(text) => updateFormData({ name: text })}
            />
          </HStack>
          {/* <SelectionRow
            icon={<Icon as={Repeat} />}
            label="ПОВТОРИТИ"
            value={formatSelectedDays(formData.selectedDays)}
            onPress={() => {
              router.push("/create-habbit/frequency");
            }}
          /> */}

          {/* <SelectionRow
            icon={<Icon as={Target} />}
            label="МЕТА"
            value={formatRequiredValue(formData.requiredValue, formData.requiredType)}
            onPress={() => {
              // router.push("/create-habbit/goal");
            }}
          /> */}

          {/* 
          <SelectionRow
            icon="☀️"
            label="ЧАС ДНЯ"
            value={formData.timeOfDay}
            onPress={() => {
              router.push("/time-selection");
            }}
          />

          <SelectionRow
            icon=""
            label="НАГАДУВАННЯ"
            value={formData.reminder}
            onPress={() => {
              router.push("/reminder-selection");
            }}
          />

          <SelectionRow
            icon=""
            label="ЧЕК-ЛИСТ"
            value={formData.checklist}
            onPress={() => {
              router.push("/checklist-selection");
            }}
          />

          <SelectionRow
            icon=""
            label="ДАТА ПОЧАТКУ"
            value={formData.startDate}
            onPress={() => {
              router.push("/date-selection");
            }}
          /> */}
        </VStack>
      </ScrollView>
    </>
  );
}
