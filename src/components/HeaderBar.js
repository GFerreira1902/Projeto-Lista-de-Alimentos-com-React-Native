import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HeaderBar = ({ title }) => {
  return (
    <View>
      <LinearGradient 
        style={styles.container} 
        colors={['#e53216', '#962727', '#e53216']}
      >
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: 70,
    borderBottomEndRadius: 30
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HeaderBar;
