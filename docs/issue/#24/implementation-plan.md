# MVP-003: モックルートAPIとサーバー基盤構築 - 実装計画

**Issue**: #24
**作成日**: 2025-10-23
**担当**: @massan02
**ステータス**: 実装中（Step 1完了）
**最終更新**: 2025-10-24

---

## 📋 目的

TypeScript + Expressの最小構成を整え、`POST /api/plans` エンドポイントからモックのルート候補を返せるようにする。外部AIサービスやGoogle Maps APIとの連携は本リリースで別タスクとして扱う。

---

## 🏗️ 実装ステップ（5段階）

### **Step 1: 型定義＋環境設定** ✅ 完了
**目的**: API契約とプロジェクト基盤の確立
**完了日**: 2025-10-24

**作成ファイル**:
- ✅ `src/types/api.ts` - API型定義 + Zodスキーマ
- ✅ `src/config/env.ts` - 環境変数管理
- ✅ `.env` - 環境変数ファイル
- ✅ `src/index.ts` - 仮エントリーポイント（ビルドテスト用）
- ✅ `package.json` - zod依存関係追加、joi削除

**成果物の概要**:
- ✅ リクエスト/レスポンスのTypeScript型定義（PlanRequest, PlanResponse, Route, Spot, Location）
- ✅ エラーレスポンスの型定義（ErrorCode: 6種類）
- ✅ Zodバリデーションスキーマ（座標範囲、duration検証、往復時30分以上検証）
- ✅ 環境変数の型安全な管理機構（EnvConfig クラス）
- ✅ .gitignoreに.envを追加
- ✅ ビルドテスト成功確認

---

### **Step 2: サービス層＋モックデータ**
**目的**: ビジネスロジックの実装（HTTPから独立）

**作成ファイル**:
- `src/services/plans.service.ts` - プラン生成サービス
- `src/utils/mockData.ts` - モックデータジェネレーター

**成果物の概要**:
- 入力パラメータに応じたモックルート生成ロジック
- バリデーションロジック（時間範囲、座標妥当性）
- 将来のAI連携に備えたインターフェース設計

---

### **Step 3: コントローラー＋エラーハンドリング**
**目的**: HTTPリクエスト/レスポンス処理

**作成ファイル**:
- `src/controllers/plans.controller.ts` - コントローラー
- `src/middleware/errorHandler.ts` - エラーミドルウェア

**成果物の概要**:
- HTTPリクエストをサービス層に渡す薄い層
- エラーを適切なHTTPステータスコード（4xx/5xx）に変換
- エラーメッセージコードを含めたレスポンス

---

### **Step 4: ルーティング＋Expressアプリ設定**
**目的**: HTTPエンドポイントの公開

**作成ファイル**:
- `src/routes/plans.ts` - ルーティング定義
- `src/app.ts` - Express設定

**成果物の概要**:
- `POST /api/plans` エンドポイント作成
- CORS、Helmet等のセキュリティミドルウェア設定
- ヘルスチェック `GET /health` 実装

---

### **Step 5: エントリーポイント＋動作確認**
**目的**: サーバー起動と統合テスト

**作成ファイル**:
- `src/index.ts` - エントリーポイント

**成果物の概要**:
- サーバー起動スクリプト
- 環境変数バリデーション
- 起動ログ出力

---

## 🔍 要件ヒアリング項目

以下の項目について、仕様を確定してから実装を開始します。

### **1. 型定義について** ✅ 確定

#### Q1-1: TransportMode（移動手段） ✅
**確定仕様**: `"walking" | "bicycle" | "car"`

| 移動手段 | 説明 |
|---|---|
| `walking` | 徒歩 |
| `bicycle` | 自転車 |
| `car` | 自動車 |

#### Q1-2: mood（気分）の型 ✅
**確定仕様**: `string`（自由入力）

- ユーザーが任意のテキストを入力可能
- フロント側でサジェスト等を実装する場合も、バックエンドは制約なしで受け取る

