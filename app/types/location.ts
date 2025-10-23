/**
 * 位置情報取得ステータス
 * - loading: 取得中
 * - granted: 許可済み・取得成功
 * - denied: ユーザーが許可拒否
 * - fallback: サービス無効・エラー等でフォールバック
 */
export type LocationStatus = "loading" | "granted" | "denied" | "fallback";

/**
 * フォールバック理由
 */
export type FallbackReason =
  | "services-disabled"      // 位置情報サービスOFF
  | "permission-blocked"     // 設定でブロック
  | "permission-denied"      // ユーザー拒否
  | "position-error"         // 位置取得エラー
  | "position-unavailable"   // 位置情報取得不可
  | "unknown-error";         // 不明なエラー
