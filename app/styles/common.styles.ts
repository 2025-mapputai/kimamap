import { StyleSheet } from 'react-native';
import { theme } from './theme';

// 全体で再利用される共通スタイル定義
export const commonStyles = StyleSheet.create({
  // レイアウト関連
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  containerWithPadding: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // カード・サーフェス関連
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.small,
  },
  
  // テキスト関連
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  body: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7,
  },
  
  // ボタン関連
  buttonContainer: {
    marginVertical: theme.spacing.sm,
  },
  
  // インプット関連
  inputContainer: {
    marginVertical: theme.spacing.sm,
  },
  
  // スペーシング
  marginTop: {
    marginTop: theme.spacing.md,
  },
  marginBottom: {
    marginBottom: theme.spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: theme.spacing.md,
  },
  paddingVertical: {
    paddingVertical: theme.spacing.md,
  },
});