#### Q1-3: duration（時間）の範囲 ✅
**確定仕様**: 往復モードに対応した時間範囲制御

| モード | 最小時間 | 最大時間 |
|---|---|---|
| **片道** (`roundTrip: false`) | 10分 | 1日（1440分） |
| **往復** (`roundTrip: true`) | 30分 | 1日（1440分） |

**追加仕様**:
- リクエストに `roundTrip: boolean` フラグを追加
- 往復時は「移動時間（往復）+ スポット滞在時間」の合計を考慮
- バリデーション:
  ```typescript
  if (roundTrip && duration < 30) {
    return エラー: "INVALID_DURATION" (往復は最低30分必要)
  }
  if (!roundTrip && duration < 10) {
    return エラー: "INVALID_DURATION" (片道は最小10分必要)
  }
  if (duration > 1440) {
    return エラー: "INVALID_DURATION" (最大1日まで)
  }
  ```

#### Q1-4: エラーコード ✅
**確定仕様**: 以下のエラーコードを使用

```typescript
type ErrorCode =
  | "INVALID_DURATION"      // 時間範囲が不正（10分未満、1日超過、往復30分未満）
  | "INVALID_LOCATION"      // 座標が不正（範囲外、null等）
  | "INVALID_TRANSPORT"     // 移動手段が不正
  | "INTERNAL_SERVER_ERROR" // サーバー内部エラー
  | "TIMEOUT"               // 将来のAI連携用
  | "EXTERNAL_API_ERROR";   // 将来のGoogle Maps API用
```

---

### **2. モックデータについて** ✅ 確定

#### Q2-1: スポットデータの管理方法 ✅
**確定仕様**: JSON ファイルで管理

**実装方針**:
- `src/data/spots.json` にスポットデータを格納
- 気分カテゴリごとにスポットリストを定義
- `src/utils/mockData.ts` で読み込み・取得関数を実装

**メリット**:
- コードとデータの分離 → データのみ変更可能
- 非エンジニアでも編集可能
- 将来的にスポット数増加時もスケール対応しやすい

**JSON構造例**:
```json
{
  "カフェ巡り": [
    { "name": "スターバックス渋谷", "lat": 35.6595, "lng": 139.7004, "duration": 30 }
  ],
  "散歩": [
    { "name": "代々木公園", "lat": 35.6719, "lng": 139.6960, "duration": 45 }
  ]
}
```

#### Q2-2: モックデータの種類 ✅
**確定仕様**: 以下の気分カテゴリを実装

- カフェ巡り
- 散歩
- グルメ
- ショッピング
- 観光
- その他（デフォルト - 該当カテゴリなしの場合）

#### Q2-3: ポリラインの実装 ✅
**確定仕様**: 簡易実装（座標を文字列で繋げる）

**実装方針**:
- スポット間を直線で結ぶ座標列を生成
- フォーマット例: `"35.6595,139.7004;35.6654,139.7210"`
- 将来的にGoogle Maps Polyline形式への移行を想定した型定義

**メリット**:
- 実装が簡単、即座に動作確認可能
- デバッグしやすい

**注意点**:
- 道路に沿った経路ではなく直線表示
- MVP段階での動作確認用と割り切る

#### Q2-4: ルート候補の数 ✅
**確定仕様**: 常に3件のルートを返す

**実装方針**:
- 1リクエストで3件のルート候補を生成
- 各ルートは異なるスポット組み合わせ、または同じスポットでも順序を変える
- レスポンス構造: `{ routes: [ルート1, ルート2, ルート3] }`

**メリット**:
- フロント側でルート選択UIを実装・確認可能
- モックAPIは速度問題なし（AI連携なし）
- 本番のAI連携時の動作イメージを事前確認

---

### **3. データ保存について** ✅ 確定

#### Q3-1: 生成したルートの保存 ✅
**確定仕様**: MVPでは保存しない（将来実装）

**実装方針**:
- APIレスポンスのみ返却、データベースへの保存は行わない
- 将来的にユーザー履歴機能実装時に`routes`テーブルを追加予定

