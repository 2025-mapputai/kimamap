import { z } from 'zod';

/**
 * 移動手段の型定義
 */
export type TransportMode = 'walking' | 'bicycle' | 'car';

/**
 * エラーコードの型定義
 */
export type ErrorCode =
  | 'INVALID_DURATION'      // 時間範囲が不正（10分未満、1日超過、往復30分未満）
  | 'INVALID_LOCATION'      // 座標が不正（範囲外、null等）
  | 'INVALID_TRANSPORT'     // 移動手段が不正
  | 'INTERNAL_SERVER_ERROR' // サーバー内部エラー
  | 'TIMEOUT'               // 将来のAI連携用
  | 'EXTERNAL_API_ERROR';   // 将来のGoogle Maps API用

/**
 * 位置情報の型定義
 */
export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * プラン生成リクエストの型定義
 */
export interface PlanRequest {
  mood: string;
  duration: number;
  transportMode: TransportMode;
  roundTrip: boolean; //往復チェック
  currentLocation: Location;
}

/**
 * スポット情報の型定義
 */
export interface Spot {
  name: string;
  stayMinutes: number;
  latitude: number;
  longitude: number;
  description: string;
}

/**
 * ルート情報の型定義
 */
export interface Route {
  id: string;
  title: string;
  summary: string;
  totalDuration: number;
  spots: Spot[];
  polyline: string;
}

/**
 * プラン生成レスポンスの型定義
 */
export interface PlanResponse {
  routes: Route[];
}

/**
 * エラーレスポンスの型定義
 */
export interface ErrorResponse {
  errorCode: ErrorCode;
  message: string;
}

/**
 * Zodスキーマ定義
 */

// Location スキーマ
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// TransportMode スキーマ
export const transportModeSchema = z.enum(['walking', 'bicycle', 'car']);

// PlanRequest スキーマ
export const planRequestSchema = z.object({
  mood: z.string().min(1, 'mood は必須です'),
  duration: z.number().min(10, '最小時間は10分です').max(1440, '最大時間は1日（1440分）です'),
  transportMode: transportModeSchema,
  roundTrip: z.boolean(),
  currentLocation: locationSchema,
}).refine(
  (data) => {
    // 往復の場合は最低30分必要
    if (data.roundTrip && data.duration < 30) {
      return false;
    }
    return true;
  },
  {
    message: '往復の場合は最低30分必要です',
    path: ['duration'],
  }
);

// スキーマから型を推論（バリデーション用）
export type PlanRequestValidated = z.infer<typeof planRequestSchema>;
