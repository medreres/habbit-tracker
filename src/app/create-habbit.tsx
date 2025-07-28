import React, { useState } from "react";
import { View, ScrollView, TextInput, Pressable, StatusBar } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { useHabbits } from "@/hooks/useHabbits";

interface HabitFormData {
  name: string;
  repeat: string;
  goal: string;
  timeOfDay: string;
  reminder: string;
  checklist: string;
  startDate: string;
}

export default function HabitFormModal() {
  const router = useRouter();
  const { addHabit } = useHabbits();
  const [formData, setFormData] = useState<HabitFormData>({
    name: "",
    repeat: "Щодня",
    goal: "1 раз на день",
    timeOfDay: "Будь-який час",
    reminder: "09:00",
    checklist: "Нічого",
    startDate: "Сьогодні",
  });

  const handleSave = async () => {
    // Pass data back to previous screen
    await addHabit({
      name: formData.name,
      buttonIcon: '',
      buttonText: '',
      color: '',
      icon: '',
      progress: ''
    });
    router.back();
    // You can also use router.setParams() to pass data back
  };

  const handleCancel = () => {
    router.back();
  };

  // const SelectionRow = ({
  //   icon,
  //   label,
  //   value,
  //   onPress,
  // }: {
  //   icon: string;
  //   label: string;
  //   value: string;
  //   onPress: () => void;
  // }) => (
  //   <Pressable onPress={onPress}>
  //     <HStack
  //       className="justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm"
  //       space="md">
  //       <HStack
  //         space="md"
  //         className="items-center flex-1">
  //         <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center">
  //           <Text className="text-lg">{icon}</Text>
  //         </View>
  //         <VStack space="xs">
  //           <Text className="text-gray-500 text-xs uppercase tracking-wide font-medium">{label}</Text>
  //           <Text className="text-black text-base">{value}</Text>
  //         </VStack>
  //       </HStack>
  //       <Text className="text-gray-400 text-lg">›</Text>
  //     </HStack>
  //   </Pressable>
  // );

  return (
    <>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <HStack className="justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
        <Pressable onPress={handleCancel}>
          <Text className="text-blue-500 text-base font-medium">Скасувати</Text>
        </Pressable>
        <Pressable onPress={handleSave}>
          <Text className="text-blue-500 text-base font-medium">Зберегти</Text>
        </Pressable>
      </HStack>

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
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </HStack>
          {/* 
          <SelectionRow
            icon=""
            label="ПОВТОРИТИ"
            value={formData.repeat}
            onPress={() => {
              router.push("/repeat-selection");
            }}
          />

          <SelectionRow
            icon=""
            label="МЕТА"
            value={formData.goal}
            onPress={() => {
              router.push("/goal-selection");
            }}
          />

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
