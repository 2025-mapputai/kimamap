import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useFonts } from 'expo-font';
import Icon from "react-native-vector-icons/FontAwesome5";


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
    <ScrollView style={styles.container}>
        <Text style={styles.title}>「おでかけ、AIにまかせてみない？」</Text>
        <Text style={styles.label}>気分・場所・移動手段を選ぶだけで、{'\n'}AIがルート付きおでかけプランを自動で提案！ {'\n'}
                                    「どこ行こう？」を、ワクワクに変えるアプリです☆</Text>

        <TouchableOpacity style={styles.Button1}>
                <Text style={styles.buttonText}>今すぐプランをつくってみる ＞</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Image source={require('../../assets/images/kimamapicon.png')}/>
        </View>

        <Text style={styles.title}>AIがあなたのおでかけをもっと楽しく</Text>
        <Text style={styles.labelcenter}>気ままっぷは、あなたの気分や条件に合わせて{'\n'}最適なプランを提案します。 </Text>

        <View style={styles.card}>
          <Icon name="brain" size={30} color="#000" />
          <Text style={styles.cardTitle}>AIでカンタン！あなただけのオリジナルプラン</Text>
          <Text style={styles.cardText}>
            気分や条件に応じて、AIがぴったりのスポットを選定！{'\n'}
            あなただけの特別なプランを作成します。
          </Text>
        </View>

        <View style={styles.card}>
          <Icon name="map-signs" size={30} color="#000" />
          <Text style={styles.cardTitle}>地図と一緒にルート表示で迷わない！</Text>
          <Text style={styles.cardText}>
            スポット情報も地図上でチェックできます。{'\n'}
            最適なルートで効率よくおでかけできます。
          </Text>
        </View>

        <View style={styles.card}>
          <Icon name="heart" size={30} color="black" />
          <Text style={styles.cardTitle}>お気に入り＆履歴保存で何度でも楽しめる！</Text>
          <Text style={styles.cardText}>
            過去のルートやお店も保存できます📖{'\n'}
            いつでも思い出を振り返ることができます。
          </Text>
        </View>

        <Text style={styles.title}>簡単操作で、すぐにプランが完成</Text>
        <Text style={styles.labelcenter}>気分、場所、時間を選ぶだけ。AIがあなたにぴったりの{'\n'}
          プランを提案します。修正も簡単、保存もワンタップ。</Text>

        <Text style={styles.stepLine}>
          <Text style={styles.numberHighlight}>①</Text> 気分と条件を入力
        </Text>
        <Text style={styles.stepLine}>
          <Text style={styles.numberHighlight}>②</Text> AIがプランを提案
        </Text>
        <Text style={styles.stepLine}>
          <Text style={styles.numberHighlight}>③</Text> 地図でルートを確認
        </Text>
        <Text style={styles.stepLine}>
          <Text style={styles.numberHighlight}>④</Text> お気に入りに保存{'\n'}
        </Text>

        <Text style={styles.title}>簡単ログインで、すぐに始められる</Text>
        <Text style={styles.labelgoogle}>面倒な登録手続きは不要。Googleアカウントですぐに{'\n'}ログインできます。</Text>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Image source={require('../../assets/images/Google_logo.png')}/>
        </View>

        <Text style={styles.google}>ログインすることで、利用規約とプライバシーポリシーに{'\n'}同意したことになります。</Text>
        
        <View style={styles.orangeBox}>
          <Text style={styles.orangeTitle}>さあ、新しいお出かけ体験を{'\n'}始めよう</Text>
          <Text style={styles.orangeText}>
            AIがあなたの「どこ行こう？」をワクワクに変えます。{'\n'}今すぐ試してみませんか？
          </Text>
          <TouchableOpacity style={styles.Button2}>
            <Text style={styles.buttonText2}>今すぐプランをつくってみる ＞</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.team}>まっぷ隊 ＠2025</Text>

        <Text style={styles.text}>利用契約　プライバシーポリシー　お問い合わせ{'\n'}</Text>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBEC',
        padding: 20,
    },
    title: {  // タイトルのスタイル
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'ZenMaruGothicBold',
    },
    label: {  // 説明文のスタイル
        fontSize: 15,
        marginTop: 10,
        marginBottom: 5,
        fontFamily: 'ZenMaruGothic',
    },
    Button1: { // ボタンのスタイル
        backgroundColor: '#EEB244',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: 250,
        height: 50,
    },
    buttonText: { // ボタン内のテキストスタイル
        color: 'white',
        fontSize: 15,
        fontFamily: 'ZenMaruGothicMedium',
    },
    kimamapicon: { // アイコンのスタイル
        width: 100,
        height: 100,
        marginTop: 20,
    },
    labelcenter: {  // 説明文のスタイル
        color: 'gray',
        fontSize: 15,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'ZenMaruGothic',
    },
    card: { // カードのスタイル
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: { // カードのタイトルスタイル
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'ZenMaruGothicBold',
    },
    cardText: { // カードのテキストスタイル
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        fontFamily: 'ZenMaruGothic',
    },
    stepLine: { // ステップの説明文スタイル
      marginTop: 10,
      fontSize: 18,
      color: '#333',
      fontFamily: 'ZenMaruGothicMedium',
    },
    numberHighlight: { // ステップ番号の強調スタイル
    fontSize: 25,
    color: '#C5AA4A',
    marginRight: 5,
    fontFamily: 'ZenMaruGothicMedium',
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
    orangeBox: {
      backgroundColor: '#f8b24c', // 濃いオレンジ
      paddingVertical: 30,
      marginTop: 30,
      width: '100%',
      borderRadius: 10,
    },
    orangeTitle: { // オレンジボックス内のタイトルスタイル
      fontSize: 18,
      color: '#fff',
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'ZenMaruGothicMedium',
    },
    orangeText: { // オレンジボックス内のテキストスタイル
      marginTop: 15,
      fontSize: 14,
      color: '#fff',
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: 'ZenMaruGothic',
    },
    Button2: { // 2つ目のボタンのスタイル
      backgroundColor: '#fff',
      paddingVertical: 12,
      borderRadius: 10,
      marginTop: 15,
      alignItems: 'center',
      alignSelf: 'center',
      width: 250,
      height: 50,
    },
    buttonText2: { // 2つ目のボタン内のテキストスタイル
      color: '#f8b24c',
      fontSize: 15,
      fontFamily: 'ZenMaruGothicMedium',
    },
    team: { // チーム名
        fontSize: 15,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'ZenMaruGothicBold',
    },
    text: { // フッターのテキストスタイル
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'ZenMaruGothic',
    },
});