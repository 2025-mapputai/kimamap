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

### 2. 座標とポリラインの型
```ts
export type LatLng = { latitude: number; longitude: number };
export type RoutePolyline = LatLng[];
```
- `react-native-maps` の `Marker` や `Polyline` が受け取る形式に合わせて定義する。
- 共通型としてまとめることで、距離計算や座標ロジックを再利用しやすくなる。

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
- サーバー `POST /api/plans` のレスポンス仕様（`MVP-003`）を前提。
- 複数候補を扱うために配列構造を想定。

### 4. マップ上で扱う状態 `MapRouteOverlayState`
```ts
export type MapRouteOverlayState = {
  plans: RoutePlan[];            // 現在 MapTop が受け取っているルート候補一覧
  activePlanId: string | null;   // いま地図上に描画しているルートID
  focusedSpotId: string | null;  // 詳細パネルでフォーカスしているスポット（任意）
};
```
- マップ側で「どのルートを表示するか」「どのスポットが選択中か」を明示的に管理する。

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

## 実装状況
- `app/types/routes.ts` に `LatLng`, `RouteSpot`, `RoutePolyline`, `RoutePlan`, `MapRouteOverlayState` を定義済み。今後ルート関連モジュールで共通利用できる。
- `MapTop` では `routeOverlay` state を追加し、`__DEV__` 環境でダミー `RoutePlan`（皇居周辺）を流し込んでポリライン・マーカー描画を確認できる。
- `routeOverlay.activePlanId` から `activePlan` を算出し、`Polyline` と `Marker` で試験描画を行う構成。
- 本番では `MVP-004` から渡される実データを `setRouteOverlay` に流し込むだけでマップ描画が行える。

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

## 今後の連携
- `MVP-004` では検索結果から `RoutePlan[]` を生成して `MapTop` に渡す想定。ここで定義した型を `@/types/routes.ts` として共有する。
- `MVP-003` の API 設計と差異があれば調整する。
- 複数ルート比較UIなどの拡張も、`plans` と `activePlanId` を切り替えるだけで対応可能。
