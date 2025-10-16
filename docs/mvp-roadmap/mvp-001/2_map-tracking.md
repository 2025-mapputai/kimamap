# MVP-001 マップ追従・リフォーカス仕様（ドラフト）

## 背景と目的
- ホーム画面では、ユーザーが移動すると地図も一緒に動く「現在地追従」が必須。
- ユーザーが自分で地図をドラッグして別の場所を見たあとも、ワンタップで現在地に戻れる導線が必要。
- 端末のバッテリーやパフォーマンスを過度に消費しないよう、追従処理の切り替えと監視を明確にしておく。

## 使用するライブラリ
- **expo-location**: Expo が提供する位置情報ライブラリ。現在地を1回だけ取得する関数と、移動を監視し続ける関数の両方を備えている。
- **react-native-maps**: 地図を表示する `MapView` コンポーネントを提供。地図の中心をアニメーション付きで移動させる `animateCamera` メソッドや、地図が動いたあとに呼ばれる `onRegionChangeComplete` イベントを持つ。

## よく出てくる用語
- **現在地を取得する** (`getCurrentPositionAsync`): その瞬間の座標を一度だけ取得する関数。初期表示やユーザーが手動でリトライしたいときに使う。
- **現在地を監視する** (`watchPositionAsync`): 端末が移動するたびに継続的にコールバックが呼ばれる監視用の関数。追従モードが有効な間だけ動かす。
- **カメラを動かす** (`animateCamera`): `MapView` 上で地図の中心とズームを滑らかに変更する手段。アプリが自動追従で地図を動かすときに使う。
- **地域変更イベント** (`onRegionChangeComplete`): 地図の表示範囲が変わったあとに必ず呼ばれるイベント。ユーザーがドラッグした場合も、アプリが `animateCamera` を呼んだ場合も同じように発火する。

## 状態（State）の設計
| State名 | 役割 | 初期値 |
| --- | --- | --- |
| `isFollowingUser: boolean` | 現在地に自動追従しているかどうか | `true` |
| `lastAutoCentered: LatLng | null` | 直近でアプリが自動追従で中央に合わせた座標 | `null` |
| `ignoreNextRegionChange: boolean` | `animateCamera` 直後に来るイベントを無視するためのフラグ | `false` |
| `watchSubscription: LocationSubscription | null` | `watchPositionAsync` の解除ハンドル | `null` |
| `showRecenterButton: boolean` | 追従解除時に「現在地へ戻る」ボタンを表示するか | `false` |
| `currentLocation: LatLng | null` | 最新の取得済み現在地。追従解除中も更新を続ける | `null` |

`lastAutoCentered` は「アプリが最後に自動追従で合わせた場所」を記録するための値であり、「ユーザーの現在地」とは別物。名前を明確にすることで役割の混乱を避ける。

## 動きの流れ（シナリオ別）
### 1. 初期表示
1. `getCurrentPositionAsync` または `getLastKnownPositionAsync` で座標を取得。
2. `MapView` の `initialRegion` として設定し、地図を表示。
3. 追従モードを ON (`isFollowingUser = true`) にしたまま、`watchPositionAsync` を起動。

### 2. 移動時の自動追従
1. `watchPositionAsync` から新しい座標が届くたびに、`mapRef.current?.animateCamera({ center, zoom })` を実行。
2. `animateCamera` を呼ぶ直前に `ignoreNextRegionChange = true`、呼んだ後に `lastAutoCentered = center` を更新。
3. 約 300ms 後（アニメーション終了を想定）に `ignoreNextRegionChange = false` に戻す。
4. 追従中は `showRecenterButton` を `false` のまま維持。

### 3. ユーザーが地図を操作したとき
1. ユーザーがドラッグ／ピンチすると `onRegionChangeComplete` が発火。
2. このイベント内で最初に `ignoreNextRegionChange` を確認。`true` なら「さっきアプリが動かしたもの」なのでフラグを下げて終了。
3. フラグが `false` であればユーザー操作とみなし、現在の中心 (`event.nativeEvent.region`) と `lastAutoCentered` の距離を計算。
4. 距離が閾値（例: 100m）より大きい場合のみ、追従解除と判定して `isFollowingUser = false`、`showRecenterButton = true`。
5. 追従解除中も `watchPositionAsync` は止めず、`currentLocation` は更新し続ける（最新位置を後でボタンで使うため）。

### 4. 現在地へ戻るボタン
1. ボタンを押すと `isFollowingUser = true`、`showRecenterButton = false`、`ignoreNextRegionChange = true` に戻す。
2. 保存しておいた `currentLocation` に向けて `animateCamera` を呼ぶ。
3. アニメーション終了後に `ignoreNextRegionChange = false` を再設定し、追従モードを継続。

### 5. 位置情報が取得できない場合
- 権限拒否やエラーが発生したら `isFollowingUser = false` に固定し、ボタンを `disabled` にする。
- 権限が再び許可されたら初期表示のステップからやり直す。

## 追従解除の誤判定を防ぐ工夫
- `ignoreNextRegionChange` フラグで「アプリが今動かしたカメラ」を無視。
- `lastAutoCentered` と現在中心の距離を比較し、微小なズレ（SDK 内部の丸め誤差など）では解除しない。
- 閾値は実機テストで調整。徒歩想定なら 50〜100m 程度を目安にし、ズームレベルが高いモードでは値を小さくするなどの工夫も可能。

## AppState との連携
- `AppState`（React Native 標準のライフサイクル API）を使い、アプリがフォアグラウンド（`active`）に戻ってきたタイミングで `watchPositionAsync` を再開する。
- `background` や `inactive` になったら `watchSubscription?.remove()` を呼んで監視を止め、不要な位置情報取得を防ぐ。

## UI の期待値
- 追従中はボタンを表示しない。ユーザーが地図を操作した瞬間に右下へ半透明の丸型ボタン（アイコン `my-location` など）を表示。
- ボタンは 44px 以上のタップ領域を確保し、`accessibilityLabel="現在地に戻る"` を設定。
- 追従解除中のバナーやトーストで、「現在地から離れています」「戻るにはボタンを押してください」といった案内を表示しても良い。

## テスト観点
- シミュレーターの位置シミュレーションで自動追従が滑らかに動くか。
- 地図を手動で動かすと即座に追従が解除され、ボタンが表示されるか。
- ボタン押下で最新の現在地に戻り、自動追従が復活するか。
- 権限拒否時にボタンが無効化され、適切な案内が表示されるか。

## 今後の拡張メモ
- 複数ルート比較のために「追従中でもユーザーが一時的にマップをズームできる」モードを追加する場合は、`distanceInterval` や閾値の調整が必要。
- ルート描画（`Polyline`）との干渉が発生した場合は、`MapView` の `pointerEvents` や `onPanDrag` を活用して UX を改善する。

