import React from 'react';
import { Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators,StackNavigationOptions } from '@react-navigation/stack';

const Stack = createStackNavigator();


import HomeNavigation   from  './components/HomeNavigation';
import NewOrder         from  './components/NewOrder';
import EditOrder        from  './components/EditOrder';
import NewEditProduct   from  './components/NewEditProduct';
import EditClient       from  './components/EditClient';


const Tab = createBottomTabNavigator();



export default function App() {

  let [fontsLoaded] = useFonts({
    'AlegreyaSans-Bold': require('./assets/fonts/AlegreyaSans-Bold.otf'),
    'AlegreyaSans-Regular': require('./assets/fonts/AlegreyaSans-Regular.otf')
  });
  if(!fontsLoaded){
    return <AppLoading />
  }else{    
    const screenOptions : StackNavigationOptions = {
      headerShown:false,
      cardStyleInterpolator : CardStyleInterpolators.forHorizontalIOS
    }
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={screenOptions}
          >
          <Stack.Screen 
            name='homeNavigation'
            component={HomeNavigation}
            
          />                              
          <Tab.Screen 
            name='newOrder'
            component={NewOrder}
          />        
          <Tab.Screen 
            name='editOrder'
            component={EditOrder}
          />  
          <Tab.Screen 
            name='prodEdit'
            component={NewEditProduct}
          />    
          <Tab.Screen 
            name='cliEdit'
            component={EditClient}
          />             
        </Stack.Navigator>                                
      </NavigationContainer>
    )
  }     
}