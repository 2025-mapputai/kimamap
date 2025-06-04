# ディレクトリ構成移行ガイド

## 新しいディレクトリ構成

このプロジェクトは最適化されたディレクトリ構成に移行されました。

### 主要な変更点

1. **`app/`** - React Native アプリケーション
   - コンポーネント、画面、スタイルの統合管理
   - 機能別ディレクトリ構成

2. **`server/`** - Node.js + Express API サーバー
   - AI機能とGoogle Maps API連携
   - Supabaseとの統合

3. **`config/`** - 設定ファイルの一元管理
   - Supabase、Google Maps、環境変数

4. **`database/`** - データベース関連
   - マイグレーション、シード、型定義

### 移行済みファイル

- `supabaseClient.js` → `config/supabase.ts`
- スタイルファイルの体系化
- 型定義の整理

### 次のステップ

1. 既存コードの移行
2. インポートパスの更新
3. テストの実行
4. ドキュメントの更新

## 使用方法

```bash
# 開発サーバー起動
npm run start

# サーバー開発
cd server && npm run dev

# テスト実行
npm test
```

