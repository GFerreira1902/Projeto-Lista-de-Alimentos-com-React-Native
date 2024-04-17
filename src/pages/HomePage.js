import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, Modal, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterBar from '../components/FooterBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {data} from '../../dados'

const windowWidth = Dimensions.get('window').width;
const imgFeedbackGood = require('../../assets/images/feedback/facefeliz.png')
const imgFeedbackModerado = require('../../assets/images/feedback/facemoderada.png')
const imgFeedbackBad = require('../../assets/images/feedback/facetriste.png')

const HomePage = () => {
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [randomizedData, setRandomizedData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const windowDimensions = useWindowDimensions();
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);

  useEffect(() => {
    getSavedItems();
    randomizeData();
  }, []);

  useEffect(() => {
    saveItems(selectedItems);
  }, [selectedItems]);

  const getSavedItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('selectedItems');
      if (savedItems !== null) {
        setSelectedItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading selected items:', error);
    }
  };

  const saveItems = async (items) => {
    try {
      await AsyncStorage.setItem('selectedItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving selected items:', error);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prevItems => {
      if (prevItems.includes(itemId)) {
        return prevItems.filter(id => id !== itemId);
      } else {
        return [...prevItems, itemId];
      }
    });
  };

  const handleFinishList = () => {
    setIsModalVisible(true);
  };

  const randomizeData = () => {
    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    const randomizedItems = {
      saudavel: [],
      moderado: [],
      nao_saudavel: [],
    };

    shuffledData.forEach((item) => {
      if (randomizedItems[item.classificacao_saude].length < 10) {
        randomizedItems[item.classificacao_saude].push(item);
      }
    });

    const flattenedData = randomizedItems.saudavel.concat(randomizedItems.moderado, randomizedItems.nao_saudavel);
    setRandomizedData(flattenedData);
  };

  const isItemSelected = (itemId) => {
    return selectedItems.includes(itemId);
  };

  const handleToggleItemSelectedModal = (itemId) => {
    setSelectedItemToDelete(itemId);
  };
  
  const isItemSelectedModal = (itemId) => {
    return selectedItemToDelete === itemId;
  };

  const modalItemList = useMemo(() => {
    return randomizedData.filter(item => selectedItems.includes(item.id));
  }, [randomizedData, selectedItems]);

  const handleDeleteItem = () => {
    setSelectedItems(prevItems => prevItems.filter(id => id !== selectedItemToDelete));
    setSelectedItemToDelete(null);
    setIsModalVisible(false); // Fechar a modal após excluir o item
  };

  const healthPercentage = useMemo(() => {
    const totalSelected = modalItemList.length;
    const healthyItems = modalItemList.filter(item => item.classificacao_saude === 'saudavel').length;
    return (healthyItems / totalSelected) * 100;
  }, [modalItemList]);

  let message = '';
  let additionalItems = [];

  if (healthPercentage === 100) {
    message = 'PARABÉNS';
  } else if (healthPercentage< 100 && healthPercentage >= 75) {
    message = 'PARABÉNS, PORÉM VOCÊ PODE MELHORAR';
    additionalItems = getRandomHealthyItems();
  } else if (healthPercentage >= 50) {
    message = 'HMM, VOCÊ FEZ BOAS ESCOLHAS, MAS PODE MELHORAR SUA LISTA';
    additionalItems = getModerateAndUnhealthyItems();
  } else {
    message = 'POXA, VOCÊ PODERIA SELECIONAR ALIMENTOS MAIS SAUDÁVEIS';
    additionalItems = getRandomHealthyItems();
  }

  function getRandomHealthyItems() {
    // Obtém os IDs dos itens saudáveis já selecionados
    const selectedHealthyItemIds = selectedItems
      .filter(itemId => {
        const selectedItem = data.find(item => item.id === itemId);
        return selectedItem && selectedItem.classificacao_saude === 'saudavel';
      });
  
    // Filtra os itens saudáveis que não foram selecionados
    const remainingHealthyItems = data.filter(item => {
      return (
        item.classificacao_saude === 'saudavel' &&
        !selectedHealthyItemIds.includes(item.id)
      );
    });
  
    // Obtém os itens saudáveis restantes para completar até 4 itens
    const additionalHealthyItems = remainingHealthyItems.slice(0, 4);
  
    return additionalHealthyItems;
  }
  
  

  function getModerateAndUnhealthyItems() {
    const selectedItemsData = randomizedData.filter(item => selectedItems.includes(item.id));
    const moderateAndUnhealthyItems = selectedItemsData.filter(item => item.classificacao_saude !== 'saudavel');
    return moderateAndUnhealthyItems.slice(0, 4);
  };

  const SelectedItemsModal = () => {
    return (
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: windowDimensions.height * 0.8 }]}>
            <Text style={styles.modalTitle}>Itens Selecionados</Text>
            <FlatList
              data={modalItemList}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    onLongPress={() => handleToggleItemSelectedModal(item.id)}
                  >
                    <View style={[styles.itemContainer, isItemSelectedModal(item.id) && styles.selectedItemCart]}>
                      <Image source={item.path_image} style={styles.itemImage} />
                      <Text style={styles.itemText}>{item.alimento}</Text>
                    </View>
                  </TouchableOpacity>
                  {isItemSelectedModal(item.id) && (
                    <TouchableOpacity onPress={handleDeleteItem}>
                      <Text style={styles.deleteButtonText}>Excluir item</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <>
              <TouchableOpacity style={styles.finishGameButton} onPress={() => {
                setIsSecondModalVisible(true); // Abrir a segunda modal
              }}>
                <Text style={styles.finishGameButtonText}>Finalizar Jogo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </>           
          </View>
        </View>
      </Modal>
    );
  };

  const FeedbackModal = () => {
    // Função para obter os itens saudáveis
    const getHealthyItems = () => {
      return additionalItems.filter(item => item.classificacao_saude === 'saudavel');
    };

    const handlePlayAgain = () => {
      // Limpar a lista selecionada
      setIsModalVisible(false);
      setSelectedItems([]);
      // Fechar a modal de feedback
      setIsSecondModalVisible(false);
      navigation.navigate('InitialPage');

    };
  
    return (
      <Modal
        transparent={true}
        visible={isSecondModalVisible}
        onRequestClose={() => setIsSecondModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.feedbackContainer, { maxHeight: windowDimensions.height * 0.8 }]}>
            <Text style={styles.modalTitle}>{message}</Text>
            {healthPercentage === 100 && (
              <>
                <View>
                  <Image source={imgFeedbackGood} />
                </View>
              </>
            )}
            {healthPercentage < 100 && healthPercentage >= 75 && (
              <>
                <Image source={imgFeedbackGood} />
                <Text style={styles.additionalItemsBadTitle}>Poderia Retirar</Text>
                <FlatList
                  data={getModerateAndUnhealthyItems()}
                  renderItem={({ item }) => (
                    <View style={styles.itensFeedback}>
                      <Text>{item.alimento}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => (item.id ? item.id.toString() : null)}
                />
              </>
            )}
            {healthPercentage < 75 && healthPercentage >= 50 && (
              <> 
                <Image source={imgFeedbackModerado} />
                <Text style={styles.additionalItemsGoodTitle}>Alimentos Recomendados</Text>
                <FlatList
                  data={getRandomHealthyItems()} // Função para obter os itens bons não selecionados
                  renderItem={({ item }) => (
                    <View style={styles.itensFeedback}>
                      <Text>{item.alimento}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => (item.id ? item.id.toString() : null)} // Verifica se item.id é nulo ou indefinido antes de chamar toString()
                />
                <Text style={styles.additionalItemsBadTitle}>Poderia Retirar</Text>
                <FlatList
                  data={getModerateAndUnhealthyItems()} // Filtrar os itens selecionados que não são saudáveis
                  renderItem={({ item }) => (
                    <View style={styles.itensFeedback}>
                      <Text>{item.alimento}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => (item.id ? item.id.toString() : null)} // Verifica se item.id é nulo ou indefinido antes de chamar toString()
                />
              </>
            )}
            {healthPercentage < 50 && (
              <>
                <Image source={imgFeedbackBad} />
                <Text style={styles.additionalItemsGoodTitle}>Alimentos Recomendados</Text>
                <FlatList
                  data={getRandomHealthyItems()}
                  renderItem={({ item }) => (
                    <View style={styles.itensFeedback}>
                      <Text>{item.alimento}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </>
            )}
            <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
              <Text style={styles.playAgainButtonText}>Jogar Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList 
        data={randomizedData}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleItemSelection(item.id)}
          >
            <View style={[styles.card, isItemSelected(item.id) && styles.selectedCard]}>
              <Text style={styles.cardText}>{item.alimento}</Text>
              <Image source={item.path_image} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />
      {selectedItems.length > 0 && (
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishList}>
          <Text style={styles.finishButtonText}>
            Finalizar Lista ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'itens'})
          </Text>
        </TouchableOpacity>
      )}
      <FooterBar/>
      <SelectedItemsModal />
      <FeedbackModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  selectedCard: {
    borderWidth: 2,
    borderColor: 'red',
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
  finishButton: {
    marginBottom: 65,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButton: {
    marginBottom: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    width: '70%',
    borderRadius: 10,
  },
  itensFeedback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedItemCart: {
    borderWidth: 2,
    borderColor: 'black',
  },
  finishGameButton: {
    marginTop: 10,
    marginBottom: -10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishGameButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  additionalItemsGoodTitle: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  additionalItemsBadTitle: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  healthMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playAgainButton: {
    marginTop: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomePage;
