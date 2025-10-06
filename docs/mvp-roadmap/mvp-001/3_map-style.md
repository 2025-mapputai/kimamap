# MVP-001 マップスタイル適用検討（ドラフト）

## 背景
- `config/maps.ts` には Google Map のスタイルをカスタマイズする `mapStyles` 配列が定義されている。
- 現在の `MapTop` 画面では `MapView` に `customMapStyle` が渡されておらず、スタイルは未使用。
- MVP デザインでは標準の Google Map 表示を前提とし、カスタム配色やアイコン非表示の要件は特に定まっていない。

## 調査結果
- `rg "mapStyles"` の結果、宣言箇所以外で参照がなく未使用であることを確認した。
- `mapStyles` の内容は以下の2ルールのみで構成されている:
  1. 地形や道路のベースカラーを `#f5f5f5`（淡いグレー）に変更する。
  2. ラベル用アイコンを `visibility: "off"` で非表示にする。
- Expo / `react-native-maps` では `customMapStyle` プロップで適用できるが、適用しなければデフォルトの Google Map 表示が保持される。

## 方針
- MVP ではデフォルトの Google Map 表示を利用する。
- 未使用の `mapStyles` 定義は削除し、必要になった時点で改めて導入する。
  - 削除対象: `config/maps.ts` 内の `mapStyles` 定義と `mapStyles` エクスポート。
  - 依存箇所は現時点で存在しないため副作用はない。

## 今後のメモ
- 将来的にブランドカラーやダークモード対応を行う場合は、Google Map スタイルエディタで JSON を生成し、`customMapStyle` に渡す形で再導入する。
- テーマ切り替えを想定するなら `mapStyles.light` / `mapStyles.dark` などの構造を設計し、`MapTop` 側で条件によって差し替える。

