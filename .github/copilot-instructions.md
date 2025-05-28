# Copilot Instructions for Kimamap

## プロジェクト概要

**プロジェクト名：** 気ままっぷ (Kimamap)

**コンセプト：** ユーザーの「気分」と「時間」から、現在地周辺の最適なおでかけルートをAIが自動提案するモバイルアプリ

### 主要機能
1. **AIプラン作成機能** - 時間指定、気分選択、移動手段から最適ルートを提案
2. **地図表示機能** - Google Maps上でのルート・スポット表示
3. **保存機能** - お気に入り店舗・おでかけ履歴の管理
4. **AI学習機能** - ユーザーフィードバックによる提案精度向上

## 技術スタック

- **フロントエンド**: React Native (v0.79.2) + Expo (v53.0.9) + TypeScript
- **UI ライブラリ**: React Native Paper (v5.14.5)
- **地図機能**: React Native Maps (v1.20.1) + Google Maps API
- **位置情報**: Expo Location (v18.1.5)
- **ナビゲーション**: React Navigation
- **バックエンド**: Node.js + Express + Supabase (v2.49.7)
- **状態管理**: TanStack React Query (v5.76.1)
- **AI機能**: カスタムAIモデル（ルート提案・学習機能）
- **言語**: TypeScript

## コーディング規約

### 一般的な規約

- TypeScript を使用し、厳密な型定義を心がける
- 関数コンポーネントと Hooks を使用する
- ESLint/Prettier の設定に従う
- 日本語のコメントを適切に使用する

### ファイル構成

```
kimamap/
├── App.tsx                 # メインアプリケーション
├── index.ts               # エントリーポイント
├── supabaseClient.js      # Supabase設定
├── assets/                # 画像リソース
├── backend/               # バックエンド関連
├── frontend/              # フロントエンド関連
└── kimamap-server/        # サーバー関連
```

### React Native 固有の規約

- StyleSheet を使用してスタイルを定義する
- Platform.OS でプラットフォーム固有の処理を分岐する
- React Native Paper のコンポーネントを優先的に使用する
- 地図機能では react-native-maps + Google Maps API を使用する
- ナビゲーションは React Navigation を使用する

### AI機能関連

- ユーザーの気分と時間から最適ルートを提案するロジック
- ユーザーフィードバックによる学習機能の実装
- リアルタイムでのルート最適化
- 初期開発チーム向けの実現可能な複雑度で実装する

### Supabase 関連

- `supabaseClient.js`を通じて Supabase にアクセスする
- React Query を使用してデータフェッチングを管理する
- 認証、データベース操作は Supabase のベストプラクティスに従う
- お気に入り店舗・おでかけ履歴の管理機能を実装

### Node.js/Express バックエンド

- AIルート提案のためのAPI実装
- Google Maps APIとの連携処理
- ユーザーフィードバック収集・学習データ管理
- Supabaseとの連携によるデータ永続化

### 位置情報関連

- expo-location を使用して位置情報を取得する
- 位置情報の権限リクエストを適切に処理する
- プライバシーを考慮した実装を行う

## 推奨パターン

### コンポーネント作成

```typescript

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

interface ComponentProps {
  title: string;
}

export const Component: React.FC<ComponentProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### API 呼び出し（React Query 使用）

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*");

      if (error) throw error;
      return data;
    },
  });
};
```

## 注意事項

- Expo 管理ワークフローを使用しているため、ネイティブコードの変更時は expo prebuild が必要
- 位置情報機能は実機でのテストが必要
- Supabase の環境変数は適切に管理する
- 地図表示時のパフォーマンスに注意する

## デバッグ・テスト

- Expo Go または Expo Dev Client を使用
- Metro bundler のログを確認
- React Native Debugger の使用を推奨
- Flipper を使用したデバッグも可能

## デプロイメント

- EAS Build を使用してビルド
- App Store / Google Play Store への配布
- Supabase の本番環境設定
