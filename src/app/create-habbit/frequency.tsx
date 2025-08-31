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
import { useHabitForm, WEEK_DAYS } from "@/contexts/HabitFormContext";


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
          {WEEK_DAYS.map((day, index, days) => {
            const isSelected = formData.frequency.value.includes(day.key)
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
