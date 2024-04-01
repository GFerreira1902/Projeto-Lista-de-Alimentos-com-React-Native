import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeaderBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOME DO APP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CB3636',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HeaderBar;
