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
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import WeatherWidget from "../components/weather/WeatherWidget";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mapsConfig } from "../../config/maps";
import type {
  LatLng,
  MapRouteOverlayState,
  RoutePlan,
} from "../types/routes";
import type { LocationStatus } from "../types/location";
import { TAB_COLOR } from "../constants/colors";
import { SAMPLE_ROUTE_PLAN } from "../data/sampleRoutes";
import { LocationBanner } from "../components/map/LocationBanner";
import { RecenterButton } from "../components/map/RecenterButton";
import { useMapCamera } from "../hooks/useMapCamera";
import { useLocation } from "../hooks/useLocation";

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
  const [routeOverlay, setRouteOverlay] = useState<MapRouteOverlayState>({
    plans: [],
    activePlanId: null,
    focusedSpotId: null,
  });
  const mapRef = useRef<MapView | null>(null);

  // useLocationを先に呼び出す（位置情報を取得）
  const {
    locationStatus,
    currentLocation,
    fallbackReason,
    lastError: _lastError,
    checkLocation,
  } = useLocation();

  // useMapCameraを呼び出す（useLocationから取得した値を渡す）
  const {
    isFollowingUser,
    showRecenterButton,
    isFollowingUserRef,
    lastAutoCenteredRef,
    ignoreNextRegionChangeRef,
    handleRecenter,
    handleRegionChangeComplete,
  } = useMapCamera({
    currentLocation,
    locationStatus,
    mapRef,
    onRetry: checkLocation,
  });

  useEffect(() => {
    if (__DEV__) {
      setRouteOverlay({
        plans: [SAMPLE_ROUTE_PLAN],
        activePlanId: SAMPLE_ROUTE_PLAN.id,
        focusedSpotId: null,
      });
    }
  }, []);

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

  // ヘッダー全体の高さを計算（WeatherWidget用）
  const SEARCH_BAR_HEIGHT = 44; // styles.searchBarのpaddingVertical 12×2 + テキスト高さ
  const HEADER_PADDING_BOTTOM = 8; // styles.headerBgのpaddingBottom
  const headerTotalHeight = headerPaddingTop + SEARCH_BAR_HEIGHT + HEADER_PADDING_BOTTOM;

  const bannerTopOffset = headerPaddingTop + 56;
  const activePlan = useMemo(() => {
    if (!routeOverlay.activePlanId) return null;
    return (
      routeOverlay.plans.find((plan) => plan.id === routeOverlay.activePlanId) ?? null
    );
  }, [routeOverlay]);

  return (
    <View style={styles.container}>
      <MapHeader topInset={headerPaddingTop} />
      <LocationBanner
        locationStatus={locationStatus}
        fallbackReason={fallbackReason}
        topOffset={bannerTopOffset}
        onRetry={checkLocation}
      />
      <WeatherWidget headerHeight={headerTotalHeight} />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
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
      <RecenterButton visible={showRecenterButton} onPress={handleRecenter} />
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
});

export default MapTop;
