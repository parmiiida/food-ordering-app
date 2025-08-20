import { images } from "@/constants";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartButton = () => {
  const totalNumbers = 10;
  return (
    <TouchableOpacity className="cart-btn" onPress={() => {}}>
      <Image source={images.bag} className="size-5" resizeMode="contain" />

      {totalNumbers > 0 && (
        <View className="cart-badge">
          <Text className="small-boldtext-white">{totalNumbers}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;
