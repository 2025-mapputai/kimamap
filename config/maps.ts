// Google Maps API 設定
export const mapsConfig = {
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: ["places", "geometry"] as const,
  defaultZoom: 15,
  defaultCenter: {
    latitude: 35.6762,
    longitude: 139.6503, // 東京駅
  },
  searchRadius: 5000, // 5km
};

// 地図スタイル設定
export const mapStyles = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  // その他のスタイル設定...
];

export type MapsConfig = typeof mapsConfig;
