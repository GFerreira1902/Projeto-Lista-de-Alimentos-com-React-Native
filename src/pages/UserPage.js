import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterBar from "../components/FooterBar";
import { LinearGradient } from 'expo-linear-gradient';


const UserPage = () => {
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    loadUserScore();
  }, []);

  const loadUserScore = async () => {
    try {
      const value = await AsyncStorage.getItem('@userScore');
      if (value) {
        setUserScore(parseInt(value, 10));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#808080', '#1C1C1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.scoreConainer}
      >
        <Text style={styles.text}>Sua Pontuação</Text>
        <Text style={styles.scoreText}>{userScore}</Text>
      </LinearGradient>
      <FooterBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scoreConainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
    fontStyle: 'bold'
  },
  text: {
    fontSize: 30,
    color: 'white',
  },
  scoreText: {
    fontSize: 30,
    color: '#FFD700'
  }
});

export default UserPage;
