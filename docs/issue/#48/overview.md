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

  ---
  ## 実装完了報告

  ### 実装日時
  2025年10月21日

  ### 実装内容
  フェーズ0〜3を完了し、map-top.tsxの責務分離とモジュール化を実現

  #### 成果物
  1. **新規作成ファイル（7ファイル）**
     - `app/types/location.ts` - LocationStatus型定義
     - `app/constants/colors.ts` - TAB_COLOR等の定数
     - `app/data/sampleRoutes.ts` - サンプルルートデータ
     - `app/components/map/LocationBanner.tsx` - 位置情報バナーUI（98行）
     - `app/components/map/RecenterButton.tsx` - 現在地ボタンUI（41行）
     - `app/hooks/useMapCamera.ts` - 地図カメラ制御ロジック（117行）
     - `app/hooks/useLocation.ts` - 位置情報管理ロジック（175行）

  2. **修正ファイル**
     - `app/screens/map-top.tsx` - 530行 → 204行（**326行削減、61.5%減**）
     - `CLAUDE.md` - モジュール構成の説明を更新

  #### 数値成果
  | 項目 | Before | After | 改善率 |
  |------|--------|-------|--------|
  | map-top.tsx行数 | 530行 | 204行 | **-61.5%** |
  | 責務の数 | 4つ（密結合） | 1つ（地図表示） | **-75%** |
  | モジュール数 | 1ファイル | 8ファイル | +700% |
  | 再利用可能性 | ❌ | ✅ | 質的向上 |

  #### アーキテクチャ改善
  - **UI層**: LocationBanner, RecenterButton（プレゼンテーショナル）
  - **ロジック層**: useLocation, useMapCamera（カスタムフック）
  - **データ層**: types, constants, data（型定義・定数・サンプル）

  ### 完了条件チェック
  - [x] 分離したモジュールが動作する（各モジュールがmap-top.tsxで正常に動作）
  - [x] map-top.tsxの行数が削減（530→204行、326行削減）
  - [x] Issue #25で再利用可能（useLocation.tsをそのまま利用可能）
  - [ ] 手動チェックリストで確認済み（実機テスト待ち）

  ### 次のステップ
  1. 実機での動作確認（位置情報権限フロー、追従、再センタリング）
  2. Issue #25「ルート提案画面」でuseLocation.tsを再利用
  3. 必要に応じてユニットテスト追加