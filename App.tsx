import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapTop from "./frontend/src/map-top";
import { View, Text, StyleSheet } from "react-native";

// 仮の2つの画面コンポーネント
const DummyScreen1: React.FC = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text>ダミースクリーン1</Text>
  </View>
);
const DummyScreen2: React.FC = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text>ダミースクリーン2</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapTop} options={{ title: "マップ" }} />
        <Tab.Screen name="Dummy1" component={DummyScreen1} options={{ title: "ダミー1" }} />
        <Tab.Screen name="Dummy2" component={DummyScreen2} options={{ title: "ダミー2" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
