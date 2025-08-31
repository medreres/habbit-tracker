import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { View, ScrollView, StatusBar, Pressable, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useHabbits } from "@/hooks/useHabbits";
import { useHabbitRecords } from "@/hooks/useHabbitRecords";
import { locale } from "@/constants/locale";
import { isAfter, isBefore, isSameDay, subDays } from "date-fns";
import { Edit3 } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits } = useHabbits();
  const navigation = useNavigation();

  const habit = useMemo(() => {
    return habits.find(h => h.id === id);
  }, [habits, id]);
  
  const today = useMemo(() => new Date(), []);
  
  const { records } = useHabbitRecords(
    useMemo(() => [id], [id]),
    today
  );
  
  const { streak, successDays, notCompletedDays, skippedDays, totalMinutes } = useMemo(() => {
    if (!habit) return { streak: 0, successDays: 0, notCompletedDays: 0, skippedDays: 0, totalMinutes: 0 };

    let currentStreak = 0;
    let successCount = 0;
    let notCompletedCount = 0;
    let skippedCount = 0;
    let totalMins = 0;

    // Check last 30 days
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      
      // Skip future dates
      if (isAfter(checkDate, today)) continue;
      
      // Skip dates before habit creation
      if (isBefore(checkDate, habit.createdAt)) continue;

      const dayRecords = records.filter(record => 
        isSameDay(new Date(record.completedAt), checkDate)
      );

      if (dayRecords.length > 0) {
        // Habit was completed this day
        const dayTotal = dayRecords.reduce((sum, record) => sum + record.actualValue, 0);
        if (dayTotal >= habit.requiredValue) {
          successCount++;
          totalMins += dayTotal;
          
          // Count streak (consecutive days from today backwards)
          if (i === currentStreak) {
            currentStreak++;
          }
        } else {
          notCompletedCount++;
        }
      } else {
        // Habit was not completed this day
        skippedCount++;
      }
    }

    return {
      streak: currentStreak,
      successDays: successCount,
      notCompletedDays: notCompletedCount,
      skippedDays: skippedCount,
      totalMinutes: totalMins
    };
  }, [habit, records]);
  
  const weekDays = useMemo(() => {
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayName = date.toLocaleDateString(locale, { weekday: "short" }).toUpperCase();
      const isCompleted = records.some(record => 
        isSameDay(new Date(record.completedAt), date) && 
        record.actualValue >= (habit?.requiredValue || 1)
      );
      
      days.push({ day: dayName, completed: isCompleted });
    }
    
    return days;
  }, [records, habit, today]);

  const handleEdit = () => {
    router.push(`/habbit/edit/${habit?.id}`);
  };

  const handleMoreOptions = () => {
    // TODO: Show more options menu
    console.log("More options");
  };

  if (!habit) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-center text-gray-500 mt-8">Habit not found</Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return <Text size="2xl">{habit.name}</Text>;
      },
      headerLeft: () => {
        const router = useRouter();
        return (
          <TouchableOpacity onPress={() => router.back()}>
            <Text
              className="text-blue-500"
              size="md">
              Cancel
            </Text>
          </TouchableOpacity>
        );
      },
      headerRight: () => {
        return (
          <HStack space="sm">
            <TouchableOpacity
              onPress={() => {
                router.push(`/habbit/edit/${id}`);
              }}>
              <Icon
                className="text-blue-500"
                as={Edit3}
                size="sm"
              />
            </TouchableOpacity>
          </HStack>
        );
      },
    });
  }, [habit]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Content */}
        <ScrollView className="flex-1 px-4">
          <VStack space="xl" className="py-4">
            {/* Streak Display */}
            <VStack space="md" className="items-center">
              <Text className="text-6xl font-bold text-black">{streak}</Text>
              <Text className="text-xl text-gray-600">днів поспіль!</Text>
              <Text className="text-base text-gray-500 text-center">
                {streak === 0 
                  ? "No streak is too small to begin! Let's make day one count."
                  : `Great job! Keep up the momentum!`
                }
              </Text>
            </VStack>

            {/* Weekly Progress */}
            <VStack space="md">
              <Text className="text-lg font-semibold text-black">This Week</Text>
              <HStack space="md" className="justify-between">
                {weekDays.map((day, index) => (
                  <VStack key={index} space="xs" className="items-center">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${
                      day.completed ? "bg-green-500" : "bg-gray-200"
                    }`}>
                      <Text className={`text-xs ${day.completed ? "text-white" : "text-gray-400"}`}>
                        {day.completed ? "✓" : ""}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-600">{day.day}</Text>
                  </VStack>
                ))}
              </HStack>
            </VStack>

            {/* Statistics Grid */}
            <VStack space="md">
              <Text className="text-lg font-semibold text-black">Statistics</Text>
              <VStack space="md">
                {/* First Row */}
                <HStack space="md">
                  {/* Success */}
                  <View className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <HStack space="sm" className="items-center mb-2">
                      <Text className="text-green-500 text-lg">✓</Text>
                      <Text className="text-sm font-medium text-gray-700">УСПІХ</Text>
                    </HStack>
                    <Text className="text-lg font-bold text-black">{successDays} Днів</Text>
                  </View>

                  {/* Not Completed */}
                  <View className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <HStack space="sm" className="items-center mb-2">
                      <Text className="text-red-500 text-lg">✗</Text>
                      <Text className="text-sm font-medium text-gray-700">НЕ ВИКОНАНО</Text>
                    </HStack>
                    <Text className="text-lg font-bold text-black">{notCompletedDays} Днів</Text>
                  </View>
                </HStack>

                {/* Second Row */}
                <HStack space="md">
                  {/* Skipped */}
                  <View className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <HStack space="sm" className="items-center mb-2">
                      <Text className="text-yellow-500 text-lg">→</Text>
                      <Text className="text-sm font-medium text-gray-700">ПРОПУЩЕНО</Text>
                    </HStack>
                    <Text className="text-lg font-bold text-black">{skippedDays} Днів</Text>
                  </View>

                  {/* Total */}
                  <View className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <HStack space="sm" className="items-center mb-2">
                      <Text className="text-blue-500 text-lg">📊</Text>
                      <Text className="text-sm font-medium text-gray-700">УСЬОГО</Text>
                    </HStack>
                    <Text className="text-lg font-bold text-black">
                      {habit.requiredType === 'minutes' || habit.requiredType === 'hours' 
                        ? `${totalMinutes} ${habit.requiredType === 'hours' ? 'Годин' : 'Хвилин'}`
                        : `${totalMinutes} ${habit.requiredType === 'times' ? 'Раз' : 'Літрів'}`
                      }
                    </Text>
                  </View>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
