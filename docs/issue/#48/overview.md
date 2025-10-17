責務の特定

  1. 位置情報管理 (L185-241, L125-183)
    - 権限チェック・リクエスト
    - 現在地取得・追従
    - AppState監視
    - 6つの状態管理（locationStatus, currentLocation等）
  2. 地図カメラ制御 (L305-361)
    - 自動追従/手動操作検知
    - 再センタリング処理
  3. ルートオーバーレイ (L101-105, L254-261, L428-442)
    - サンプルルート表示
    - Polyline/Marker描画
  4. UI表示 (L77-90, L363-411, L413-451)
    - ヘッダー・バナー・ボタン

  ---
  改訂版実装順序

  フェーズ0: 静的データの分離（リスク: ⭐️極小）

  理由: 動作に影響なし、コンフリクトなし
  app/constants/map.ts     ← TAB_COLOR等
  app/types/location.ts    ← LocationStatus型
  app/data/sampleRoutes.ts ← SAMPLE_ROUTE_PLAN
  推定削減: 約40行

  ---
  フェーズ1: UIコンポーネント分離（リスク: ⭐️⭐️低）

  理由: props経由で独立、副作用なし
  app/components/map/LocationBanner.tsx  ← L363-411
  app/components/map/RecenterButton.tsx  ← L444-448
  推定削減: 約70行

  テスト方法: 各コンポーネントをStorybook的に表示確認

  ---
  フェーズ2: 地図カメラ制御（リスク: ⭐️⭐️⭐️中）

  理由: ロジックが比較的シンプル、依存少ない
  // app/hooks/useMapCamera.ts
  {
    isFollowingUser,
    showRecenterButton,
    handleRecenter,
    handleRegionChangeComplete,
  }
  推定削減: 約60行

  ---
  フェーズ3: 位置情報ロジック（リスク: ⭐️⭐️⭐️⭐️高）

  理由: 最も複雑だが、前フェーズで経験値獲得済み
  // app/hooks/useLocation.ts
  {
    locationStatus,
    currentLocation,
    checkLocation,
    // ...
  }
  推定削減: 約150行