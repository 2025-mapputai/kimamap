import { StyleSheet } from 'react-native';
import { theme } from '../theme';

// 地図表示画面用スタイル
export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  mapContainer: {
    flex: 1,
  },
  
  // 上部情報パネル
  infoPanel: {
    position: 'absolute',
    top: theme.spacing.xxl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  
  infoPanelTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  infoPanelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
    marginTop: theme.spacing.xs,
  },
  
  // 下部スポットリスト
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '40%',
    ...theme.shadows.medium,
  },
  
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: theme.spacing.md,
  },
  
  spotList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  
  spotItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  
  spotNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  spotNumberText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  
  spotInfo: {
    flex: 1,
  },
  
  spotName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  spotDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
  },
  
  spotTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.md,
  },
  
  // フローティングアクションボタン
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing.xxl + 80, // bottomSheetの上に配置
    right: theme.spacing.md,
    flexDirection: 'column',
  },
  
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  
  fabSecondary: {
    backgroundColor: theme.colors.secondary,
  },
});
