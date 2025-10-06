# MVP-001 ルート表示用データ構造（ドラフト）

## 背景
- `MVP-004` で実装予定のルート提案画面は、検索結果として「複数のルート候補」を返す想定。
- `MapTop` では該当ルートのスポットをマーカー表示し、スポット間を線（ポリライン）で結ぶ描画を行えるようにしたい。
- API とのデータ受け渡しを迷わず進めるため、TypeScript の型と state の構造を事前に整理する。

## 主要な型定義
### 1. スポット単位の型 `RouteSpot`
```ts
export type RouteSpot = {
  id: string;            // マーカー描画やリスト表示で使う安定したID
  name: string;          // スポット名
  description: string;   // 説明文（カードUIなどで使用）
  stayMinutes: number;   // 滞在を想定している時間（分）
  latitude: number;      // 緯度
  longitude: number;     // 経度
};
```
- API 側（`MVP-003`）のレスポンスも `name`, `description`, `stayMinutes`, `lat`, `lng` などを返す想定のため、両者の契約を合わせやすい。
- React では `key` に `id` を指定するので、安定した ID を含めておくとマーカーやリストの再描画が安全になる。

### 2. 座標とポリラインの型
```ts
export type LatLng = { latitude: number; longitude: number };
export type RoutePolyline = LatLng[];
```
- `react-native-maps` の `Marker` や `Polyline` は `{ latitude, longitude }` 形式の座標を要求する。
- 定義を一箇所にまとめることで、座標に関わるロジック（距離計算や中央位置の算出など）を共通化しやすい。
- 将来的に GeoJSON など別形式を扱いたくなった場合も、ここで型を差し替えれば影響範囲を抑えられる。

### 3. ルート全体の型 `RoutePlan`
```ts
export type RoutePlan = {
  id: string;
  title: string;
  summary: string;
  totalDuration: number;      // ルート全体の所要時間（分など）
  spots: RouteSpot[];
  polyline: RoutePolyline;    // マーカーを結ぶ線用の座標群
};
```
- サーバー `POST /api/plans` のレスポンス仕様（`MVP-003`）を前提に構成。
- 将来の「複数候補」表示を見据え、単数形の `RoutePlan` と複数形の `RoutePlan[]` を扱えるようにする。
- `summary` や `totalDuration` は下部カード UI での表示を想定。

### 4. マップ上で扱う状態 `MapRouteOverlayState`
```ts
export type MapRouteOverlayState = {
  plans: RoutePlan[];            // 現在 MapTop が受け取っているルート候補一覧
  activePlanId: string | null;   // いま地図上に描画しているルートID
  focusedSpotId: string | null;  // 詳細パネルでフォーカスしているスポット（任意）
};
```
- マップ側で「どのルートを表示するか」「どのスポットが選択中か」を明示的に管理する。
- ルートが3件程度返る場合でも、`plans` に配列として保持し、`activePlanId` を切り替えるだけで地図描画を更新できる。
- スポット詳細カードを開いたときに `focusedSpotId` をセットすれば、マーカーのハイライトやスクロール位置と連携できる。

## 状態構造のイメージ
```
MapRouteOverlayState
 ├─ plans: RoutePlan[]
 │   ├─ RoutePlan
 │   │   ├─ spots: RouteSpot[]
 │   │   └─ polyline: RoutePolyline
 │   └─ ... (他候補)
 ├─ activePlanId
 └─ focusedSpotId
```
- 階層構造が明確になることで、`MapTop` は `activePlanId` から現在描画すべき `RoutePlan` を取得し、`RouteSpot` や `RoutePolyline` をそのまま `Marker` / `Polyline` に渡せる。
- ルート候補が空の場合は `plans.length === 0` を見れば判定できる。

## ダミーデータ例
```ts
const sampleRoute: RoutePlan = {
  id: "plan-001",
  title: "銀座ぶらり散歩",
  summary: "銀座エリアでカフェと散歩を楽しむプラン",
  totalDuration: 120,
  spots: [
    {
      id: "spot-1",
      name: "銀座三越",
      description: "買い物に最適な百貨店",
      stayMinutes: 60,
      latitude: 35.671,
      longitude: 139.764,
    },
    {
      id: "spot-2",
      name: "歌舞伎座",
      description: "伝統芸能を楽しめる劇場",
      stayMinutes: 60,
      latitude: 35.669,
      longitude: 139.767,
    },
  ],
  polyline: [
    { latitude: 35.671, longitude: 139.764 },
    { latitude: 35.669, longitude: 139.767 },
  ],
};
```
- このダミーデータを使えば、`RoutePlan` 型が期待通りに定義されているか、`Marker` と `Polyline` で描画できるかを事前に確認できる。

## 今後の連携
- `MVP-004` では検索結果から `RoutePlan[]` を生成して `MapTop` に渡す想定。ここで定義した型を `@/types/routes.ts` などに切り出して共有する。
- `MVP-003` の API 設計と差異が出た場合は、双方の仕様を揃えるよう相談する。
- 将来的に複数ルート比較UI（カルーセルなど）を実装する場合でも、`MapRouteOverlayState` の `plans` と `activePlanId` を切り替えるだけで対応できる。

