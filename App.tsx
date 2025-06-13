import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapTop from "./frontend/src/map-top";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

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

const TAB_COLOR = "#F8D762";
const ICONS = {
  Map: "map",
  Dummy1: "bookmark",
  Dummy2: "user",
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: TAB_COLOR },
          headerTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: TAB_COLOR,
            borderTopWidth: 0,
            height: 100, // フッターの高さを拡大
            paddingBottom: 4, // アイコンの下余白も追加
          },
          tabBarItemStyle: {
            marginTop: 12,
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            const iconName = ICONS[route.name as keyof typeof ICONS];
            return (
              <View
                style={{
                  backgroundColor: focused ? "#222" : "#fff",
                  borderRadius: 36, // 丸くて大きめに
                  padding: 16, // 内側スペース広く
                  minWidth: 52, // 幅の最低値
                  minHeight: 52, // 高さの最低値（丸く見える）
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <Icon
                  name={iconName}
                  size={20} // アイコンを小さく
                  color={focused ? "#fff" : "#222"}
                  solid
                />
              </View>
            );
          },
        })}
      >
        <Tab.Screen
          name="Map"
          component={MapTop}
          options={{ title: "マップ" }}
        />
        <Tab.Screen
          name="Dummy1"
          component={DummyScreen1}
          options={{ title: "保存済み" }}
        />
        <Tab.Screen
          name="Dummy2"
          component={DummyScreen2}
          options={{ title: "マイページ" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
