# タスク完了時のチェックリスト

## コード品質チェック

### 1. Lint実行
```bash
# フロントエンド
npm run lint

# バックエンド
npm run lint --prefix server
npm run lint:fix --prefix server  # 自動修正
```

### 2. テスト実行（該当する場合）
```bash
# バックエンド
cd server
npm test
```

### 3. 型チェック
- TypeScriptコンパイルエラーがないことを確認
- `any`型を使用していないことを確認

## Git コミット

### Conventional Commits形式
```bash
# 機能追加
git commit -m "feat(component): add new feature"

# バグ修正
git commit -m "fix(api): handle edge case"

# ドキュメント
git commit -m "docs(readme): update setup instructions"

# リファクタリング
git commit -m "refactor(utils): simplify helper function"

# その他
git commit -m "chore(deps): update dependencies"
```

## PR作成前の確認事項

### 1. ブランチ戦略（docs/contributing-workflow.md参照）
- mainから分岐しているか
- ブランチ名が規約に準拠（例: `feat/#23-search-flow`）

### 2. コード確認
- [ ] ESLint/Prettierエラーなし
- [ ] TypeScriptコンパイルエラーなし
- [ ] 不要なconsole.log削除
- [ ] コメントアウトされたコード削除
- [ ] 日本語コメント適切に追加

### 3. 機能確認
- [ ] iOS実機/シミュレータで動作確認（位置情報機能の場合は実機必須）
- [ ] Android実機/エミュレータで動作確認
- [ ] 権限拒否時のフォールバック動作確認
- [ ] エラーハンドリング確認

### 4. ドキュメント更新
- [ ] CLAUDE.md更新（アーキテクチャ変更の場合）
- [ ] README.md更新（セットアップ手順変更の場合）
- [ ] docs/mvp-roadmap/ 更新（MVP進捗の場合）

### 5. PR本文
- [ ] 変更内容の概要記載
- [ ] 関連Issue番号記載（`Closes #xx`）
- [ ] スクリーンショット添付（UI変更の場合）
- [ ] テスト結果記載

## リベースとマージ

### コンフリクト防止
```bash
# 定期的にmainをリベース
git pull --rebase origin main
```

### マージ方法
- GitHub上で「Rebase and merge」を推奨

## 環境変数・機密情報

### 確認事項
- [ ] API Keyがコードにハードコードされていない
- [ ] .envファイルが.gitignoreに含まれている
- [ ] app.jsonのAPI Key管理方法を確認（本番では環境変数化）

## 特記事項（Kimamap固有）

### Expo関連
- [ ] ネイティブコード変更時は`expo prebuild`実行
- [ ] Expo SDK 53の制約を考慮

### 位置情報機能
- [ ] 実機でテスト済み
- [ ] 権限拒否時のフォールバック実装確認
- [ ] watchSubscriptionのクリーンアップ実装確認

### 地図機能
- [ ] パフォーマンス確認（Polyline/Marker数）
- [ ] デフォルト中心座標のフォールバック確認
