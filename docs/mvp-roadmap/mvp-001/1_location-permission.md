# MVP-001 位置情報取得フロー仕様（ドラフト）

## 背景と目的
- `map-top` 画面の初期表示でユーザーの現在地にフォーカスした地図体験を提供する。
- 位置情報権限／取得失敗時も `config/maps.ts` の `defaultCenter`（東京駅）にフォールバックし、地図が空白にならないよう保証する。
- `Location.getLastKnownPositionAsync()` を優先して利用し、ウォームアップ中でも即時描画できるよう初期ローディングを短縮する。

## 技術スタック
- Expo SDK に含まれる `expo-location` を利用して権限リクエストと位置情報取得を行う。
- React Native から `Linking.openSettings()` を呼び出し、ユーザーを端末の設定アプリへ遷移させる導線を提供する。
- 地図描画は既存の `react-native-maps`（`MapView`）コンポーネントを使用する。

## 状態モデル
- `locationStatus`: `"loading" | "granted" | "denied" | "fallback"`。
  - `loading`: 初回の権限／位置情報チェック中。
  - `granted`: 権限を得て現在地を描画できる状態。
  - `denied`: 権限が拒否され、かつ `canAskAgain === true`。再リクエスト案内を表示する。
  - `fallback`: 権限リクエストができない (`canAskAgain === false`) または現在地取得に失敗した状態。`defaultCenter` を利用する。
- `currentLocation`: `null` または `{ latitude: number; longitude: number }`。
  - `null` の場合は座標未取得とみなし、フォールバック座標を描画。
  - 取得済みの場合は地図の `initialRegion` と追従ロジックで参照する。

## フロー概要
1. マウント時に `Location.hasServicesEnabledAsync()` を呼び、端末全体で位置情報サービスが無効なら即フォールバック (`locationStatus = "fallback"`) とし、設定アプリ案内を表示する。
2. `Location.getForegroundPermissionsAsync()` で権限状態を取得。
   - `status === "granted"` → 現在地取得へ。
   - `status !== "granted" && canAskAgain === true` → `Location.requestForegroundPermissionsAsync()` を発火し、ユーザーの選択結果に応じて分岐。
   - `status !== "granted" && canAskAgain === false` → 権限ダイアログを再表示できないため `locationStatus = "fallback"` とし、設定アプリへの導線を表示。
3. 権限取得後、まず `Location.getLastKnownPositionAsync()` を試行。
   - 値が返れば `currentLocation` に即セットし、初期描画を高速化する。
   - `null` の場合は `Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, maximumAge: 30_000 })` を await し、成功時に `currentLocation` を更新。
4. `getCurrentPositionAsync` が例外を投げた場合はエラーメッセージをログに残し、`locationStatus = "fallback"` へ遷移。画面上ではフォールバック案内とリトライボタンを表示する。
5. リトライ導線またはアプリがフォアグラウンドへ戻った際はステップ1から再実行し、権限／位置情報の変化を検知する。

## UI要件
- 権限ポップアップは `status !== "granted" && canAskAgain === true` の場合のみ表示する。
- `canAskAgain === false` または取得エラー時は地図上部にバナー／トーストを表示し、`Linking.openSettings()` を実行する「設定を開く」ボタンを提供する。
- フォールバック描画時も検索バーや天気ウィジェットは表示を維持し、地図の中心は `mapsConfig.defaultCenter` に設定する。
- ローディング中はマップ中央にスピナーを表示し、ユーザーに処理中であることを示す。

## エラーハンドリングとログ
- `PermissionStatus.denied` で `canAskAgain === false` のケース、および `hasServicesEnabledAsync()` が false のケースを QA チェックリストに記録する。
- 処理中に発生した例外内容は `console.warn` で収集し、必要に応じて Sentry 等の導入に備えた共通ハンドラへ委譲する。

## 検証観点
- iOS シミュレーター／Android エミュレーター双方で以下を確認する:
  - 権限付与 → 現在地にフォーカス。
  - 権限拒否 → フォールバック座標へ切り替わり、設定アプリ導線が表示される。
  - 権限拒否後に設定で許可 → アプリ復帰時に現在地取得へ再遷移する。
  - 位置情報サービス自体を OFF → フォールバック＋案内。
- これらの確認結果は `docs/mvp-roadmap` 配下の QA チェックリスト（`MVP-008` 連携）に転記する。

