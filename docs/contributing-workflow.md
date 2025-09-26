# 開発フロー運用ルール

このドキュメントは GitHub Project（カンバン運用）で作業する際のルールをまとめたものです。

## ブランチ戦略
- 常に `main` を最新安定状態に保つ。新しい作業ブランチは必ず `main` から分岐する。
- ブランチ名・コミットメッセージ・PRタイトルは [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) に準拠する。
  - ブランチ例: `feat/#23-search-flow`, `fix/#26-weather-retry`, `chore/#30-roadmap-review`
  - コミット例: `feat(search): add validation schema`
  - PRタイトル例: `feat: implement mock route API`
- 1ブランチ = 1 Issue/機能/修正。横断的なリファクタは専用Issueを立てるか、事前に合意する。

## Issue とカンバンの使い方
- 着手する前に GitHub Project のカードを「In Progress」へ移動し、自分をアサインする。
- Issue本文に作業範囲のチェックリストを追加し、進捗状況を可視化する。
- スコープ変更や相談事項があれば Issue コメントに追記する。

## コーディング・コミット
- コーディングスタイルは既存ルールに従う（TypeScript、2スペースインデント、ReactコンポーネントはPascalCase）。
- 新規ファイルや更新ファイルは `npm run lint`（サーバ側は `npm run lint --prefix server`）と Prettier を適用する。
- コミットは「1実装ステップ（フォームバリデーション追加、APIモック作成、UI調整 など）」ごとに行い、小さめの論理単位を保つ。
- 作業中はコンフリクト防止のため定期的に `git pull --rebase origin main` を実行する。

## Draft PR とレビュー
- 作業を開始したら早い段階で Draft PR を作成し、進捗やスクリーンショット、設計メモを共有する。
- 実装がレビュー可能になったら “Ready for review” に切り替え、チェックリスト・テスト結果・関連Issue（`Closes #xx`）をPR本文に記載する。
- PRは小さめの差分を心掛け、レビューコメントはPR上で完結させる。

## テストと確認
- 対象に応じて以下を最低限実行し、PR本文に結果を記載する。
  - フロントエンド: `npm run test`
  - サーバー: `npm test --prefix server`
- 自動テストが未整備の場合は、手動確認手順をPRに明記する。
- Draft段階でも主要フローの動作確認結果やスクリーンショットを共有する。

## Merge の流れ
1. Draft PRで進捗共有 → Ready for review へ変更
2. レビュー指摘を解消し、再度 lint/test を実行
3. 承認後に `main` をリベースマージ（`Rebase and merge` 推奨）
4. Issue をクローズし、Projectカードを「Done」に移動

運用してみて課題が出た場合は、このドキュメントを更新しつつ継続的に改善してください。
