import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "../../../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../../../App';

type LogoutConfirmScreenProp = StackNavigationProp<RootStackParamList, "LogoutConfirm">;

const LogoutConfirm: React.FC = () => {
  const navigation = useNavigation<LogoutConfirmScreenProp>();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace("Login"); // ログイン画面に戻す
  };

  const confirmLogout = () => {
    Alert.alert(
      "ログアウト",
      "本当にログアウトしますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "ログアウト", style: "destructive", onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>ログアウト確認</Text>
      <Button mode="contained" style={styles.btn} onPress={confirmLogout}>
        ログアウトする
      </Button>
      <Button mode="outlined" style={styles.btn} onPress={() => navigation.goBack()}>
        キャンセル
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, marginBottom: 30 },
  btn: { width: "80%", marginVertical: 10 },
});

export default LogoutConfirm;