1. まず位置情報許可フローとフォールバック挙動（初回起動、再試行、権限変更時など）の仕様を押さえます。
2. 次にマップの現在地追従とリフォーカス UI の要件を決め、必要な UX/状態管理を整理します。
3. 続いて config/maps.ts のスタイル適用とテーマ調整の要件を固め、MVP としてどこまで反映するか確認します。
4. その後にルート描画用 state と TypeScript 型の構造を設計し、MVP-004 が利用できる契約を決定します。
5. 天気ウィジェットの配置・重なりとローディング/エラー時の UI 調整を詰め、マップとの兼ね合いを明確にします。
6. 最後に iOS/Android での検証手順と既知制約の記載先を決め、README や Issue 更新の方針をまとめます。

1. - 位置情報サービス有効かをチェックし、無効なら即フォールバック＋設定案内を表示
  - getForegroundPermissionsAsync → requestForegroundPermissionsAsync の分岐を実装し、状態を loading/granted/denied/fallback で管理
  - getLastKnownPositionAsync → getCurrentPositionAsync の順で現在地を取得し、成功なら MapView の初期中心を現在地に設定
  - 権限拒否・取得失敗時は mapsConfig.defaultCenter を使用してマップを表示し、ユーザーへフォールバックメッセージを提示
  - AppState 監視またはリトライ導線で権限状態を再チェックし、許可に変わったときは自動で現在地取得に再トライ