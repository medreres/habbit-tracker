import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { locale } from "@/constants/locale";
import { useRouter } from "expo-router";
import { useHabbits } from "@/hooks/useHabbits";
import { useHabbitRecords } from "@/hooks/useHabbitRecords";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Pressable } from "@/components/ui/pressable";
import { HabbitRecordRepository } from "@/database/habbitRecordRepository";
import { generateId } from "@/utils/idGenerator";

export default function Home() {
  const router = useRouter();
  const { habits, deleteHabit } = useHabbits();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { records, refetch } = useHabbitRecords(
    useMemo(() => habits.map((habit) => habit.id), [habits]),
    selectedDate
  );

  const dates = useMemo(() => {
    const today = new Date();
    const datesArray = [];

    // Generate last 7 days (including today)
    for (let i = 12; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayName = date.toLocaleDateString(locale, { weekday: "short" }).toUpperCase();

      const dateNumber = date.getDate().toString();

      const isToday = i === 0;

      datesArray.push({
        day: dayName,
        date: dateNumber,
        selected: isToday,
        fullDate: date.toISOString().split("T")[0], // YYYY-MM-DD format for reference
        dateObject: date,
      });
    }

    return datesArray;
  }, []);

  const handleSaveHabit = (habitData: any) => {
    console.log("Saving habit:", habitData);
    // Add your habit saving logic here
  };

  // Helper function to get progress text based on required type
  const getProgressText = (actualValue: number, requiredValue: number, requiredType: string) => {
    const typeMap: { [key: string]: string } = {
      minutes: "хв",
      hours: "год",
      times: "раз",
      liters: "л",
    };

    const typeText = typeMap[requiredType] || requiredType;
    return `${actualValue}/${requiredValue} ${typeText}`;
  };

  // Helper function to check if habit is completed
  const isHabitCompleted = (actualValue: number, requiredValue: number) => {
    return actualValue >= requiredValue;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <VStack
        space="md"
        className="px-4 py-2">
        <Text className="text-gray-500 text-sm uppercase tracking-wide">СЬОГОДНІ</Text>
        <HStack className="justify-between items-center">
          <HStack
            space="sm"
            className="items-center">
            <Text className="text-2xl font-bold text-black">Мій журнал</Text>
            <Text className="text-gray-600">✏️</Text>
          </HStack>
          <HStack space="sm">
            <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white text-sm">🎓</Text>
            </View>
            <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white text-sm">📈</Text>
            </View>
          </HStack>
        </HStack>
      </VStack>
      {/* Habits List */}
      <ScrollView className="flex-1">
        <VStack
          space="md"
          className="px-4 py-2">
          {habits.map((habit) => {
            // Calculate total actual value for the selected date
            const totalActualValue = records.reduce((sum, record) => sum + record.actualValue, 0);
            const requiredValue = habit.requiredValue || 1;
            const requiredType = habit.requiredType || "times";

            const isCompleted = isHabitCompleted(totalActualValue, requiredValue);
            const progressText = getProgressText(totalActualValue, requiredValue, requiredType);

            return (
              <Swipeable
                key={habit.id}
                renderLeftActions={(prog: SharedValue<number>, drag: SharedValue<number>) => {
                  const styleAnimation = useAnimatedStyle(() => {
                    return {
                      transform: [{ translateX: drag.value - 50 }],
                    };
                  });
                  const handleCancel = async () => {
                    // Filter records for this specific habit
                    const habitRecords = records.filter((record) => record.habbitId == habit.id);

                    console.log("habitRecords", habitRecords);

                    if (habitRecords.length > 0) {
                      // Get the most recent record (assuming records are sorted by completedAt)
                      const mostRecentRecord = habitRecords[habitRecords.length - 1];

                      Alert.alert("Скасувати запис", "Ви впевнені, що хочете скасувати останній запис цієї звички?", [
                        {
                          text: "Скасувати",
                          style: "cancel",
                        },
                        {
                          text: "Видалити",
                          style: "destructive",
                          onPress: async () => {
                            try {
                              await HabbitRecordRepository.delete(mostRecentRecord.id);
                              await refetch();
                              console.log("Habbit record deleted");
                            } catch (error) {
                              console.error("Error deleting habbit record:", error);
                            }
                          },
                        },
                      ]);
                    }
                  };

                  return (
                    <Reanimated.View
                      style={styleAnimation}
                      className="items-center flex-col">
                      <Pressable
                        onPress={handleCancel}
                        className="bg-orange-500 rounded-lg items-center justify-center"
                        style={{ width: 50, height: 50 }}>
                        <Text className="text-white text-xs">Cancel</Text>
                      </Pressable>
                    </Reanimated.View>
                  );
                }}
                renderRightActions={(prog: SharedValue<number>, drag: SharedValue<number>) => {
                  const styleAnimation = useAnimatedStyle(() => {
                    return {
                      transform: [{ translateX: drag.value + 50 }],
                    };
                  });

                  const handleDelete = () => {
                    Alert.alert("Видалити звичку", "Ви впевнені, що хочете видалити цю звичку?", [
                      {
                        text: "Скасувати",
                        style: "cancel",
                      },
                      {
                        text: "Видалити",
                        style: "destructive",
                        onPress: () => {
                          deleteHabit(habit.id);
                        },
                      },
                    ]);
                  };

                  return (
                    <Reanimated.View
                      style={styleAnimation}
                      className="items-center flex-col">
                      <Pressable
                        onPress={handleDelete}
                        className="bg-red-500 rounded-lg items-center justify-center"
                        style={{ width: 50, height: 50 }}>
                        <Text className="text-white">Delete</Text>
                      </Pressable>
                    </Reanimated.View>
                  );
                }}>
                <HStack
                  className={`justify-between items-center p-4 rounded-lg ${
                    isCompleted ? "bg-gray-200" : "bg-gray-50"
                  }`}>
                  <HStack
                    space="md"
                    className="items-center flex-1">
                    <View className={`w-12 h-12 ${habit.color} rounded-full items-center justify-center`}>
                      <Text className="text-white text-lg">{habit.icon}</Text>
                    </View>
                    <VStack space="xs">
                      <Text className={`text-black font-medium text-base ${isCompleted ? 'line-through' : ''}`}>{habit.name}</Text>
                      <Text className="text-gray-500 text-sm">{progressText}</Text>
                    </VStack>
                  </HStack>
                  <Button
                    onPress={async () => {
                      console.log("habit", habit);
                      await HabbitRecordRepository.create({
                        id: generateId(),
                        actualValue: 1,
                        completedAt: new Date(),
                        habbitId: habit.id,
                        requiredValue: habit.requiredValue,
                        requiredType: habit.requiredType,
                      });

                      await refetch();

                      console.log("Habbit record created");
                    }}
                    className={`px-4 py-2 rounded-full ${isCompleted ? "bg-gray-400" : "bg-blue-400"}`}>
                    <HStack
                      space="sm"
                      className="items-center">
                      <Text className="text-white text-sm font-medium">{isCompleted ? "Виконано" : "Виконати"}</Text>
                    </HStack>
                  </Button>
                </HStack>
              </Swipeable>
            );
          })}
        </VStack>
      </ScrollView>

      <HStack
        space="md"
        className="px-4 py-4 items-center">
        <ScrollView
          horizontal
          contentContainerClassName="gap-2"
          showsHorizontalScrollIndicator={false}
          contentOffset={{
            x: dates.length * 100,
            y: 0,
          }}>
          {dates.map((date, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedDate(date.dateObject)}
              className="items-center">
              <VStack
                space="xs"
                className="items-center">
                <Text className="text-gray-600 text-xs">{date.day}</Text>
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    date.selected ? "bg-blue-400" : "bg-transparent"
                  }`}>
                  <Text className={`text-sm ${date.selected ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                    {date.date}
                  </Text>
                </View>
              </VStack>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable
          onPress={() => router.push("/create-habbit")}
          className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
          <Text className="text-white text-xl">+</Text>
        </Pressable>
      </HStack>
    </SafeAreaView>
  );
}
