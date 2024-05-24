import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Modal, Button} from 'react-native';
import FooterBar from '../components/FooterBar';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const ConfigPage = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const video = require('../../assets/images/tutorialgame/teste.mp4');

  const handleStartVideo = () => {
    setShowTutorial(!showTutorial);
  };

  const handleToggleCreditsModal = () => {
    setShowCreditsModal(!showCreditsModal);
  };

  const handleModalBackgroundPress = () => {
    setShowCreditsModal(false);
  };

  const renderCreditsModal = () => {
    return (
      <Modal visible={showCreditsModal} animationType="slide" transparent>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={handleModalBackgroundPress}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Texto Gerador de Lero Lero</Text>
            <Button title="Fechar" onPress={handleToggleCreditsModal} />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.optionsContainer}>
          <LinearGradient
            colors={['#e53216', '#962727', '#e53216']}
            start={{ x: 0, y:0 }}
            end={{ x:1, y:1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.optionText} onPress={handleStartVideo}>TUTORIAL</Text>
          </LinearGradient>  
        </View>
        <View style={styles.optionsContainer}>
          <LinearGradient
            colors={['#e53216', '#962727', '#e53216']}
            start={{ x: 0, y:0 }}
            end={{ x:1, y:1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.optionText} onPress={handleToggleCreditsModal}>CREDITOS</Text>
          </LinearGradient>         
        </View>
      </ScrollView>
      {showTutorial && (
        <View style={styles.videoContainer}>
          <Video
            source={video}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            shouldPlay
          />
        </View>
      )}
      {renderCreditsModal()}
      <View style={styles.footerConfig}>
        <Text style={styles.footerConfigText}>© KOMIDINHAZ</Text>
      </View>
      <FooterBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  optionsContainer: {
    marginBottom: 10,
    width: '60%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'white'
  },
  linearGradient: {
    width: '100%',
    height: '60',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 20,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '80%',
    height: 300,
    marginBottom: 200,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  footerConfig: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerConfigText: {
    fontSize: 16,
    color: 'grey'
  },
});

export default ConfigPage;
