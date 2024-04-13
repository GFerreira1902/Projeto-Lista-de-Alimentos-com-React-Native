import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const InitialPage = () => {
  const navigation = useNavigation();

  const handleStartGame = () => {
    navigation.navigate('HomePage');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>INICIAR JOGO</Text>
      </TouchableOpacity>
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
    fontStyle: 'bold'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default InitialPage;
