import React from 'react';
import { Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
//import Home from './components/Home';
import HomeNavigation from './components/HomeNavigation';
import NewOrder from './components/NewOrder';


const Tab = createBottomTabNavigator();



export default function App() {

  const homePng = require('./assets/home-button.png');
  const clientPng = require('./assets/user-shape.png');
  const productPng = require('./assets/android-logo-1.png');
  const searchPng = require('./assets/searching-magnifying-glass.png');

  let [fontsLoaded] = useFonts({
    'AlegreyaSans-Bold': require('./assets/fonts/AlegreyaSans-Bold.otf'),
    'AlegreyaSans-Regular': require('./assets/fonts/AlegreyaSans-Regular.otf')
  });
  if(!fontsLoaded){
    return <AppLoading />
  }else{
    /**
    return (
      <NavigationContainer>
        <Tab.Navigator         
          initialRouteName='home'
          tabBarOptions={{
            activeTintColor:'#21b548',          
          }}        
          >        
          <Tab.Screen 
            name='home' 
            options={{
              tabBarLabel:'Home',
              tabBarIcon:({color,size})=>(<Image source={homePng} style={{width:30,height:30,tintColor:color}}/>)
            }} 
            component={Home}
          />
          <Tab.Screen 
            name='products' 
            options={{
              tabBarLabel:'Products',
              tabBarIcon:({color,size})=>(<Image source={productPng} style={{width:30,height:30,tintColor:color}}/>)
            }}
            component={Home}/>
          <Tab.Screen 
            name='clients' 
            options={{
              tabBarLabel:'Clients',
              tabBarIcon:({color,size})=>(<Image source={clientPng} style={{width:30,height:30,tintColor:color}}/>)
            }}
          component={Home}/>
          <Tab.Screen 
            name='search' 
            options={{
              tabBarLabel:'Search',
              tabBarIcon:({color,size})=>(<Image source={searchPng} style={{width:30,height:30,tintColor:color}}/>)
            }}
            component={Home}/>          
        </Tab.Navigator>      
        <Stack.Screen
          name='newOrder'
          component={NewOrder}
        />
      </NavigationContainer>
    )
     */
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown:false}}
          >
          <Stack.Screen 
            name='homeNavigation'
            component={HomeNavigation}
            
          />
          <Stack.Screen 
            name='newOrder'
            component={NewOrder}
          />
        </Stack.Navigator>                
      </NavigationContainer>
    )
  }     
}