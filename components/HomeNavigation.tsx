
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import {Image} from 'react-native'
import {colorPalet} from '../util/util';

const Tab = createBottomTabNavigator();

export default function HomeNavigator(props:any){

  const homePng = require('../assets/icons/Home.png');
  const clientPng = require('../assets/icons/Entities.png');
  const productPng = require('../assets/icons/Product.png');
  const searchPng = require('../assets/icons/Search.png');

  return (
    <Tab.Navigator         
      initialRouteName='home'
      lazy={true}      
      tabBarOptions={{
        activeTintColor:colorPalet.darkGreen,      
        showLabel:false    
      }}        
      >        
      <Tab.Screen 
        name='home' 
        options={{          
          tabBarIcon:({color,size})=>(<Image source={homePng} style={{width:30,height:30,tintColor:color}}/>)
        }} 
        component={Home}
      />      
      <Tab.Screen 
        name='clients' 
        options={{                    
          tabBarIcon:({color,size})=>(<Image source={clientPng} style={{width:30,height:30,tintColor:color}}/>)
        }}
      component={Home}/>
      <Tab.Screen 
        name='products' 
        options={{          
          tabBarIcon:({color,size})=>(<Image source={productPng} style={{width:30,height:30,tintColor:color}}/>)
        }}
        component={Home}/>
      <Tab.Screen 
        name='search' 
        options={{          
          tabBarIcon:({color,size})=>(<Image source={searchPng} style={{width:30,height:30,tintColor:color}}/>)
        }}
        component={Home}/>          
    </Tab.Navigator>
  )
}