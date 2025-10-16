export type LatLng = {
  latitude: number;
  longitude: number;
};

export type RoutePolyline = LatLng[];

export type RouteSpot = {
  id: string;
  name: string;
  description: string;
  stayMinutes: number;
  latitude: number;
  longitude: number;
};

export type RoutePlan = {
  id: string;
  title: string;
  summary: string;
  totalDuration: number;
  spots: RouteSpot[];
  polyline: RoutePolyline;
};

export type MapRouteOverlayState = {
  plans: RoutePlan[];
  activePlanId: string | null;
  focusedSpotId: string | null;
};
