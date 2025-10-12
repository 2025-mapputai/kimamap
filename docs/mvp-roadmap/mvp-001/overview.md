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


  5
   1. 状態整理と型追加
      - 既存の currentTemp, currentCode, loading を見直し、status: "loading" | "ready" | "denied" | "error"、
        errorReason（任意）、weather データ（気温・コード・hourly）といった構造に整える。
      - 位置情報やネットワーク対応のため、再試行フラグ／最終取得時刻なども必要なら足す。
  2. fetchロジックの分岐改修
      - 位置情報拒否時は status="denied" にし、Linking.openSettings() を利用する導線を付ける。
      - 取得失敗時は status="error" にして再試行ボタンで fetchWeatherData() を再実行。
      - 既に MapTop で権限状態を扱っているので、props で受け取るか、しばらくはウィジェット内で完結させるか方針
        を決める。
  3. UI/レイアウト調整
      - status に応じてボタン表示（スピナー／ロック／Wi-Fiオフ／天気アイコン＋気温）を切り替え。
      - Safe Area を参照し、位置が他UIと被らないよう調整。WeatherWidget の配置 props を整理し、MapTopから適切
        なマージンを渡す。
      - モーダル内のリストを FlatList 等に置き換え、温度表示に ℃、天気ラベルを用意する。
  4. 再利用しやすい関数化
      - 天気コード→ラベル／アイコン変換をユーティリティ化。
      - ローディング・エラーUIをコンポーネント内で小分けし、見た目を整理。
  5. 動作確認とドキュメント更新
      - 権限許可／拒否、ネットワークOFF で挙動確認。
      - docs/mvp-roadmap/mvp-001/5_weather-widget.md に実装状況と検証結果を追記し、必要なら MVP-008 のチェック
        リストへ反映。