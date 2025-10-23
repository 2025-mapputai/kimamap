import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import type { LocationStatus } from "../../types/location";

type LocationBannerProps = {
  locationStatus: LocationStatus;
  fallbackReason: string | null;
  topOffset: number;
  onRetry: () => void;
};

export const LocationBanner: React.FC<LocationBannerProps> = ({
  locationStatus,
  fallbackReason,
  topOffset,
  onRetry,
}) => {
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
        action = onRetry;
        break;
      default:
        message = "現在地情報が利用できません";
        actionLabel = "再試行";
        action = onRetry;
    }
  } else if (locationStatus === "loading") {
    message = "現在地を確認しています";
  }

  return (
    <View style={[styles.container, { top: topOffset }]}>
      <Text style={styles.text}>{message}</Text>
      {action && actionLabel ? (
        <TouchableOpacity style={styles.button} onPress={action}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  text: {
    color: "#fff",
    flex: 1,
    marginRight: 12,
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  buttonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 12,
  },
});
