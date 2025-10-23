//ログイン状態をチェックし、適切な画面にリダイレクトするコンポーネント
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

// スタックナビゲーション用
type AuthLoadingNavProp = StackNavigationProp<RootStackParamList, "Root">;

// 認証状態を確認し、適切な画面にリダイレクトするコンポーネント
const AuthLoading: React.FC = () => {
  const navigation = useNavigation<AuthLoadingNavProp>();

  // コンポーネントがマウントされたときに認証状態を確認
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigation.replace("Main", { screen: "Map" });
      } else {
        navigation.replace("Login");
      }
    };
    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F8D762" />
    </View>
  );
};

export default AuthLoading;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});