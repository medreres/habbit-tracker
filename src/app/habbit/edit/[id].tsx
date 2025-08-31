import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, ScrollView, TextInput, Pressable, StatusBar, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { useHabbits } from "@/hooks/useHabbits";
import { ChevronRight, Repeat, Target } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { locale } from "@/constants/locale";

export default function EditHabitScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, updateHabit, deleteHabit } = useHabbits();
  const habit = habits.find((h) => h.id === id);
  const [formData, setFormData] = useState({
    name: "",
    requiredValue: 1,
    requiredType: "times" as "minutes" | "hours" | "times" | "liters",
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        requiredValue: habit.requiredValue,
        requiredType: habit.requiredType as "minutes" | "hours" | "times" | "liters",
      });
    }
  }, [habit]);

  const handleSave = async () => {
    if (!habit || !formData.name.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть назву звички");
      return;
    }

    try {
      await updateHabit(habit.id, {
        name: formData.name.trim(),
        requiredValue: formData.requiredValue,
        requiredType: formData.requiredType,
      });
      router.back();
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося оновити звичку");
    }
  };

  const handleDelete = () => {
    if (!habit) return;

    Alert.alert("Видалити звичку", "Ви впевнені, що хочете видалити цю звичку? Це дія незворотна.", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: async () => {
          try {
            deleteHabit(habit.id);
            router.back();
          } catch (error) {
            Alert.alert("Помилка", "Не вдалося видалити звичку");
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    router.back();
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={handleCancel}>
          <Text className="text-blue-500 text-base font-medium">Скасувати</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleSave}>
          <Text className="text-blue-500 text-base font-medium">Зберегти</Text>
        </Pressable>
      ),
    });
  }, [navigation, formData.name]);

  if (!habit) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Habit not found</Text>
      </View>
    );
  }

  const SelectionRow = ({
    icon,
    label,
    value,
    onPress,
  }: {
    icon: React.ReactNode;
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
              onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            />
          </HStack>

          {/* <SelectionRow
            icon={<Icon as={Repeat} />}
            label="ПОВТОРИТИ"
            value="Щодня"
            onPress={() => {
              // TODO: Implement frequency selection
              Alert.alert("Інформація", "Частота звички зараз встановлена як 'щодня'");
            }}
          /> */}

          {/* <SelectionRow
            icon={<Icon as={Target} />}
            label="МЕТА"
            value={formatRequiredValue(formData.requiredValue, formData.requiredType)}
            onPress={() => {
              // TODO: Implement goal selection
              Alert.alert("Інформація", "Мета звички зараз встановлена як '1 раз на день'");
            }} 
          />*/}

          {/* Delete Button
          <Pressable
            onPress={handleDelete}
            className="bg-red-50 p-4 rounded-lg border border-red-200">
            <Text className="text-red-600 text-center font-medium">Видалити звичку</Text>
          </Pressable> */}
        </VStack>
      </ScrollView>
    </>
  );
}
