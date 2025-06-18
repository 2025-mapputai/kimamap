import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const TAB_COLOR = "#F8D762";

// 検索バー風ヘッダー
const MapHeader: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={styles.headerBg}>
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Serch")}
      >
        <Text style={styles.searchText}>スポット・エリア・気分で検索</Text>
      </TouchableOpacity>
    </View>
  );
};

// マップを表示する関数コンポーネント
const MapTop: React.FC = () => {
  return (
    <View style={styles.container}>
      <MapHeader />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
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
    paddingTop: Platform.OS === "ios" ? 60 : 30,
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
