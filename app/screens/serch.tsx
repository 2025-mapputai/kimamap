import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    ZenMaruGothic: require('../../assets/fonts/ZenMaruGothic-Regular.ttf'),
  });

  const [input, setInput] = useState('');
  const [history] = useState([
    'わくわくしたい',
    '美味しいもの食べたい気分',
    'オシャレなカフェに行きたい',
  ]);
  const [transport, setTransport] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');

  const historyMax = 3;
  const emptyCount = historyMax - history.length;

  if (!fontsLoaded) {
    return null; // フォント読み込み中は何も表示しない
  }

  return (
    <ScrollView style={styles.container} scrollEnabled={false}>
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.label}>要望を入力</Text>
      <TextInput
        style={styles.input}
        placeholder="例：カフェに行きたい"
        placeholderTextColor="#a9a9a9"
        value={input}
        onChangeText={setInput}
      />

      <Text style={styles.historyTitle}>検索履歴</Text>
      {history.map((item, index) => (
        <View key={index} style={styles.historyItemWrapper}>
          <Text style={styles.historyItem}>{item}</Text>
        </View>
      ))}
      {Array.from({ length: emptyCount }).map((_, index) => (
        <View key={`empty-${index}`} style={styles.historyItemWrapper}>
          <Text style={[styles.historyItem, styles.emptyHistoryItem]}>{'\u00A0'}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>どんな手段を使いますか？</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={transport}
          onValueChange={(itemValue) => setTransport(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="選んでください" value="" />
          <Picker.Item label="徒歩" value="徒歩" />
          <Picker.Item label="自転車" value="自転車" />
          <Picker.Item label="自動車" value="自動車" />
          <Picker.Item label="公共交通機関" value="公共交通機関" />
        </Picker>
      </View>

      <Text style={styles.timeTitle}>何分空いてますか？</Text>

      <View style={styles.timePickerContainer}>
        <View style={styles.singlePickerWrapper}>
          <Picker
            selectedValue={hours}
            onValueChange={(itemValue) => setHours(itemValue)}
            style={styles.timePicker}
          >
            {Array.from({ length: 25 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={`${i}`} />
            ))}
          </Picker>
          <Text style={styles.timeLabel}>時間</Text>
        </View>

        <View style={styles.singlePickerWrapper}>
          <Picker
            selectedValue={minutes}
            onValueChange={(itemValue) => setMinutes(itemValue)}
            style={styles.timePicker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={`${i}`} />
            ))}
          </Picker>
          <Text style={styles.timeLabel}>分</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchText}>検索</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  closeButton: {  // 閉じるボタンのスタイル
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  closeText: {
    fontSize: 50,
    color: '#000',
  },
  label: {  // 要望を入力のラベルスタイル
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    fontFamily: 'ZenMaruGothic',
  },
  input: {  // 入力フィールドのスタイル
    backgroundColor: '#FFE278',
    padding: 10,
    borderRadius: 25,
    fontSize: 16,
    color: 'black',
    borderWidth: 1.5,
    borderColor: '#C0A647',
    fontFamily: 'ZenMaruGothic',
  },
  historyTitle: {  // 履歴と線のスタイル
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    borderBottomWidth: 2.5,
    borderBottomColor: '#FFE278',
    paddingBottom: 5,
    textAlign: 'left',
    fontFamily: 'ZenMaruGothic',
  },
  historyItemWrapper: {
    alignItems: 'center',
  },
  historyItem: {  // 履歴アイテムのスタイル
    fontSize: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE278',
    textAlign: 'center',
    width: '80%',
    fontFamily: 'ZenMaruGothic',
  },
  emptyHistoryItem: {  // 空枠の履歴アイテムのスタイル
    color: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE278',
  },
  sectionTitle: {  // 交通手段の文字と線のスタイル
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    borderBottomWidth: 2.5,
    borderBottomColor: '#FFE278',
    paddingBottom: 5,
    textAlign: 'center',
    fontFamily: 'ZenMaruGothic',
  },
  pickerWrapper: {  // 交通手段のピッカーのスタイル
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    height: 130,
    alignSelf: 'center',
    width: '60%',
    marginTop: -10,
  },
  picker: {  // ピッカーのスタイル
    height: 100,
    color: '#000',
  },
  timeTitle: {  // 時間選択の文字と線のスタイル
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2.5,
    borderBottomColor: '#FFE278',
    paddingBottom: 5,
    textAlign: 'center',
    fontFamily: 'ZenMaruGothic',
  },
  timePickerContainer: {  // 時間選択のピッカーのスタイル
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
    marginTop: -10,
  },
  singlePickerWrapper: {  // 単一のピッカーのスタイル
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePicker: {  // 時間選択のピッカーのスタイル
    height: 150,
    width: 90,
    color: '#000',
  },
  timeLabel: {  // 時間と分のラベルのスタイル
    fontSize: 16,
    marginHorizontal: 5,
    marginTop: '50%',
    fontFamily: 'ZenMaruGothic',
  },
  searchButton: {  // 検索ボタンのスタイル
    backgroundColor: '#FFE278',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 40,
    alignItems: 'center',
    alignSelf: 'center',
    width: 100,
    height: 50,
  },
  searchText: {  // 検索ボタンのテキストスタイル
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ZenMaruGothic',
  },
});