import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, Modal, useWindowDimensions, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import { Audio } from 'expo-av';
import FooterBar from '../components/FooterBar';
import { data } from '../../dados'

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showConfirmationDeleteItensModal, setShowConfirmationDeleteItensModal] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [scoreUpdated, setScoreUpdated] = useState(false);
  const [sound, setSound] = useState(null);
  const [message, setMessage] = useState('');
  const [additionalItems, setAdditionalItems] = useState([]);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    getSavedItems();
    randomizeData();
    loadUserScore();
  }, []);

  useEffect(() => {
    saveItems(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playSoundFeedback = async (soundFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.setRateAsync(2.0, shouldCorrectPitch = true);
      await sound.playAsync();

      // Aguardar o término do som
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          // Mostrar o botão após o som terminar
          setIsButtonVisible(true);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing sound', error);
      setIsButtonVisible(true);
    }
  };

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

  const handleFinishGame = () => {
    setIsSecondModalVisible(true);
  };

  const randomizeData = () => {
    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    const randomizedItems = {
      saudavel: [],
      moderado: [],
      nao_saudavel: [],
    };

    shuffledData.forEach((item) => {
      if (randomizedItems[item.classificacao_saude].length < 8) {
        randomizedItems[item.classificacao_saude].push(item);
      }
    });

    const flattenedData = randomizedItems.saudavel.concat(randomizedItems.nao_saudavel, randomizedItems.moderado);
    
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Embaralha o array final
    const shuffledFlattenedData = shuffleArray(flattenedData);
    setRandomizedData(shuffledFlattenedData);
  };

  const isItemSelected = (itemId) => {
    return selectedItems.includes(itemId);
  };

  const modalItemList = useMemo(() => {
    return randomizedData.filter(item => selectedItems.includes(item.id));
  }, [randomizedData, selectedItems]);

  // Verifique se há itens não saudáveis selecionados
  const hasUnhealthyItems = useMemo(() => {
    return modalItemList.some(item => item.classificacao_saude === 'nao_saudavel');
  }, [modalItemList]);

  // Exiba o texto "Poderia Retirar" apenas se houver itens não saudáveis selecionados
  const renderPoderiaRetirarText = () => {
    if (hasUnhealthyItems) {
      return <Text style={styles.additionalItemsBadTitle}>Poderia Retirar</Text>;
    }
    return null;
  };

  const healthPercentage = useMemo(() => {
    const totalSelected = modalItemList.length;
    const healthyItems = modalItemList.filter(item => item.classificacao_saude === 'saudavel').length;
    return (healthyItems / totalSelected) * 100;
  }, [modalItemList]);

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

  const saveUserScore = async (value) => {
    try {
      await AsyncStorage.setItem('@userScore', value.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const incrementUserScore = (resultGame) => {
    setUserScore((prevScore) => {
      let newScore = prevScore;

      if (resultGame === 'PARABÉNS') {
        newScore += 5;
      } else if (resultGame === 'PARABÉNS, PORÉM VOCÊ PODE MELHORAR') {
        newScore += 3;
      } else if (resultGame === 'HMM, VOCÊ FEZ BOAS ESCOLHAS, MAS PODE MELHORAR SUA LISTA') {
        newScore += 2;
      } else if (resultGame === 'POXA, VOCÊ PODERIA SELECIONAR ALIMENTOS MAIS SAUDÁVEIS') {
        newScore += 1;
      }

      saveUserScore(newScore);
      return newScore;
    });
  };

  useEffect(() => {
    if (isSecondModalVisible && !scoreUpdated) {
      let newMessage = '';
      let newAdditionalItems = [];

      if (healthPercentage === 100) {
        newMessage = 'PARABÉNS';
        playSoundFeedback(require('../../assets/sounds/goodfeedback.mp3'));
      } else if (healthPercentage < 100 && healthPercentage >= 75) {
        newMessage = 'PARABÉNS, PORÉM VOCÊ PODE MELHORAR';
        newAdditionalItems = getRandomHealthyItems();
        playSoundFeedback(require('../../assets/sounds/goodfeedback.mp3'));
      } else if (healthPercentage >= 50) {
        newMessage = 'HMM, VOCÊ FEZ BOAS ESCOLHAS, MAS PODE MELHORAR SUA LISTA';
        newAdditionalItems = getUnhealthyItems();
        playSoundFeedback(require('../../assets/sounds/mediumfeedback.mp3'));
      } else if (healthPercentage < 50) {
        newMessage = 'POXA, VOCÊ PODERIA SELECIONAR ALIMENTOS MAIS SAUDÁVEIS';
        newAdditionalItems = getRandomHealthyItems();
        playSoundFeedback(require('../../assets/sounds/badfeedback.mp3'));
      }

      setMessage(newMessage);
      setAdditionalItems(newAdditionalItems);

      incrementUserScore(newMessage);
      setScoreUpdated(true);
      setIsButtonVisible(false);
    }
  }, [isSecondModalVisible, scoreUpdated, healthPercentage]);

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

  function getUnhealthyItems() {
    const selectedItemsData = randomizedData.filter(item => selectedItems.includes(item.id));
    const unhealthyItems = selectedItemsData.filter(item => item.classificacao_saude !== 'saudavel' && item.classificacao_saude !== 'moderado');
    return unhealthyItems.slice(0, 4);
  };

  const SelectedItemsModal = () => {
    const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([]); // Estado para armazenar os itens selecionados para exclusão
    const [showTrashIcon, setShowTrashIcon] = useState(false); // Estado para controlar a exibição do ícone de lixeira

    const handleToggleItemToDelete = (itemId) => {
      // Verifica se o item já está na lista de itens selecionados para exclusão
      const isSelected = selectedItemsToDelete.includes(itemId);

      // Se não houver mais itens selecionados, esconde a lixeira
      if (selectedItemsToDelete.length === 0) {
        setShowTrashIcon(false);
      }

      // Atualiza a lista de itens selecionados para exclusão
      setSelectedItemsToDelete((prevItems) => {
        if (isSelected) {
          // Se o item já estiver selecionado, remove-o da lista
          const updatedItems = prevItems.filter((id) => id !== itemId);
          return updatedItems;
        } else {
          // Se o item não estiver selecionado, adiciona-o à lista
          setShowTrashIcon(true); // Exibe a lixeira após o primeiro item ser selecionado
          return [...prevItems, itemId];
        }
      });
    };

    const handleDeleteSelectedItems = () => {
      // Remove os itens selecionados da lista de itens selecionados
      setSelectedItems(prevItems => prevItems.filter(id => !selectedItemsToDelete.includes(id)));

      // Limpa a lista de itens selecionados para exclusão e oculta o ícone da lixeira
      setSelectedItemsToDelete([]);
      setShowTrashIcon(false);
      setIsModalVisible(false); // Fechar a modal após a exclusão dos itens
    };

    const selectedItemsCount = selectedItemsToDelete.length; // Número de itens selecionados para exclusão

    return (
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: windowDimensions.height * 0.8 }]}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Itens Selecionados</Text>
              {selectedItemsCount > 0 && showTrashIcon && ( // Mostra o ícone de lixeira apenas se houver itens selecionados e o estado showTrashIcon for verdadeiro
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSelectedItems}>
                  <Octicons name="trash" size={24} color="white" />
                  <Text style={styles.deleteButtonText}>{selectedItemsCount}</Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={modalItemList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onLongPress={() => handleToggleItemToDelete(item.id)} // Opção de excluir acionada com um long press
                >
                  <View style={[styles.itemContainer, selectedItemsToDelete.includes(item.id) && styles.selectedItemCart]}>
                    <Image source={item.path_image} style={styles.itemImage} />
                    <Text style={[styles.itemText, selectedItemsToDelete.includes(item.id) && { color: 'black' }]}>{item.alimento}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.finishGameButton} onPress={() => setShowConfirmationModal(true)}>
                <Text style={styles.finishGameButtonText}>Finalizar Rodada</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
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
      setScoreUpdated(false);
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
              <View style={styles.centeredContent}>
                <Image source={imgFeedbackGood} />
                <Text style={styles.coinMessage}>
                  Você Ganhou <Text style={styles.greenText}>+5</Text> Pontos!
                </Text>
              </View>
            )}
            {healthPercentage < 100 && healthPercentage >= 75 && (
              <>
                <Image source={imgFeedbackGood} />
                {renderPoderiaRetirarText()}
                <FlatList
                  data={getUnhealthyItems()}
                  renderItem={({ item }) => (
                    <View style={styles.itensFeedback}>
                      <Text>{item.alimento}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => (item.id ? item.id.toString() : null)}
                />
                <View style={styles.centeredContent}>
                  <Text style={styles.coinMessage}>
                    Você Ganhou <Text style={styles.greenText}>+3</Text> Pontos!
                  </Text>
                </View>
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
                {renderPoderiaRetirarText()}
                <FlatList
                  data={getUnhealthyItems()} // Filtrar os itens selecionados que não são saudáveis
                  renderItem={({ item }) => (
                    <View style={styles.itensFeedback}>
                      <Text>{item.alimento}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => (item.id ? item.id.toString() : null)} // Verifica se item.id é nulo ou indefinido antes de chamar toString()
                />
                <View style={styles.centeredContent}>
                  <Text style={styles.coinMessage}>
                    Você Ganhou <Text style={styles.greenText}>+2</Text> Pontos!
                  </Text>
                </View>
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
                <View style={styles.centeredContent}>
                  <Text style={styles.coinMessage}>
                    Você Ganhou <Text style={styles.greenText}>+1</Text> Ponto!
                  </Text>
                </View>
              </>
            )}
            {isButtonVisible && ( // Mostrar o botão somente se `isButtonVisible` for verdadeiro
              <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
                <Text style={styles.playAgainButtonText}>Jogar Novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const ConfirmationModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showConfirmationModal}
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: windowDimensions.height * 0.4 }]}>
            <Text style={styles.modalConfirmationText}>Tem certeza de que deseja finalizar a rodada?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowConfirmationModal(false);
                  handleFinishGame();
                }}
              >
                <Text style={styles.modalButtonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmationModal(false)}
              >
                <Text style={styles.modalButtonText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ConfirmationDeleteItensModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showConfirmationDeleteItensModal}
        onRequestClose={() => setShowConfirmationDeleteItensModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: windowDimensions.height * 0.4 }]}>
            <Text style={styles.modalConfirmationText}>Tem certeza de que deseja excluir os itens selecionados?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowConfirmationDeleteItensModal(false);
                  handleDeleteSelectedItems();
                }}
              >
                <Text style={styles.modalButtonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmationDeleteItensModalModal(false)}
              >
                <Text style={styles.modalButtonText}>Não</Text>
              </TouchableOpacity>
            </View>
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
            onPress={() => { toggleItemSelection(item.id); }}
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

      <FooterBar />
      <SelectedItemsModal />
      <FeedbackModal />
      <ConfirmationModal />
      <ConfirmationDeleteItensModal />
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
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
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
  selectedItemCart: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
  },
  selectedItemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 2,
  },
  selectedItemText: {
    fontSize: 16,
    color: 'black',
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
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinMessage: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  greenText: {
    color: 'darkgreen',
    fontWeight: 'bold',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    width: '40%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  confirmButton: {
    backgroundColor: '#27AE60',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
    marginTop: 50,
    marginBottom: -10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishGameButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
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
  textTesteScore: {
    fontSize: 24,
    marginBottom: 60,
  },
});

export default HomePage;