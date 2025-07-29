import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useHabitForm } from "@/contexts/HabitFormContext";

const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(2024, 0, i + 7); // Using Jan 7-13 2024 to get all days
  return {
    key: date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
    label: date.toLocaleDateString("uk-UA", { weekday: "long" }),
  };
});

export default function Frequency() {
  const router = useRouter();
  const { formData, updateFormData } = useHabitForm();
  const [selectedTab, setSelectedTab] = useState("daily");

  const tabs = [
    { key: "daily", label: "Щодня" },
    { key: "monthly", label: "Щомісяця", disabled: true },
    { key: "interval", label: "Інтервал", disabled: true },
  ];

  const toggleDay = (dayKey: string) => {
    const newSelectedDays = new Map(formData.selectedDays);
    const newValue = !newSelectedDays.get(dayKey);
    newSelectedDays.set(dayKey, newValue);

    console.log('newSelectedDays', newSelectedDays)

    updateFormData({
      selectedDays: newSelectedDays,
    });
  };

  return (
    <>
      {/* Segmented Control */}
      <Box className="px-4 py-4">
        <Box className="bg-gray-100 rounded-lg p-1">
          <HStack className="relative">
            {tabs.map((tab, index) => (
              <Pressable
                disabled={tab.disabled}
                key={tab.key}
                className={`flex-1 py-2 px-3 rounded-md ${
                  selectedTab === tab.key ? "bg-white shadow-sm" : "bg-transparent"
                }`}
                onPress={() => setSelectedTab(tab.key)}>
                <Text
                  className={`text-center text-sm font-medium ${
                    selectedTab === tab.key ? "text-black" : "text-gray-600"
                  }`}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </Box>
      </Box>

      {/* Days List */}
      <ScrollView className="flex-1">
        <VStack className="bg-white">
          {days.map((day, index) => {
            const isSelected = formData.selectedDays.get(day.key);
            return (
              <Box key={day.key}>
                <Pressable
                  className="px-4 py-4 flex-row items-center justify-between"
                  onPress={() => toggleDay(day.key)}>
                  <Text className="text-base text-black">{day.label}</Text>
                  {isSelected && <Icon as={Check} />}
                </Pressable>
                {index < days.length - 1 && <Divider className="mx-4" />}
              </Box>
            );
          })}
        </VStack>
      </ScrollView>
    </>
  );
}
