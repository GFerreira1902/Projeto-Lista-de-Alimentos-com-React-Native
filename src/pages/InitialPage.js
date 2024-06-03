import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const InitialPage = () => {
  const navigation = useNavigation();
  const imageScale = useRef(new Animated.Value(0)).current;
  const buttonStartGameOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(imageScale, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(buttonStartGameOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    })
  }, []);

  const handleStartGame = () => {
    navigation.navigate('HomePage');
  }

  return (
    <View style={styles.container}>
      <Animated.Image 
        style={[styles.nameAppStartGame, { transform: [{ scale: imageScale }] }]} 
        source={require('../../assets/images/nameapp.png')}
        resizeMode='contain'  
      />
      <Animated.Image 
        style={[styles.imgStartGame, { transform: [{ scale: imageScale }] }]} 
        source={require('../../assets/images/playgame.png')}
        resizeMode='contain'  
      />
      <Animated.View style = {{ opacity: buttonStartGameOpacity }}>
        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
          <LinearGradient
            colors={['#e53216', '#962727', '#e53216']}
            start={{ x: 0, y:0 }}
            end={{ x:1, y:1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.buttonText}>INICIAR JOGO</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  nameAppStartGame: {
    width: 250,
    height: 50
  },
  imgStartGame: {
    width: 320,
    height: 150
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    fontStyle: 'bold',
  },
  linearGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default InitialPage;
