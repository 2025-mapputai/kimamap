import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList, RootStackParamList } from '../../../App';
import { StackNavigationProp } from "@react-navigation/stack";

// タブの型
type MyPageTabProp = BottomTabNavigationProp<MainTabParamList, "MyPage">;

// 親スタックの型
type RootStackProp = StackNavigationProp<RootStackParamList>;

const MyPage: React.FC = () => {
  const navigation = useNavigation<MyPageTabProp>();
  const rootNavigation = useNavigation<RootStackProp>(); // スタック画面にアクセスする用

  return (
    <View style={styles.root}>
      {/* ScrollView を削除して View のみ */}
      <View style={styles.content}>
        <Button
          mode="outlined"
          style={styles.logoutBtn}
          onPress={() => rootNavigation.navigate("LogoutConfirm")}
        >
          ログアウト
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  logoutBtn: { margin: 16, width: "90%" },
});

export default MyPage;