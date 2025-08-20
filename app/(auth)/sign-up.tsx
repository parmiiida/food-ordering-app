import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const signUp = () => {
  return (
    <View>
      <Text>signUp</Text>
      <Button title="Sign in" onPress={() => router.push("/sign-in")} />
    </View>
  );
};

export default signUp;
