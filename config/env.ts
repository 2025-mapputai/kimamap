// 環境変数の型定義と管理
export const env = {
  // Supabase 設定
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  // Google Maps 設定
  googleMaps: {
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  },

  // API エンドポイント
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
  },

  // アプリ設定
  app: {
    name: "Kimamap",
    version: "1.0.0",
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || "development",
  },
} as const;

// 環境変数の検証
export const validateEnv = (): void => {
  const requiredVars = [
    "EXPO_PUBLIC_SUPABASE_URL",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn("Missing environment variables:", missingVars);
  }
};

export type Env = typeof env;
