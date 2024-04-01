import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const FooterBar = () => {
    const navigation = useNavigation();

    const handleHomePress = () => {
        navigation.navigate("HomeScreen")
    }

    const handleEncyclopediaPress = () => {
        navigation.navigate("EncyclopediaScreen");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleHomePress}>
                <MaterialCommunityIcons name="home" size={35} color="white" />
            </TouchableOpacity>          
            <TouchableOpacity onPress={handleEncyclopediaPress}>
                <MaterialCommunityIcons name="book-open-variant" size={35} color="white" />
            </TouchableOpacity>
            <FontAwesome5 name="shopping-cart" size={26} color="white" />
            <Ionicons name="settings" size={30} color="white" />
        </View> 
    ); 
};

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#CB3636',
      height: 60,
      width: '100%',
    },
});

export default FooterBar;

