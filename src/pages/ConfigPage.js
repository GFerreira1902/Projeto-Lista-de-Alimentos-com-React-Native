import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FooterBar from '../components/FooterBar';
import { Video } from 'expo-av';

const ConfigPage = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const video = require('../../assets/images/tutorialgame/teste.mp4');

  const handleStartVideo = () => {
    setShowTutorial(true);
  };

  return (
    <View style={styles.container}>
      {showTutorial ? (
        <View style={styles.videoContainer}>
          <Video
            source={video}
            style={styles.video}
            useNativeControls // Use os controles de vídeo nativos
            resizeMode="contain" // Modo de redimensionamento do vídeo
            shouldPlay // Comece a reproduzir automaticamente quando montado
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleStartVideo}>
          <Text style={styles.buttonText}>TUTORIAL</Text>
        </TouchableOpacity>
      )}
      <FooterBar />
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
  button: {
    backgroundColor: '#CB3636',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    fontStyle: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoContainer: {
    width: '100%',
    height: 200, // Defina a altura desejada para o vídeo
    marginTop: 20, // Espaço acima do vídeo para separá-lo do botão
  },
  video: {
    flex: 1,
  },
});

export default ConfigPage;
