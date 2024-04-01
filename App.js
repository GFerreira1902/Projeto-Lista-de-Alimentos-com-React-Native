import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InitialScreen from "./src/pages/InitialScreen";
import HomeScreen from "./src/pages/HomeScreen";
import EncyclopediaScreen from "./src/pages/EncyclopediaScreen";
import HeaderBar from "./src/components/HeaderBar";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="InitialScreen" 
          component={InitialScreen} 
          options={{
            header: () => <HeaderBar />,
          }}  
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            header: () => <HeaderBar />,
          }}
        /> 
        <Stack.Screen
          name="EncyclopediaScreen"
          component={EncyclopediaScreen}
          options={{
            header: () => <HeaderBar />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

