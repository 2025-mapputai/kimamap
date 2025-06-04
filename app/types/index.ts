// アプリケーション全体で使用する共通型定義

// 座標情報
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 場所・スポット情報
export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  category: LocationCategory;
  rating?: number;
  imageUrl?: string;
  description?: string;
}

// 場所カテゴリ
export type LocationCategory = 
  | 'restaurant'
  | 'cafe'
  | 'park'
  | 'museum'
  | 'shopping'
  | 'entertainment'
  | 'landmark'
  | 'other';

// 気分タイプ
export type MoodType = 
  | 'relaxed'     // リラックス
  | 'active'      // アクティブ
  | 'cultural'    // 文化的
  | 'gourmet'     // グルメ
  | 'shopping'    // ショッピング
  | 'nature';     // 自然

// 移動手段
export type TransportType = 
  | 'walk'              // 徒歩
  | 'bicycle'           // 自転車
  | 'public_transport'  // 公共交通機関
  | 'car';              // 車

// プラン作成リクエスト
export interface PlanRequest {
  durationHours: number;
  mood: MoodType;
  transportType: TransportType;
  startLocation: Coordinates;
  preferences?: {
    budget?: 'low' | 'medium' | 'high';
    groupSize?: number;
    accessibility?: boolean;
  };
}

// 旅行プラン
export interface TripPlan {
  id: string;
  title: string;
  description?: string;
  duration: number; // 時間（分）
  mood: MoodType;
  transportType: TransportType;
  locations: PlanLocation[];
  route: RouteInfo;
  createdAt: string;
}

// プラン内の場所情報（順序付き）
export interface PlanLocation {
  location: Location;
  order: number;
  plannedDuration: number; // 滞在予定時間（分）
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
}

// ルート情報
export interface RouteInfo {
  totalDistance: number; // メートル
  totalDuration: number; // 分
  waypoints: Coordinates[];
  transportSegments: TransportSegment[];
}

// 移動区間
export interface TransportSegment {
  from: Coordinates;
  to: Coordinates;
  transportType: TransportType;
  distance: number;
  duration: number;
  instructions?: string[];
}

// ユーザー情報
export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
  statistics?: UserStatistics;
}

// ユーザー設定
export interface UserPreferences {
  favoriteCategories: LocationCategory[];
  preferredTransport: TransportType[];
  defaultDuration: number;
  budget: 'low' | 'medium' | 'high';
}

// ユーザー統計
export interface UserStatistics {
  totalTrips: number;
  totalDistance: number;
  favoriteLocations: string[];
  frequentMoods: MoodType[];
}

// AI レスポンス
export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  suggestions?: string[];
}

// API レスポンス
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// エラー型
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}
