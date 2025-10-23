import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import MapTop from "./app/screens/map-top";
import Search from "./app/screens/search";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Login from "./app/screens/login";
import LogoutConfirm from "./app/screens/profile/LogoutConfirm";
import AuthLoading from "./app/screens/AuthLoading";
import MyPage from "./app/screens/profile/MyPage";

export type MainTabParamList = {
  Map: undefined;
  Dummy1: undefined;
  MyPage: undefined;
};

export type RootStackParamList = {
  Root: undefined; // AuthLoading
  Main: {
    screen: keyof MainTabParamList;
  };
  Search: undefined;
  LogoutConfirm: undefined;
  Login: undefined;   
};

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
const Stack = createStackNavigator();

const TAB_COLOR = "#F8D762";
const ICONS = {
  Map: "map",
  Dummy1: "bookmark",
  MyPage: "user",
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: route.name !== "Map",
      tabBarStyle: {
        backgroundColor: TAB_COLOR,
        borderTopWidth: 0,
        height: 100,
        paddingBottom: 4,
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
              borderRadius: 36,
              padding: 16,
              minWidth: 52,
              minHeight: 52,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Icon
              name={iconName}
              size={20}
              color={focused ? "#fff" : "#222"}
              solid
            />
          </View>
        );
      },
    })}
  >
    <Tab.Screen name="Map" component={MapTop} options={{ title: "マップ", headerShown: false }} />
    <Tab.Screen
      name="Dummy1"
      component={DummyScreen1}
      options={{
        title: "保存済み",
        headerShown: true,
        headerStyle: { backgroundColor: TAB_COLOR },
        headerTintColor: "#fff",
      }}
    />
    <Tab.Screen
      name="MyPage"
      component={MyPage}
      options={{
        title: "マイページ",
        headerShown: true,
        headerStyle: { backgroundColor: TAB_COLOR },
        headerTintColor: "#fff",
      }}
    />
  </Tab.Navigator>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >

        <Stack.Screen name="Root" component={AuthLoading} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="LogoutConfirm" component={LogoutConfirm} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
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
