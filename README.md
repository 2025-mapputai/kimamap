# ディレクトリ詳細
kimamap/
├── 📱 app/                           # React Native アプリケーション
│   ├── components/                   # 再利用可能なコンポーネント
│   │   ├── ui/                      # UIコンポーネント（ボタン、カード等）
│   │   ├── maps/                    # 地図関連コンポーネント
│   │   └── ai/                      # AI機能関連コンポーネント
│   ├── screens/                     # 画面コンポーネント
│   ├── navigation/                  # ナビゲーション設定
│   ├── hooks/                       # カスタムフック
│   ├── utils/                       # ユーティリティ関数
│   ├── types/                       # TypeScript型定義
│   └── constants/                   # 定数定義
│
├── 🌐 server/                        # Node.js + Express API サーバー
│   ├── src/
│   │   ├── controllers/             # APIコントローラー
│   │   ├── services/                # ビジネスロジック
│   │   │   ├── ai/                  # AI関連サービス
│   │   │   ├── maps/                # Google Maps API連携
│   │   │   └── location/            # 位置情報処理
│   │   ├── middleware/              # Express ミドルウェア
│   │   ├── routes/                  # APIルート定義
│   │   ├── types/                   # サーバー側型定義
│   │   └── utils/                   # サーバー側ユーティリティ
│   ├── package.json
│   └── tsconfig.json
│
├── 🗄️ database/                      # Supabase関連
│   ├── migrations/                  # データベーススキーマ
│   ├── seeds/                       # 初期データ
│   └── types/                       # データベース型定義
│
├── 🔧 config/                        # 設定ファイル
│   ├── supabase.ts                  # Supabase設定
│   ├── maps.ts                      # Google Maps設定
│   └── env.ts                       # 環境変数管理
│
├── 🎨 assets/                        # 静的リソース
│   ├── images/                      # 画像ファイル
│   ├── icons/                       # アイコン
│   └── fonts/                       # カスタムフォント
│
├── 📚 docs/                          # ドキュメント
│   ├── api/                         # API仕様書
│   └── development/                 # 開発ガイド
│
├── 🧪 __tests__/                     # テストファイル
│   ├── app/                         # アプリテスト
│   └── server/                      # サーバーテスト
│
├── App.tsx                          # メインアプリケーション
├── index.ts                         # エントリーポイント
├── app.json                         # Expo設定
├── package.json                     # 依存関係
├── tsconfig.json                    # TypeScript設定
└── README.md                        # プロジェクト説明
# kimamap