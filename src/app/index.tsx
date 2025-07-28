import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { locale } from "@/constants/locale";
import { useRouter } from "expo-router";
import { useHabbits } from "@/hooks/useHabbits";

export default function Home() {
  const router = useRouter();
  const { habits } = useHabbits();

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
      });
    }

    return datesArray;
  }, []);

  const handleSaveHabit = (habitData: any) => {
    console.log("Saving habit:", habitData);
    // Add your habit saving logic here
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
          {habits.map((habit) => (
            <HStack
              key={habit.id}
              className="justify-between items-center bg-gray-50 p-4 rounded-lg">
              <HStack
                space="md"
                className="items-center flex-1">
                <View className={`w-12 h-12 ${habit.color} rounded-full items-center justify-center`}>
                  <Text className="text-white text-lg">{habit.icon}</Text>
                </View>
                <VStack space="xs">
                  <Text className="text-black font-medium text-base">{habit.name}</Text>
                  <Text className="text-gray-500 text-sm">{habit.progress}</Text>
                </VStack>
              </HStack>
              <Button className="bg-blue-400 px-4 py-2 rounded-full">
                <HStack
                  space="sm"
                  className="items-center">
                  <Text className="text-white text-sm font-medium">Виконано</Text>
                </HStack>
              </Button>
            </HStack>
          ))}
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
