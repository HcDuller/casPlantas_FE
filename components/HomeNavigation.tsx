
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import {Image} from 'react-native'

const Tab = createBottomTabNavigator();

export default function HomeNavigator(props:any){

  const homePng = require('../assets/home-button.png');
  const clientPng = require('../assets/user-shape.png');
  const productPng = require('../assets/android-logo-1.png');
  const searchPng = require('../assets/searching-magnifying-glass.png');

  return (
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
  )
}