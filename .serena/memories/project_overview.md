# Kimamap プロジェクト概要

## プロジェクトの目的
**気ままっぷ (Kimamap)** は、ユーザーの「気分」と「時間」から現在地周辺の最適なおでかけルートをAIが自動提案するReact Nativeモバイルアプリケーション。

## 主要機能
- AIプラン作成機能（時間指定、気分選択、移動手段からルート提案）
- 地図表示機能（Google Maps上でのルート・スポット表示）
- 保存機能（お気に入り店舗・おでかけ履歴の管理）
- AI学習機能（ユーザーフィードバックによる提案精度向上）
- 天気情報表示（WeatherWidgetによる現在天気・24時間予報）

## 技術スタック

### フロントエンド
- React Native 0.79.2 + Expo 53.0.9 + TypeScript
- React Navigation v7（Bottom Tabs + Stack Navigator）
- React Native Maps 1.20.1 + Google Maps API
- Expo Location 18.1.5（位置情報）
- React Native Paper 5.14.5（UIライブラリ）
- Supabase 2.49.7（認証・データベース）

### バックエンド
- Node.js + Express + TypeScript
- Supabase（データベース・認証）
- Google Maps API（ルート生成）
- AI API連携（未実装）

## アーキテクチャ
- **ナビゲーション**: App.tsx でStack Navigator（Main, Search）→ Mainタブ内でBottom Tab Navigator（Map, 保存済み, マイページ）
- **位置情報**: app/screens/map-top.tsx で権限管理、リアルタイム追従、AppState監視を実装
- **型定義**: App.tsx（ナビゲーション型）、app/types/routes.ts（ルート・スポット型）
- **設定管理**: config/ ディレクトリ（env.ts, supabase.ts, maps.ts）

## 現状（2025年1月時点）
- 実装済み: 位置情報、地図表示、天気ウィジェット、ナビゲーション
- 未実装: AIプラン生成、認証機能、データ保存、バックエンドAPI
