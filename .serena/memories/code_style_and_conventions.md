# コードスタイル・規約

## 基本原則
- TypeScriptの厳密な型定義を使用
- 関数コンポーネントとHooksを使用
- React Native Paperコンポーネントを優先使用
- 日本語コメントを適切に使用
- ESLint/Prettier設定に従う
- Conventional Commits準拠（docs/contributing-workflow.md参照）

## TypeScript
- 厳密な型定義を使用
- `any`型の使用を避ける
- 型定義ファイルは専用ディレクトリ（app/types/, server/src/types/）に配置

## React Native固有

### スタイル定義
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

### プラットフォーム分岐
```typescript
import { Platform } from 'react-native';

const padding = Platform.OS === 'ios' ? 16 : 12;
```

### 地図コンポーネント
```typescript
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

<MapView provider={PROVIDER_GOOGLE} ... />
```

### Safe Area対応
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
const paddingTop = insets.top + 16;
```

## 位置情報処理パターン

app/screens/map-top.tsx を参照パターンとする：

### 権限状態管理
```typescript
type LocationStatus = 'loading' | 'granted' | 'denied' | 'fallback';
```

### 権限取得フロー
```typescript
const { status } = await Location.getForegroundPermissionsAsync();
if (status !== Location.PermissionStatus.GRANTED) {
  const result = await Location.requestForegroundPermissionsAsync();
}
```

### 現在地取得
```typescript
// 1. キャッシュ確認
const lastKnown = await Location.getLastKnownPositionAsync({maxAge: 30_000});
// 2. 新規取得
const position = lastKnown ?? await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High,
});
```

### リアルタイム追従
```typescript
const subscription = await Location.watchPositionAsync(
  {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 15,      // 15m移動で更新
    timeInterval: 1000,        // 1秒ごとに更新
  },
  (location) => {
    // 位置更新処理
  }
);

// クリーンアップ
useEffect(() => {
  return () => {
    subscription?.remove();
  };
}, []);
```

### AppState監視
```typescript
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') {
      checkLocation();
    }
  });
  return () => subscription.remove();
}, []);
```

## 命名規則
- コンポーネント: PascalCase（例: `MapTop`, `WeatherWidget`）
- 関数・変数: camelCase（例: `handleRecenter`, `currentLocation`）
- 型定義: PascalCase（例: `RoutePlan`, `LocationStatus`）
- 定数: UPPER_SNAKE_CASE（例: `TAB_COLOR`, `SAMPLE_ROUTE_PLAN`）
- ファイル名: kebab-case（例: `map-top.tsx`, `weather-widget.tsx`）

## ディレクトリ構造
- app/components/ - 再利用可能なコンポーネント
- app/screens/ - 画面コンポーネント
- app/types/ - TypeScript型定義
- app/hooks/ - カスタムフック（未使用）
- config/ - 設定ファイル（env, supabase, maps）
- server/src/ - バックエンドコード（未実装）

## コメント
- 複雑なロジックには日本語コメントを記述
- 関数の目的は関数名で表現し、必要な場合のみコメント追加
- TODOコメントは具体的な内容を記載
