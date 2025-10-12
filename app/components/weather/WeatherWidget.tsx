import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import * as Location from "expo-location";

interface HourlyWeather {
  time: string;
  temp: number;
  code: number;
}

type WeatherStatus = "loading" | "ready" | "denied" | "error";

type WeatherData = {
  currentTemp: number;
  currentCode: number;
  hourly: HourlyWeather[];
};

type WeatherErrorReason = "permission-denied" | "fetch-failed" | null;

const WeatherWidget = ({ position = "left" }) => {
  const [status, setStatus] = useState<WeatherStatus>("loading");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [errorReason, setErrorReason] = useState<WeatherErrorReason>(null);
  const [showModal, setShowModal] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setStatus("loading");
      setErrorReason(null);

      const { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== Location.PermissionStatus.GRANTED) {
        setStatus("denied");
        setErrorReason("permission-denied");
        setWeather(null);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=Asia%2FTokyo`
      );

      const now = new Date();
      const times: string[] = res.data.hourly.time;
      const temps: number[] = res.data.hourly.temperature_2m;
      const codes: number[] = res.data.hourly.weathercode;

      const hourly: HourlyWeather[] = [];

      for (let i = 0; i < times.length; i++) {
        const time = new Date(times[i]);
        if (time >= now && hourly.length < 24) {
          hourly.push({
            time: times[i],
            temp: temps[i],
            code: codes[i],
          });
        }
      }

      if (!hourly.length) {
        setWeather(null);
        setStatus("error");
        setErrorReason("fetch-failed");
        return;
      }

      setWeather({
        currentTemp: hourly[0].temp,
        currentCode: hourly[0].code,
        hourly,
      });
      setStatus("ready");
    } catch (e) {
      console.error("天気取得エラー:", e);
      setWeather(null);
      setStatus("error");
      setErrorReason("fetch-failed");
    }
  };

  const getWeatherIcon = (code: number): string => {
    const map: { [key: number]: string } = {
      0: "sun",
      1: "cloud",
      2: "cloud",
      3: "cloud",
      45: "smog",
      48: "smog",
      51: "cloud-rain",
      61: "cloud-rain",
      80: "cloud-rain",
    };
    return map[code] || "cloud";
  };

  const buttonPositionStyle = useMemo(() => {
    const base = {
      top: insets.top + 16,
      left: position === "right" ? undefined : 16,
      right: position === "right" ? 16 : undefined,
    } as const;
    return base;
  }, [insets.top, position]);

  const renderButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <View style={styles.inlineContent}>
            <Icon name="spinner" size={18} color="#fff" />
            <Text style={styles.inlineText}>取得中…</Text>
          </View>
        );
      case "denied":
        return (
          <TouchableOpacity
            style={styles.inlineContent}
            onPress={() => Linking.openSettings()}
          >
            <Icon name="lock" size={18} color="#fff" />
            <Text style={styles.inlineText}>権限を許可</Text>
          </TouchableOpacity>
        );
      case "error":
        return (
          <TouchableOpacity
            style={styles.inlineContent}
            onPress={fetchWeatherData}
          >
            <Icon name="wifi" size={18} color="#fff" />
            <Text style={styles.inlineText}>再読み込み</Text>
          </TouchableOpacity>
        );
      case "ready":
        if (!weather) return null;
        return (
          <View style={styles.inlineContent}>
            <Icon name={getWeatherIcon(weather.currentCode)} size={20} color="#fff" />
            <Text style={styles.tempText}>{Math.round(weather.currentTemp)}°</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.weatherButton, buttonPositionStyle]}
        onPress={() => setShowModal(true)}
        disabled={status !== "ready"}
      >
        {renderButtonContent()}
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>1時間ごとの天気</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="times" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={weather?.hourly.slice(0, 24) ?? []}
              keyExtractor={(item) => item.time}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const dateObj = new Date(item.time);
                const hour = item.time.slice(11, 16);
                const day = dateObj.getDate();
                const month = dateObj.getMonth() + 1;
                const weekday = ["日", "月", "火", "水", "木", "金", "土"][
                  dateObj.getDay()
                ];

                return (
                  <View style={styles.row}>
                    <Text style={styles.time}>{`${hour} (${month}/${day} ${weekday})`}</Text>
                    <Icon
                      name={getWeatherIcon(item.code)}
                      size={20}
                      color="#333"
                    />
                    <Text style={styles.temp}>{Math.round(item.temp)}°</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  weatherButton: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
  inlineContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inlineText: {
    color: "#fff",
    fontSize: 12,
  },
  tempText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    alignItems: "center",
  },
  time: {
    width: 140,
    fontSize: 14,
  },
  temp: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WeatherWidget;
