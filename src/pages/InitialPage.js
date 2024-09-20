import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InitialPage = () => {
  const navigation = useNavigation();
  const [showTutorial, setShowTutorial] = useState(false);
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
    });
  }, []);

  const handleStartGame = async () => {
    try {
      const hasSeenTutorial = await AsyncStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        await AsyncStorage.setItem('hasSeenTutorial', 'true');
      } else {
        navigation.navigate('HomePage');
      }
    } catch (error) {
      console.error('Erro ao verificar o estado do tutorial:', error);
      navigation.navigate('HomePage'); // Como fallback, navega para HomePage
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    navigation.navigate('HomePage'); // Navega para a HomePage após fechar o tutorial
  };

  const tutorialVideo = require('../../assets/images/tutorialgame/komidinhaz_walkthrough.mp4');

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
      <Animated.View style={{ opacity: buttonStartGameOpacity }}>
        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
          <LinearGradient
            colors={['#e53216', '#962727', '#e53216']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.buttonText}>INICIAR JOGO</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {showTutorial && (
        <Modal visible={showTutorial} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Video
                source={tutorialVideo}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                shouldPlay
              />
              <TouchableOpacity style={styles.closeButton} onPress={handleTutorialClose}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    height: 50,
  },
  imgStartGame: {
    width: 320,
    height: 150,
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
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300,
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 60,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InitialPage;
