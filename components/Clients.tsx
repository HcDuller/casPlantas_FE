import React from 'react';
import {View,StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colorPalet, product, navProp} from '../util/util';
import {ComponentWithNavigationProps} from '../util/util';
import { AntDesign } from '@expo/vector-icons';



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const logoDimentions = Math.floor(height*0.1);
export default function Clients(props:ClientProps):JSX.Element{
  return (
    <SafeAreaView>
      <NavLine navigation={props.navigation} plusAction={()=>{}} route={props.route}/>
      <MapView 
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </SafeAreaView>
  )
}

function NavLine(props:NavLineProps): JSX.Element{
  return (
    <View style={{alignItems:"center",justifyContent:"center"}}>
      <View style={{height:(logoDimentions*0.5+10),backgroundColor:colorPalet.white,width:width,flexDirection:'row',justifyContent:'flex-end'}}>
        <TouchableOpacity 
          style={{justifyContent:'center',height:(logoDimentions*0.5+10),width:(width*0.1)}} 
          onPress={()=>props.navigation.navigate('prodEdit')}>
          <AntDesign name="pluscircle" size={logoDimentions*0.4} color={colorPalet.darkGreen} />
        </TouchableOpacity>
      </View>
      <View style={{height:(logoDimentions*0.5+10),width:width}}></View>
      <Image source={require('../assets/icons/logo.png')} style={{height:logoDimentions,width:logoDimentions,position:'absolute'}}/>
    </View>
  )
}
interface NavLineProps extends ComponentWithNavigationProps{
  plusAction:()=>void
}
interface ClientProps extends ComponentWithNavigationProps{
  
}

const s = StyleSheet.create({
  screen:{
    height:'100%',
    justifyContent:'flex-start',    
    backgroundColor:colorPalet.grey
  }
})