**メリット**:
- 実装がシンプル、動作確認に集中できる
- Supabase設定不要

#### Q3-2: リクエスト履歴のログ ✅
**確定仕様**: コンソールログのみ（開発用）

**実装方針**:
- `console.log()`でリクエスト/レスポンスを出力
- エラー時は`console.error()`でスタックトレース出力

**ログ出力例**:
```typescript
console.log('[POST /api/plans]', {
  params: req.body,
  timestamp: new Date().toISOString(),
});
console.log('[Response]', { routesCount: routes.length });
```

**メリット**:
- 開発中のデバッグが容易
- データベース不要、実装コストゼロ

---

### **4. セキュリティ・ミドルウェアについて** ✅ 確定

#### Q4-1: CORS設定 ✅
**確定仕様**: 全許可（開発・本番共通）

**実装方針**:
```typescript
import cors from 'cors';
app.use(cors({ origin: '*' }));
```

**理由**:
- MVP段階ではアクセス制限不要
- フロントエンドのドメインが未確定
- 将来的に必要に応じて特定ドメインに制限可能

**注意点**:
- 本番リリース時に再評価推奨

#### Q4-2: レートリミット ✅
**確定仕様**: 実装しない（MVPではスキップ）

**実装方針**:
- レートリミットミドルウェアは導入しない
- MVP期間中はユーザー数が限定的なため不要

**将来の実装案**:
- β版リリース時に`express-rate-limit`導入を検討
- 目安: 1分間に10-20リクエスト程度

#### Q4-3: バリデーションライブラリ ✅
**確定仕様**: Zod を使用

**実装方針**:
```typescript
import { z } from 'zod';

const planRequestSchema = z.object({
  mood: z.string(),
  duration: z.number().min(10).max(1440),
  transportMode: z.enum(['walking', 'bicycle', 'car']),
  roundTrip: z.boolean(),
  currentLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

// 型も自動生成
type PlanRequest = z.infer<typeof planRequestSchema>;
```

**メリット**:
- TypeScriptとの統合が優れている
- スキーマから型定義を自動生成
- エラーメッセージのカスタマイズが容易

---

### **5. テストについて** ✅ 確定

#### Q5-1: テストの範囲 ✅
**確定仕様**: サービス層の単体テスト + 1つのE2Eテスト

**実装方針**:

**1. サービス層の単体テスト** (`src/services/plans.service.test.ts`)
- モックルート生成ロジックのテスト
- バリデーションロジックのテスト
- エッジケース（最小時間、最大時間、不正な座標等）のテスト

**2. E2Eテスト** (`src/__tests__/api.e2e.test.ts`)
- `POST /api/plans` への実際のHTTPリクエスト
- 正常系のレスポンス検証
- エラーレスポンスの検証

**テスト構成例**:
```typescript
// サービス層テスト
describe('PlansService', () => {
  test('片道10分の最小ルートを生成', () => { ... });
  test('往復30分のルートを生成', () => { ... });
  test('無効な座標でエラー', () => { ... });
});

// E2Eテスト
describe('POST /api/plans', () => {
  test('正常なリクエストで3件のルートを返す', async () => {
    const response = await request(app)
      .post('/api/plans')
      .send({ mood: 'カフェ巡り', duration: 60, ... });
    expect(response.status).toBe(200);
    expect(response.body.routes).toHaveLength(3);
  });
});
```

#### Q5-2: Jest設定 ✅
**確定仕様**: カバレッジレポート有効、目標60-70%

