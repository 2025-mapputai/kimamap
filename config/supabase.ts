import { createClient } from "@supabase/supabase-js";

// 環境変数から設定を取得（本番環境では適切に設定）
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://eoinyffmvewmxyzfnkdp.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaW55ZmZtdmV3bXh5emZua2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTc1NjUsImV4cCI6MjA2Mzk3MzU2NX0.BSlCFvViehtUW-I581XITCrNMfuScenMGLTZZryQ2lg";

// Supabase クライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 型定義のエクスポート
export type { Database } from "../database/types/database.types";
