import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const FooterBar = ({ cartItemCount }) => {
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate("HomePage")
  }

  const handleEncyclopediaPress = () => {
    navigation.navigate("EncyclopediaPage");
  };

  const handleUserPress = () => {
    navigation.navigate("UserPage")
  };

  const handleConfigPress = () => {
    navigation.navigate("ConfigPage");
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={['#e53216', '#962727', '#e53216']}
    >
      <TouchableOpacity onPress={handleHomePress}>
        <MaterialCommunityIcons name="home" size={35} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEncyclopediaPress}>
        <MaterialCommunityIcons name="book-open-variant" size={35} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUserPress}>
        <MaterialCommunityIcons name="account" size={35} color="white" />
      </TouchableOpacity>
      {/* <TouchableOpacity>
                <View style={styles.cartContainer}>
                    <FontAwesome5 name="shopping-cart" size={26} color="white" />
                    {cartItemCount > 0 && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{cartItemCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity> */}
      <TouchableOpacity onPress={handleConfigPress}>
        <Ionicons name="settings" size={30} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    width: '100%',
    borderTopLeftRadius: 40
  },
  cartContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'black',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FooterBar;
