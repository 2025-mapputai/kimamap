import { StyleSheet } from 'react-native';
import { theme } from '../theme';

// プロフィール・履歴画面用スタイル
export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
  },
  
  // プロフィールヘッダー
  profileHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.background,
    marginBottom: theme.spacing.xs,
  },
  
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: theme.spacing.md,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.background,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  
  // メニューセクション
  menuSection: {
    backgroundColor: theme.colors.background,
    marginTop: -theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.xl,
    flex: 1,
  },
  
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  
  menuIcon: {
    marginRight: theme.spacing.md,
  },
  
  menuText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  
  menuArrow: {
    opacity: 0.5,
  },
  
  // 履歴セクション
  historyItem: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  historyTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  historyDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
  },
  
  historyDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  historyStat: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  
  // お気に入りアイテム
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  
  favoriteInfo: {
    flex: 1,
  },
  
  favoriteName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  favoriteCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
  },
  
  favoriteRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  
  ratingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent,
    marginLeft: theme.spacing.xs,
  },
});
