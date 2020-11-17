import React from 'react';
import {View,Dimensions,Text,StyleSheet,TextInput} from 'react-native';
import {client,colorPalet}  from '../util/util';
import {  SafeAreaView }    from 'react-native-safe-area-context';
import {  LinearGradient }  from 'expo-linear-gradient';

interface EditClientProps extends React.ComponentPropsWithoutRef<"view">{
  client?:client
}
const {height,width}  = Dimensions.get('window');
export default function EditClient(props:EditClientProps) :  JSX.Element {
  
  const [client,setClient]  = React.useState<client>(props.client ? props.client : ({} as client))

  return (
    <SafeAreaView style={s.screen}>   
      <View style={{width:'60%',height:height*0.1}}>
        <LinearGradient
          // Background Linear Gradient
          colors={[colorPalet.white,colorPalet.green]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height:'100%',
            width:'100%'          
          }}
        />  
        <Text>TESTE</Text>
      </View>   
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  screen:{
    height:'100%',
    justifyContent:'flex-start',    
    alignItems:'center',
    backgroundColor:colorPalet.grey
  }
})