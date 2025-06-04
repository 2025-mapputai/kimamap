import { StyleSheet } from 'react-native';
import { theme } from '../theme';

// ホーム画面用スタイル
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.background,
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.background,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    opacity: 0.9,
  },
  
  quickActionContainer: {
    padding: theme.spacing.lg,
  },
  
  quickActionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  quickActionCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  
  quickActionIcon: {
    marginBottom: theme.spacing.sm,
  },
  
  quickActionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  
  recentSection: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  recentItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  recentItemText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  
  recentItemTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  recentItemDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
    marginTop: theme.spacing.xs,
  },
});
