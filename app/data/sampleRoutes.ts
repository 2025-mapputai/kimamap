import type { RoutePlan } from "../types/routes";

/**
 * 開発環境用サンプルルートデータ（皇居周辺）
 */
export const SAMPLE_ROUTE_PLAN: RoutePlan = {
  id: "sample-plan",
  title: "皇居おさんぽルート",
  summary: "皇居と周辺スポットを巡る散歩コース",
  totalDuration: 120,
  spots: [
    {
      id: "spot-kokyo",
      name: "皇居外苑",
      description: "芝生が広がる皇居外苑でのんびり",
      stayMinutes: 45,
      latitude: 35.685175,
      longitude: 139.7528,
    },
    {
      id: "spot-tokyostation",
      name: "東京駅丸の内駅舎",
      description: "赤レンガ駅舎を眺めながら写真撮影",
      stayMinutes: 30,
      latitude: 35.681236,
      longitude: 139.767125,
    },
    {
      id: "spot-kitte",
      name: "KITTE屋上庭園",
      description: "屋上庭園から東京駅の眺望を楽しむ",
      stayMinutes: 30,
      latitude: 35.680851,
      longitude: 139.765397,
    },
  ],
  polyline: [
    { latitude: 35.685175, longitude: 139.7528 },
    { latitude: 35.681236, longitude: 139.767125 },
    { latitude: 35.680851, longitude: 139.765397 },
  ],
};