**実装方針**:
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 60,
        "functions": 60,
        "lines": 60,
        "statements": 60
      }
    }
  }
}
```

**カバレッジ目標**:

| フェーズ | 目標カバレッジ | 備考 |
|---|---|---|
| **MVP（今回）** | 60-70% | ビジネスロジック重点的にカバー |
| **本番リリース** | 75%以上 | 全体的なカバレッジ向上 |

**重点テスト対象**:
- ビジネスロジック（サービス層）: 80-100%
- バリデーション: 90-100%
- ユーティリティ: 70-80%
- コントローラー: 50-70%（E2Eで担保）

---

### **6. その他** ✅ 確定

#### Q6-1: ログ出力 ✅
**確定仕様**: 環境別ログレベル

**実装方針**:

**開発環境**: リクエスト/レスポンスログ出力
```typescript
console.log('[POST /api/plans]', {
  params: req.body,
  timestamp: new Date().toISOString(),
});
console.log('[Response]', {
  statusCode: res.statusCode,
  routesCount: routes.length,
});
```

**本番環境**: 最小限（起動ログ + エラーログのみ）
```typescript
console.log('Server started on port 3000');
console.error('[Error]', {
  message: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
});
```

**切り替え方法**:
```typescript
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.log('[Request]', req.body);
}
```

#### Q6-2: 開発サーバーのポート番号 ✅
**確定仕様**: ポート3000使用

**実装方針**:
```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**ポート確認**:
- バックエンド: `3000`
- Expo (Metro Bundler): `19000`
- 競合なし ✅

#### Q6-3: フロントエンドとの型共有 ✅
**確定仕様**: 方式A（手動同期）でスタート、将来的に方式C（OpenAPI）へ移行

**実装方針**:

**MVP（今回）**: 手動同期
- バックエンド: `server/src/types/api.ts` に型定義
- フロントエンド: `app/types/api.ts` に同じ型を手動でコピー
- API変更時に両方を手動更新

**準備作業**:
- 型定義を1ファイルに集約しておく（将来の移行コスト削減）

**将来的な移行**:

| フェーズ | 方式 | 移行コスト |
|---|---|---|
| **MVP** | 方式A（手動） | - |
| **β版（5-10エンドポイント）** | 方式C（OpenAPI）へ移行 | 6-12時間 |
| **本番リリース** | 方式C必須 | - |

**移行メリット**:
- 型不一致バグの完全排除
- API仕様書の自動生成
- フロント/バック間の認識齟齬防止
- 日常のメンテナンスコスト削減

---

## ✅ 次のステップ

### ヒアリング完了 ✅

全6項目のヒアリングが完了しました。以下の実装フェーズに進みます。

### 実装フェーズ

1. **Step 1: 型定義＋環境設定**
   - Zod スキーマ定義
   - API型定義（リクエスト/レスポンス）
   - 環境変数管理

2. **Step 2: サービス層＋モックデータ**
   - JSONファイルによるスポットデータ管理
   - モックルート生成ロジック（3件固定）
   - 簡易ポリライン実装

3. **Step 3: コントローラー＋エラーハンドリング**
   - リクエスト処理
   - エラーハンドリングミドルウェア
   - コンソールログ実装

4. **Step 4: ルーティング＋Expressアプリ設定**
   - `POST /api/plans` エンドポイント
   - CORS設定（全許可）
   - ヘルスチェック

5. **Step 5: テスト＋動作確認**
   - サービス層単体テスト
   - E2Eテスト
   - カバレッジ60-70%達成確認

---

## 📝 備考

- このドキュメントは実装完了まで随時更新します
- 仕様変更があれば、このドキュメントに記録します
- 完了条件はissue#24の要件に準拠します

---

## 📅 実装進捗履歴

### 2025-10-24
**Step 1: 型定義＋環境設定 完了**
- API型定義（PlanRequest, PlanResponse, Route, Spot, Location, ErrorCode）を実装
- Zodバリデーションスキーマを実装（座標範囲、duration検証、往復時30分以上検証）
- 環境変数管理機構を実装（EnvConfig クラス）
- .env ファイル作成、.gitignore に追加
- package.json を更新（joi削除、zod追加）
- ビルドテスト成功確認

**成果物**:
- `server/src/types/api.ts`
- `server/src/config/env.ts`
- `server/.env`
- `server/src/index.ts` (仮エントリーポイント)
- `server/package.json` (更新)
- `.gitignore` (更新)
