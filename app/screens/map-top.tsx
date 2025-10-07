import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  AppState,
  Linking,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import WeatherWidget from "../components/weather/WeatherWidget";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { mapsConfig } from "../../config/maps";
import type {
  LatLng,
  MapRouteOverlayState,
  RoutePlan,
} from "../types/routes";

const TAB_COLOR = "#F8D762";

type LocationStatus = "loading" | "granted" | "denied" | "fallback";

const SAMPLE_ROUTE_PLAN: RoutePlan = {
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

// 検索バー風ヘッダー
type MapHeaderProps = {
  topInset: number;
};

const MapHeader: React.FC<MapHeaderProps> = ({ topInset }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={[styles.headerBg, { paddingTop: topInset }]}>
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Search")}
      >
        <Text style={styles.searchText}>スポット・エリア・気分で検索</Text>
      </TouchableOpacity>
    </View>
  );
};

// マップを表示する関数コンポーネント
const MapTop: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("loading");
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(true);
  const [showRecenterButton, setShowRecenterButton] = useState<boolean>(false);
  const [routeOverlay, setRouteOverlay] = useState<MapRouteOverlayState>({
    plans: [],
    activePlanId: null,
    focusedSpotId: null,
  });
  const lastAutoCenteredRef = useRef<LatLng | null>(null);
  const ignoreNextRegionChangeRef = useRef<boolean>(false);
  const mapRef = useRef<MapView | null>(null);
  const isFollowingUserRef = useRef<boolean>(true);

  const isMountedRef = useRef(true);
  const isCheckingRef = useRef(false);

  const applyLocation = useCallback((location: LatLng | null) => {
    if (!isMountedRef.current) return;
    setCurrentLocation(location);
  }, []);

  const updateStatus = useCallback((status: LocationStatus, reason?: string | null) => {
    if (!isMountedRef.current) return;
    setLocationStatus(status);
    setFallbackReason(reason ?? null);
  }, []);

  const fetchCurrentPosition = useCallback(async () => {
    try {
      const lastKnown = await Location.getLastKnownPositionAsync({maxAge: 30_000});
      const position =
        lastKnown ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        }));

      if (!position) {
        updateStatus("fallback", "position-unavailable");
        return;
      }

      applyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      updateStatus("granted");
      if (isMountedRef.current) setLastError(null);
    } catch (error) {
      if (isMountedRef.current) {
        setLastError((error as Error)?.message ?? String(error));
      }
      updateStatus("fallback", "position-error");
    }
  }, [applyLocation, updateStatus]);

  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const stopWatchingPosition = useCallback(() => {
    watchSubscriptionRef.current?.remove();
    watchSubscriptionRef.current = null;
  }, []);

  const startWatchingPosition = useCallback(async () => {
    if (!isMountedRef.current) return;
    stopWatchingPosition();

    watchSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 15,
        timeInterval: 1000,
      },
      (location) => {
        if (!isMountedRef.current) return;
        const coords = location.coords;
        const center = { latitude: coords.latitude, longitude: coords.longitude };
        applyLocation(center);

        if (isFollowingUserRef.current && mapRef.current) {
          ignoreNextRegionChangeRef.current = true;
          lastAutoCenteredRef.current = center;
          mapRef.current.animateCamera({ center }, { duration: 600 });
        }
      }
    );
  }, [applyLocation, stopWatchingPosition]);

  const checkLocation = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    updateStatus("loading");

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        updateStatus("fallback", "services-disabled");
        applyLocation(null);
        setIsFollowingUser(false);
        setShowRecenterButton(false);
        stopWatchingPosition();
        return;
      }

      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

      if (status === Location.PermissionStatus.GRANTED) {
        await fetchCurrentPosition();
        await startWatchingPosition();
        return;
      }

      if (canAskAgain) {
        const requestResult = await Location.requestForegroundPermissionsAsync();
        if (requestResult.status === Location.PermissionStatus.GRANTED) {
          await fetchCurrentPosition();
          await startWatchingPosition();
          return;
        }
        updateStatus("denied", "permission-denied");
        applyLocation(null);
        setIsFollowingUser(false);
        setShowRecenterButton(false);
        stopWatchingPosition();
        return;
      }

      updateStatus("fallback", "permission-blocked");
      applyLocation(null);
      setIsFollowingUser(false);
      setShowRecenterButton(false);
      stopWatchingPosition();
    } catch (error) {
      if (isMountedRef.current) {
        setLastError((error as Error)?.message ?? String(error));
      }
      updateStatus("fallback", "unknown-error");
      applyLocation(null);
      setIsFollowingUser(false);
      setShowRecenterButton(false);
      stopWatchingPosition();
    } finally {
      isCheckingRef.current = false;
    }
  }, [applyLocation, fetchCurrentPosition, startWatchingPosition, stopWatchingPosition, updateStatus]);

  useEffect(() => {
    isMountedRef.current = true;
    checkLocation();

    return () => {
      isMountedRef.current = false;
      stopWatchingPosition();
    };
  }, [checkLocation, stopWatchingPosition]);

  useEffect(() => {
    if (__DEV__) {
      setRouteOverlay({
        plans: [SAMPLE_ROUTE_PLAN],
        activePlanId: SAMPLE_ROUTE_PLAN.id,
        focusedSpotId: null,
      });
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        checkLocation();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkLocation]);

  const resolvedCenter =
    locationStatus === "granted" && currentLocation
      ? currentLocation
      : mapsConfig.defaultCenter;

  const initialRegion = useMemo(
    () => ({
      latitude: resolvedCenter.latitude,
      longitude: resolvedCenter.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }),
    [resolvedCenter.latitude, resolvedCenter.longitude]
  );

  const headerPaddingTop = insets.top + (Platform.OS === "ios" ? 16 : 12);
  const bannerTopOffset = headerPaddingTop + 56;
  const activePlan = useMemo(() => {
    if (!routeOverlay.activePlanId) return null;
    return (
      routeOverlay.plans.find((plan) => plan.id === routeOverlay.activePlanId) ?? null
    );
  }, [routeOverlay]);

  const handleRecenter = useCallback(() => {
    if (!currentLocation || !mapRef.current) {
      checkLocation();
      return;
    }

    setIsFollowingUser(true);
    setShowRecenterButton(false);
    const center = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };
    ignoreNextRegionChangeRef.current = true;
    lastAutoCenteredRef.current = center;
    mapRef.current.animateCamera({ center }, { duration: 600 });
  }, [checkLocation, currentLocation]);

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      if (!isFollowingUser) {
        return;
      }

      if (ignoreNextRegionChangeRef.current) {
        ignoreNextRegionChangeRef.current = false;
        return;
      }

      const lastCenter = lastAutoCenteredRef.current;
      if (!lastCenter) {
        return;
      }

      const distance = Math.hypot(
        region.latitude - lastCenter.latitude,
        region.longitude - lastCenter.longitude
      );

      const THRESHOLD = 0.001;

      if (distance > THRESHOLD) {
        setIsFollowingUser(false);
        setShowRecenterButton(true);
      }
    },
    [isFollowingUser]
  );

  useEffect(() => {
    isFollowingUserRef.current = isFollowingUser;
  }, [isFollowingUser]);

  useEffect(() => {
    if (locationStatus !== "granted") {
      setShowRecenterButton(false);
    }
  }, [locationStatus]);

  const renderFallbackMessage = () => {
    if (locationStatus === "granted") return null;

    let message = "現在地を取得しています";
    let actionLabel: string | null = null;
    let action: (() => void) | null = null;

    if (locationStatus === "denied") {
      message = "位置情報の許可が必要です";
      actionLabel = "設定を開く";
      action = () => Linking.openSettings();
    } else if (locationStatus === "fallback") {
      switch (fallbackReason) {
        case "services-disabled":
          message = "位置情報サービスがオフです";
          actionLabel = "設定を開く";
          action = () => Linking.openSettings();
          break;
        case "permission-blocked":
          message = "位置情報が端末設定でブロックされています";
          actionLabel = "設定を開く";
          action = () => Linking.openSettings();
          break;
        case "position-error":
        case "position-unavailable":
          message = "現在地を取得できませんでした";
          actionLabel = "再試行";
          action = () => checkLocation();
          break;
        default:
          message = "現在地情報が利用できません";
          actionLabel = "再試行";
          action = () => checkLocation();
      }
    } else if (locationStatus === "loading") {
      message = "現在地を確認しています";
    }

    return (
      <View style={[styles.bannerContainer, { top: bannerTopOffset }]}>
        <Text style={styles.bannerText}>{message}</Text>
        {action && actionLabel ? (
          <TouchableOpacity style={styles.bannerButton} onPress={action}>
            <Text style={styles.bannerButtonText}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MapHeader topInset={headerPaddingTop} />
      {renderFallbackMessage()}
      <WeatherWidget />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        ref={(ref) => {
          mapRef.current = ref;
        }}
      >
        {activePlan?.polyline?.length ? (
          <Polyline
            coordinates={activePlan.polyline}
            strokeColor="#0A84FF"
            strokeWidth={4}
          />
        ) : null}
        {activePlan?.spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
            description={spot.description}
          />
        ))}
      </MapView>
      {showRecenterButton ? (
        <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
          <Text style={styles.recenterButtonText}>現在地</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TAB_COLOR,
  },
  headerBg: {
    backgroundColor: TAB_COLOR,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  searchBar: {
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  searchText: {
    color: "#888",
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  bannerContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  bannerText: {
    color: "#fff",
    flex: 1,
    marginRight: 12,
    fontSize: 14,
  },
  bannerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  bannerButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 12,
  },
  recenterButton: {
    position: "absolute",
    right: 16,
    bottom: 32,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  recenterButtonText: {
    fontWeight: "600",
    color: "#333",
  },
});

export default MapTop;
