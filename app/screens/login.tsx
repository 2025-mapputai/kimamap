import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    ZenMaruGothic: require('../../assets/fonts/ZenMaruGothic-Regular.ttf'),
    ZenMaruGothicBold: require('../../assets/fonts/ZenMaruGothic-Bold.ttf'),
    ZenMaruGothicMedium: require('../../assets/fonts/ZenMaruGothic-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null; // フォント読み込み中は何も表示しない
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Image source={require('../../assets/images/kimamapicon.png')}/>
        </View>

        <Text style={styles.title}>簡単ログインで、すぐに始められる</Text>
          <Text style={styles.labelgoogle}>面倒な登録手続きは不要。Googleアカウントですぐに{'\n'}ログインできます。</Text>
        
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Image source={require('../../assets/images/Google_logo.png')}/>
          </View>
        
        <Text style={styles.google}>ログインすることで、利用規約とプライバシーポリシーに{'\n'}同意したことになります。</Text>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBEC',
        padding: 20,
    },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
    title: {  // タイトルのスタイル
        fontSize: 20,
        marginTop: 30,
        textAlign: 'center',
        fontFamily: 'ZenMaruGothicBold',
    },
    kimamapicon: { // アイコンのスタイル
        width: 100,
        height: 100,
        marginTop: 20,
    },
    labelgoogle: { // Googleログインの説明文スタイル
        color: 'gray',
        fontSize: 15,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'ZenMaruGothic',
    },
    google: { // Googleログインの説明文スタイル
        color: 'gray',
        fontSize: 11,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'ZenMaruGothicMedium',
    },
});