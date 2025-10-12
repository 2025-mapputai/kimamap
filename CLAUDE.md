# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**気ままっぷ (Kimamap)** は、ユーザーの「気分」と「時間」から現在地周辺の最適なおでかけルートをAIが自動提案するReact Nativeモバイルアプリケーションです。Express.jsバックエンドサーバーを使用してAI機能とGoogle Maps APIを統合しています。

### 主要機能
- **AIプラン作成機能** - 時間指定、気分選択、移動手段から最適ルートを提案
- **地図表示機能** - Google Maps上でのルート・スポット表示
- **保存機能** - お気に入り店舗・おでかけ履歴の管理
- **AI学習機能** - ユーザーフィードバックによる提案精度向上
- **天気情報表示** - WeatherWidgetによる天気情報表示

## アーキテクチャ

### ナビゲーション構造
- **ルートレベル**: `App.tsx`でStack Navigator（Main, Search）を定義
- **Mainタブ**: Bottom Tab Navigator（Map, 保存済み, マイページ）
- **型定義**: `App.tsx`内で`MainTabParamList`と`RootStackParamList`を定義
- **画面遷移**: MapTopの検索バー→Searchスクリーンへスタック遷移

### 地図機能の設計
- **位置情報管理**: `app/screens/map-top.tsx`で以下を実装
  - `expo-location`による権限管理とリアルタイム追従
  - 状態: `loading | granted | denied | fallback` + フォールバック理由
  - `watchPositionAsync`による継続的な位置更新
  - ユーザー操作検知による追従解除＋「現在地」ボタン表示
- **ルート描画**: `app/types/routes.ts`で型定義済み
  - `RoutePlan`, `RouteSpot`, `RoutePolyline`型
  - `MapRouteOverlayState`で複数プラン・アクティブプラン・フォーカススポットを管理
  - 開発環境ではサンプルルート（皇居周辺）を表示

### 設定管理
- **config/env.ts**: 環境変数の型安全なアクセスと検証関数
- **config/supabase.ts**: Supabaseクライアント初期化とDatabase型エクスポート
- **config/maps.ts**: Google Maps設定（デフォルト中心座標等）

### 現状分析（2025年1月時点）

#### チーム構成・習熟度
- **テックリード**: React Native経験あり、TypeScript半年、Expo/Supabase初心者レベル
- **他メンバー4名**: JavaScript勉強中、React Native/TypeScript未経験
- **AI機能経験**: 全員なし（テックリードがAPI連携予定）

#### 実装済み機能
- **位置情報**: 権限フロー、リアルタイム追従、AppState監視による再チェック
- **地図表示**: Google Maps + ルート描画用型定義 + サンプルルート表示
- **天気ウィジェット**: 現在天気・24時間予報（app/components/weather/WeatherWidget.tsx）
- **ナビゲーション**: タブ＋スタック構造完成

#### 未実装・課題
- **AIプラン生成**: バックエンドAPI未実装
- **認証機能**: Googleログイン実装
- **データ保存**: Supabase DB操作（お気に入り・履歴）
- **バックエンドAPI**: 全エンドポイント未実装

## 技術スタック

### 確定技術
- **フロントエンド**: React Native (v0.79.2) + Expo (v53.0.9) + TypeScript
- **UIライブラリ**: React Native Paper (v5.14.5)
- **地図機能**: React Native Maps (v1.20.1) + Google Maps API
- **位置情報**: Expo Location (v18.1.5)
- **ナビゲーション**: React Navigation v7 (Bottom Tabs + Stack)
- **バックエンド**: Node.js + Express + Supabase (v2.49.7)
- **データベース**: Supabase

### 検討中技術
- **状態管理**: TanStack React Query（使用可否検討中）

## 開発コマンド

### フロントエンド（React Native + Expo）
```bash
# 開発サーバー起動
npm start                # Expo開発サーバー起動
npm run tunnel          # トンネル経由で外部アクセス可能にして起動
npm run android         # Android開発
npm run ios             # iOS開発

# 依存関係
npm install             # パッケージインストール
```

### バックエンド（サーバー）
```bash
cd server

# 開発
npm run dev             # tsx watchによる開発サーバー起動（ホットリロード）
npm run build           # TypeScriptをdist/にビルド
npm start               # 本番サーバー起動（dist/index.js実行）

# コード品質
npm test                # Jestテスト実行
npm run lint            # ESLint実行
npm run lint:fix        # ESLint自動修正

# 依存関係
npm install             # パッケージインストール
```

