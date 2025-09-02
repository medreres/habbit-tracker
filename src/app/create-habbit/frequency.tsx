import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Check } from "lucide-react-native";
import { FREQUENCY, RepeatType } from "@/contexts/constants";
import { useHabitForm } from "@/contexts/HabitFormContext";
import { Checkbox, CheckboxGroup, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";

export default function Frequency() {
  const { formData, updateFormData } = useHabitForm();
  const [selectedTab, setSelectedTab] = useState<RepeatType>(RepeatType.Daily);

  return (
    <>
      {/* Segmented Control */}
      <Box className="px-4 py-4">
        <Box className="bg-gray-100 rounded-lg p-1">
          <HStack className="relative">
            {Object.entries(FREQUENCY).map(([key, tab], index) => (
              <Pressable
                disabled={tab.disabled}
                key={key}
                className={`flex-1 py-2 px-3 rounded-md ${
                  selectedTab === key ? "bg-white shadow-sm" : "bg-transparent"
                }`}
                onPress={() => setSelectedTab(key as RepeatType)}>
                <Text
                  className={`text-center text-sm font-medium ${selectedTab === key ? "text-black" : "text-gray-600"}`}>
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
          <CheckboxGroup
            onChange={(values) => {
              updateFormData({
                frequency: {
                  type: RepeatType.Daily,
                  selectedDays: values,
                },
              });
            }}
            value={formData.frequency.selectedDays}>
            {FREQUENCY[selectedTab as RepeatType].options?.map((option, index, options) => {
              const { value, label } = option;
              return (
                <Box key={value}>
                  <Checkbox
                    value={value}
                    className="px-4 py-4 flex-row items-center justify-between">
                    <CheckboxLabel>{label}</CheckboxLabel>
                    <CheckboxIndicator>
                      <CheckboxIcon as={Check}></CheckboxIcon>
                    </CheckboxIndicator>
                  </Checkbox>
                  {index < options.length - 1 && <Divider className="mx-4" />}
                </Box>
              );
            })}
          </CheckboxGroup>
        </VStack>
      </ScrollView>
    </>
  );
}
