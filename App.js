import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InitialPage from "./src/pages/InitialPage";
import HomePage from "./src/pages/HomePage";
import EncyclopediaPage from "./src/pages/EncyclopediaPage";
import ConfigPage from "./src/pages/ConfigPage";
import UserPage from "./src/pages/UserPage";
import HeaderBar from "./src/components/HeaderBar";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="InitialPage" 
          component={InitialPage} 
          // options={{
          //   header: () => <HeaderBar title=""/>,
          // }}  
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{
            header: () => <HeaderBar title="KOMIDINHAZ"/>,
          }}
        /> 
        <Stack.Screen
          name="EncyclopediaPage"
          component={EncyclopediaPage}
          options={{
            header: () => <HeaderBar title="ENCICLOPÉDIA DOS ALIMENTOS"/>,
          }}
        />
        <Stack.Screen
          name="UserPage"
          component={UserPage}
          options={{
            header: () => <HeaderBar title="ÁREA DO JOGADOR"/>,
          }}
        />
        <Stack.Screen
          name="ConfigPage"
          component={ConfigPage}
          options={{
            header: () => <HeaderBar title="CONFIGURAÇÕES"/>,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

