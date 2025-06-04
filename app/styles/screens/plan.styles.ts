import { StyleSheet } from 'react-native';
import { theme } from '../theme';

// プラン作成画面用スタイル
export const planStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  
  stepContainer: {
    marginBottom: theme.spacing.xl,
  },
  
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  stepNumberText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  
  stepTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  
  // 時間設定
  timeContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  
  timeButton: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  timeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.accent,
  },
  
  timeButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  
  timeButtonTextSelected: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  
  // 移動手段選択
  transportContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  transportOption: {
    width: '30%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  transportOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.accent,
  },
  
  transportIcon: {
    marginBottom: theme.spacing.sm,
  },
  
  transportText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
  
  transportTextSelected: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  
  // アクションボタン
  actionContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  
  generateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  
  generateButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  
  generateButtonDisabled: {
    backgroundColor: theme.colors.surface,
  },
  
  generateButtonTextDisabled: {
    color: theme.colors.text,
    opacity: 0.5,
  },
});
