import { StyleSheet } from 'react-native';
import { theme } from '../theme';

// AI機能UI用スタイル
export const aiStyles = StyleSheet.create({
  // 気分選択関連
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.md,
  },
  
  moodButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  moodButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.accent,
  },
  
  moodText: {
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
  },
  
  moodTextSelected: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  
  // AI提案表示
  suggestionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  
  suggestionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  suggestionDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  
  // ローディング状態
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  
  // フィードバック関連
  feedbackContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  
  feedbackButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  positiveButton: {
    backgroundColor: theme.colors.success,
  },
  
  negativeButton: {
    backgroundColor: theme.colors.error,
  },
});
