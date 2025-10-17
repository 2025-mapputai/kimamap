import { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Region } from "react-native-maps";
import type { LatLng } from "../types/routes";
import type { LocationStatus } from "../types/location";

type UseMapCameraParams = {
  currentLocation: LatLng | null;
  locationStatus: LocationStatus;
  mapRef: React.RefObject<MapView | null>;
  onRetry: () => void;
};

type UseMapCameraReturn = {
  isFollowingUser: boolean;
  showRecenterButton: boolean;
  isFollowingUserRef: React.RefObject<boolean>;
  lastAutoCenteredRef: React.RefObject<LatLng | null>;
  ignoreNextRegionChangeRef: React.RefObject<boolean>;
  handleRecenter: () => void;
  handleRegionChangeComplete: (region: Region) => void;
};

/**
 * 地図カメラ制御のカスタムフック
 *
 * ユーザーの手動操作検知、自動追従、再センタリング機能を提供
 */
export const useMapCamera = ({
  currentLocation,
  locationStatus,
  mapRef,
  onRetry,
}: UseMapCameraParams): UseMapCameraReturn => {
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(true);
  const [showRecenterButton, setShowRecenterButton] = useState<boolean>(false);

  const lastAutoCenteredRef = useRef<LatLng | null>(null);
  const ignoreNextRegionChangeRef = useRef<boolean>(false);
  const isFollowingUserRef = useRef<boolean>(true);

  const handleRecenter = useCallback(() => {
    if (!currentLocation || !mapRef.current) {
      onRetry();
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
  }, [currentLocation, mapRef, onRetry]);

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

  // isFollowingUserのref同期
  useEffect(() => {
    isFollowingUserRef.current = isFollowingUser;
  }, [isFollowingUser]);

  // locationStatusが"granted"でない場合はボタンを非表示
  useEffect(() => {
    if (locationStatus !== "granted") {
      setShowRecenterButton(false);
    }
  }, [locationStatus]);

  return {
    isFollowingUser,
    showRecenterButton,
    isFollowingUserRef,
    lastAutoCenteredRef,
    ignoreNextRegionChangeRef,
    handleRecenter,
    handleRegionChangeComplete,
  };
};
