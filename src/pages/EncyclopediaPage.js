import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Modal, TouchableOpacity, Image, ImageBackground } from 'react-native';
import FooterBar from '../components/FooterBar';
//import dados from '../../dados.json';
import {data} from '../../dados';

const windowWidth = Dimensions.get('window').width;

const EncyclopediaPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const renderCard = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        <View style={styles.card}>
          <Text style={styles.cardText}>{item.alimento}</Text>
          <Image source={item.path_image}  style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHealthIndicator = (classificacao_saude) => {
    let backgroundColor;

    switch (classificacao_saude) {
      case 'saudavel':
        backgroundColor = 'green';
        break;
      case 'moderado':
        backgroundColor = 'yellow';
        break;
      case 'nao_saudavel':
        backgroundColor = 'red';
        break;
      default:
        backgroundColor = 'transparent';
    }

    return <View style={[styles.healthIndicator, { backgroundColor }]} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enciclopédia Dos Alimentos</Text>
      <FlatList 
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />
      <Modal visible={selectedItem !== null} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.alimento}</Text>
            <Image source={selectedItem?.path_image} style={styles.modalImage} />
            <View style={styles.healthIndicatorContainer}>
              {renderHealthIndicator(selectedItem?.classificacao_saude)}
            </View>
            <Text style={styles.modalDescription}>{selectedItem?.descricao}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FooterBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 60,
  },
  card: {
    width: (windowWidth - 30) / 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
  },
  healthIndicatorContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
    marginBottom: 10,
  },
  healthIndicator: {
    flex: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default EncyclopediaPage;
