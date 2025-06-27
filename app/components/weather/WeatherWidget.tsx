import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import * as Location from "expo-location";

interface HourlyWeather {
  time: string;
  temp: number;
  code: number;
}

const WeatherWidget = ({ position = "left" }) => {
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentCode, setCurrentCode] = useState<number | null>(null);
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("位置情報の許可が必要です");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Open-Meteoで現在の天気と1時間ごとの天気を取得
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

      // 現在の気温とコードを1時間目から取る
      if (hourly.length > 0) {
        setCurrentTemp(hourly[0].temp);
        setCurrentCode(hourly[0].code);
      }

      setHourlyWeather(hourly);
    } catch (e) {
      console.error("エラー:", e);
      Alert.alert("天気データの取得に失敗しました");
    } finally {
      setLoading(false);
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

  if (loading || currentTemp === null || currentCode === null) {
    return (
      <TouchableOpacity
        style={[
          styles.weatherButton,
          position === "right" && styles.rightPosition,
        ]}
      >
        <Icon name="spinner" size={20} color="#fff" />
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.weatherButton,
          position === "right" && styles.rightPosition,
        ]}
        onPress={() => setShowModal(true)}
      >
        <Icon name={getWeatherIcon(currentCode)} size={20} color="#fff" />
        <Text style={styles.tempText}>{Math.round(currentTemp)}°</Text>
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

            <ScrollView>
              {hourlyWeather.map((item, idx) => {
                const dateObj = new Date(item.time);
                const hour = item.time.slice(11, 16);
                const day = dateObj.getDate();
                const month = dateObj.getMonth() + 1;
                const weekday = ["日", "月", "火", "水", "木", "金", "土"][
                  dateObj.getDay()
                ];

                return (
                  <View key={idx} style={styles.row}>
                    <Text
                      style={styles.time}
                    >{`${hour} (${month}/${day} ${weekday})`}</Text>
                    <Icon
                      name={getWeatherIcon(item.code)}
                      size={20}
                      color="#333"
                    />
                    <Text style={styles.temp}>{Math.round(item.temp)}°</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  weatherButton: {
    position: "absolute",
    top: 120,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
  rightPosition: {
    right: 16,
    left: "auto",
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
