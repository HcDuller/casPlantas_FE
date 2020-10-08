import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colorPalet} from '../util/util';
import CleanHeader from './AuxComponents/CleanHeader';
import {RouteProp,NavigationProp} from '@react-navigation/native';
import {ordersGetRequest} from '../util/requests';

export default function EditOrder({route,navigation}): JSX.Element{
  const {params} = route;
  const [orders,setOrders] = React.useState([]);
  async function teste(){
    try{
      const tempOrders : any = await ordersGetRequest();
      
      setOrders(tempOrders);
    }catch(e){
      console.log(e);
      setOrders([])
    }
  }
  return (
    <SafeAreaView>
      <CleanHeader />
      <View style={s.tempContainer}>
        <Text>{params._id ? params._id : 'Sem id de pedido'}</Text>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Text>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('home')}>
          <Text>Go Home</Text>
        </TouchableOpacity>
      </View>
      <View style={{width:'100%',height:75,justifyContent:'center'}}>
        <TouchableOpacity style={s.buttonT} onPress={teste}>
          <Text>{`${orders.length}`}</Text>
        </TouchableOpacity>
      </View>      
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  
  tempContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    height:75
  },
  buttonT:{
    backgroundColor:colorPalet.darkGreen,
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
})