### 開発フロー（Conventional Commits準拠）
```bash
# ブランチ作成（mainから分岐）
git checkout -b feat/#23-search-flow

# コミット例
git commit -m "feat(search): add validation schema"
git commit -m "fix(weather): handle network error"
git commit -m "chore(docs): update roadmap"

# PR作成前
npm run lint            # フロントエンド
npm run lint --prefix server  # バックエンド
```

## 重要な設定ファイル

- **フロントエンド設定**: `config/supabase.ts`、`config/maps.ts`、`config/env.ts`
- **TypeScript**: ルート `tsconfig.json`（Expoベース）、`server/tsconfig.json`（Node.js）
- **Expo設定**: `app.json`（Google Maps API Key等を含む）
- **ナビゲーション型**: `App.tsx`内で定義（`MainTabParamList`, `RootStackParamList`）
- **ルート型**: `app/types/routes.ts`（`RoutePlan`, `RouteSpot`, `MapRouteOverlayState`）

## 環境変数

フロントエンド環境変数は `EXPO_PUBLIC_` プレフィックスを使用：
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
- `EXPO_PUBLIC_API_URL`（デフォルト: `http://localhost:3000`）
- `EXPO_PUBLIC_ENVIRONMENT`（development/production）

**注意**: `app.json`にiOS用Google Maps API Keyをハードコードしている（本番では`.env`管理推奨）

## コーディング規約

### 基本原則
- TypeScriptの厳密な型定義を使用
- 関数コンポーネントとHooksを使用
- React Native Paperコンポーネントを優先使用
- 日本語コメントを適切に使用
- ESLint/Prettier設定に従う
- Conventional Commits準拠（`docs/contributing-workflow.md`参照）

### React Native固有
- StyleSheetを使用してスタイル定義
- Platform.OSでプラットフォーム固有処理を分岐
- `react-native-maps` + `PROVIDER_GOOGLE`を使用
- `useSafeAreaInsets()`でSafe Area対応

### 位置情報処理パターン
`app/screens/map-top.tsx`を参照パターンとする：
- 権限状態を`loading | granted | denied | fallback`で管理
- `getForegroundPermissionsAsync` → `requestForegroundPermissionsAsync`の順で処理
- `getLastKnownPositionAsync` → `getCurrentPositionAsync`で現在地取得
- `watchPositionAsync`でリアルタイム追従（`distanceInterval: 15`m, `timeInterval: 1000`ms）
- `AppState`監視で復帰時に権限再チェック
- アンマウント時は必ず`watchSubscription.remove()`でクリーンアップ

### データ管理
- `config/supabase.ts`経由でSupabaseアクセス
- `config/env.ts`で環境変数を型安全に取得
- 状態管理方法は要検討（React Query導入可否含む）

## 開発支援ツール（Spec Kit）

- **`.claude/commands/`**: Claude Code専用コマンド（`/plan`、`/specify`、`/tasks`）
- **`scripts/`**: 開発作業自動化スクリプト
- **`templates/`**: プロジェクト標準テンプレート（plan-template.md等）
- **`memory/`**: プロジェクト憲法と更新チェックリスト
- **`docs/mvp-roadmap/`**: MVP実装ロードマップ（mvp-001が進行中）
- **`docs/contributing-workflow.md`**: ブランチ戦略・Issue運用ルール

## 重要な注意点

### Expo関連
- Expo管理ワークフロー使用のため、ネイティブコード変更時は`expo prebuild`が必要
- Expo SDK 53使用（`newArchEnabled: true`）
- 位置情報機能は実機でのテストが必要（シミュレータでは制限あり）

### 地図・位置情報
- Google Maps API Keyは`app.json`（iOS）と環境変数（Android）で管理
- 地図表示時のパフォーマンスに注意（Polyline・Marker数を最適化）
- プライバシーを考慮した位置情報処理の実装
- 権限拒否時のフォールバック（デフォルト中心座標: 東京駅周辺）を必ず実装

### プロジェクト構造
- ディレクトリ構造は機能実装時に動的に作成する方針
- `app/`配下は機能別ディレクトリ（components, screens, types, hooks等）
- サーバー側は未実装のため、必要に応じて`server/src/`配下を構築