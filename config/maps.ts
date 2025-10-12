// Google Maps API 設定
export const mapsConfig = {
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: ["places", "geometry"] as const,
  defaultZoom: 15,
  defaultCenter: {
    latitude: 35.6812,
    longitude: 139.7671, // 東京駅
  },
  searchRadius: 5000, // 5km
};

export type MapsConfig = typeof mapsConfig;
