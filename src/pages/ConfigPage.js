import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Modal, Button } from 'react-native';
import FooterBar from '../components/FooterBar';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const ConfigPage = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const video = require('../../assets/images/tutorialgame/komidinhaz_walkthrough.mp4');
  const [termsText, setTermsText] = useState('');

  const handleStartVideo = () => {
    setShowTutorial(!showTutorial);
  };

  const handleToggleCreditsModal = () => {
    setShowCreditsModal(!showCreditsModal);
  };

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const termsData = require('../../credito.json');
        setTermsText(termsData.terms);
      } catch (error) {
        console.error('Erro ao carregar os termos:', error);
      }
    };

    loadTerms();
  }, []);

  const renderTextWithStyle = (text) => {
    const lines = text.split('\n').map((line, index) => {
      if (line.startsWith('Sobre') || line.startsWith('Aviso') || line.startsWith('Prazo') || line.startsWith('Compromisso') || line.startsWith('Desativação')) {
        return <Text key={index} style={styles.titleTerms}>{line.trim()}</Text>;
      }
      return <Text key={index} style={styles.textTerms}>{line.trim()}</Text>;
    });

    return lines;
  };

  const renderCreditsModal = () => {
    return (
      <Modal visible={showCreditsModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {renderTextWithStyle(termsText)}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={handleToggleCreditsModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.optionsContainer}>
          <LinearGradient
            colors={['#e53216', '#962727', '#e53216']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.optionText} onPress={handleStartVideo}>TUTORIAL</Text>
          </LinearGradient>
        </View>
        <View style={styles.optionsContainer}>
          <LinearGradient
            colors={['#e53216', '#962727', '#e53216']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
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
      <FooterBar />
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
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
  footerConfig: {
    position: 'absolute',
    bottom: 65,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerConfigText: {
    fontSize: 16,
    color: 'grey'
  },
  textTerms: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  titleTerms: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfigPage;
