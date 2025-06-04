import { StyleSheet } from 'react-native';
import { theme } from '../theme';

// 地図コンポーネント用スタイル
export const mapsStyles = StyleSheet.create({
  // 地図コンテナ
  mapContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  
  mapView: {
    flex: 1,
  },
  
  // マーカー関連
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  customMarker: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
    ...theme.shadows.small,
  },
  
  // コントロール関連
  mapControls: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.md,
    flexDirection: 'column',
  },
  
  mapButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    ...theme.shadows.medium,
  },
  
  // ルート表示
  routeInfo: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  
  // 現在地ボタン
  locationButton: {
    position: 'absolute',
    bottom: theme.spacing.xxl,
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
});
