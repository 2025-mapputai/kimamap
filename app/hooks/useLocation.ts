import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import type { LatLng } from "../types/routes";
import type { LocationStatus } from "../types/location";

type UseLocationReturn = {
  locationStatus: LocationStatus;
  currentLocation: LatLng | null;
  fallbackReason: string | null;
  lastError: string | null;
  checkLocation: () => Promise<void>;
};

/**
 * 位置情報管理のカスタムフック
 *
 * 権限チェック、現在地取得、リアルタイム追従を提供
 */
export const useLocation = (): UseLocationReturn => {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("loading");
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const isCheckingRef = useRef(false);
  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

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
      const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 30_000 });
      const position =
        lastKnown ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        }));

      if (!position) {
        updateStatus("fallback", "position-unavailable");
        return;
      }

      const coords: LatLng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      applyLocation(coords);
      updateStatus("granted");
      if (isMountedRef.current) setLastError(null);
    } catch (error) {
      if (isMountedRef.current) {
        setLastError((error as Error)?.message ?? String(error));
      }
      updateStatus("fallback", "position-error");
    }
  }, [applyLocation, updateStatus]);

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
        const center: LatLng = { latitude: coords.latitude, longitude: coords.longitude };
        applyLocation(center);
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
        stopWatchingPosition();
        return;
      }

      updateStatus("fallback", "permission-blocked");
      applyLocation(null);
      stopWatchingPosition();
    } catch (error) {
      if (isMountedRef.current) {
        setLastError((error as Error)?.message ?? String(error));
      }
      updateStatus("fallback", "unknown-error");
      applyLocation(null);
      stopWatchingPosition();
    } finally {
      isCheckingRef.current = false;
    }
  }, [applyLocation, fetchCurrentPosition, startWatchingPosition, stopWatchingPosition, updateStatus]);

  // 初期化とクリーンアップ
  useEffect(() => {
    isMountedRef.current = true;
    checkLocation();

    return () => {
      isMountedRef.current = false;
      stopWatchingPosition();
    };
  }, [checkLocation, stopWatchingPosition]);

  // AppState監視（復帰時に再チェック）
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

  return {
    locationStatus,
    currentLocation,
    fallbackReason,
    lastError,
    checkLocation,
  };
};
