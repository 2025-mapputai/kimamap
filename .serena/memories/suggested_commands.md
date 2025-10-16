# 推奨コマンド

## フロントエンド開発

### 開発サーバー起動
```bash
npm start                # Expo開発サーバー起動
npm run tunnel          # トンネル経由で外部アクセス可能にして起動
npm run android         # Android開発
npm run ios             # iOS開発
```

### 依存関係
```bash
npm install             # パッケージインストール
```

## バックエンド開発

### サーバー起動
```bash
cd server
npm run dev             # tsx watchによる開発サーバー起動（ホットリロード）
npm run build           # TypeScriptをdist/にビルド
npm start               # 本番サーバー起動（dist/index.js実行）
```

### テスト・品質チェック
```bash
cd server
npm test                # Jestテスト実行
npm run lint            # ESLint実行
npm run lint:fix        # ESLint自動修正
```

### 依存関係
```bash
cd server
npm install             # パッケージインストール
```

## Git ワークフロー（Conventional Commits）

### ブランチ作成
```bash
git checkout -b feat/#23-search-flow      # 機能追加
git checkout -b fix/#26-weather-retry     # バグ修正
git checkout -b chore/#30-roadmap-review  # その他
```

### コミット例
```bash
git commit -m "feat(search): add validation schema"
git commit -m "fix(weather): handle network error"
git commit -m "chore(docs): update roadmap"
```

### PR作成前のチェック
```bash
npm run lint                    # フロントエンドlint
npm run lint --prefix server    # バックエンドlint
```

## システムコマンド（macOS/Darwin）
- `ls`, `cd`, `grep`, `find` 等の標準Unixコマンドが使用可能
- `open .` でFinderを開く
- `open -a Simulator` でiOSシミュレータを起動
