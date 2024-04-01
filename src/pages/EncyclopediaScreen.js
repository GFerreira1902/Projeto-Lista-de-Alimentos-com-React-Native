import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import FooterBar from '../components/FooterBar';

const windowWidth = Dimensions.get('window').width;
const data = require('../../dados.json');

const renderCard = ({ item }) => {
    return (
        <View style={styles.card}>
            <Text style>{item.alimento}</Text>
        </View>
    );
};

const EncyclopediaScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList 
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />     
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
    flatListContent: {
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    card: {
      width: (windowWidth - 30) / 2, // Espaçamento horizontal entre os cards
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
    },
  });

export default EncyclopediaScreen;
