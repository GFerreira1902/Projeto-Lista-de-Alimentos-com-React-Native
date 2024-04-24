import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Modal, TouchableOpacity, Image, TextInput } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import FooterBar from '../components/FooterBar';
import { data } from '../../dados';

const windowWidth = Dimensions.get('window').width;

const EncyclopediaPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

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
          <Image source={item.path_image} style={styles.image} />
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

  const filteredData = data
    .filter(item => item.alimento.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (filterOption) {
        case 'AZ':
          return a.alimento.localeCompare(b.alimento);
        case 'ZA':
          return b.alimento.localeCompare(a.alimento);
        default:
          return 0;
      }
    });

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Octicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar Alimento"
            placeholderTextColor="#9E9E9E"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <Octicons name="filter" size={24} color="red" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
      <Modal visible={isFilterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setFilterOption('AZ'); setSelectedFilter('AZ'); setIsFilterModalVisible(false); }}>
              <View style={styles.filterOptionContainer}>
                <Text style={styles.filterOption}>Ordem Alfabética: A-Z</Text>
                {selectedFilter === 'AZ' && <Octicons name="check" size={20} color="red" />}
              </View>
            </TouchableOpacity>
            <View style={styles.separator}></View>
            <TouchableOpacity onPress={() => { setFilterOption('ZA'); setSelectedFilter('ZA'); setIsFilterModalVisible(false); }}>
              <View style={styles.filterOptionContainer}>
                <Text style={styles.filterOption}>Ordem Alfabética: Z-A</Text>
                {selectedFilter === 'ZA' && <Octicons name="check" size={20} color="red" />}
              </View>
            </TouchableOpacity>
            <View style={styles.separator}></View>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={filteredData}
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
  searchBar: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  filterIcon: {
    marginLeft: 10,
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
    shadowColor: '#00000',
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
  },
  filterOptionContainer: {
    flexDirection: 'row',
  },
  filterOption: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingRight: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
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
