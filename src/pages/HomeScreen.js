import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FooterBar from '../components/FooterBar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Conteúdo da Nova Página</Text>
      <FooterBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
