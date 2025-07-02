import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

// 型定義（Propsがあればここに記述）

export const MyPage: React.FC = () => {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Button mode="outlined" style={styles.logoutBtn} onPress={() => {}}>
          ログアウト
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    margin: 16,
    width: "90%",
  },
});

export default MyPage;