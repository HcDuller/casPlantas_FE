import React from 'react';
import {View,StyleSheet,Dimensions,Image,TouchableOpacity,Pressable,Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colorPalet, client, navProp} from '../util/util';
import {ComponentWithNavigationProps} from '../util/util';
import {getClients} from '../util/requests';
import { AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const logoDimentions = Math.floor(height*0.1);
export default function Clients(props:ClientsProps):JSX.Element{
  const [clients,setClients] = React.useState<client[]>([])
  React.useEffect(()=>{
    const clearFocusEvent = props.navigation.addListener('focus',()=>{
      (async ()=>{
        try{
          setClients(await getClients());
          
        }catch(e){
          console.log('getClient Falhou')
        }
      })()
    });
    return clearFocusEvent            
  },[])
  return (
    <SafeAreaView style={s.screen}>
      <NavLine navigation={props.navigation} plusAction={()=>{props.navigation.navigate('cliEdit')}} route={props.route}/> 
      <FlatList 
        data={clients}
        renderItem={renderCard}
        keyExtractor={(e)=>e._id}
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
          onPress={props.plusAction}>
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
interface ClientsProps extends ComponentWithNavigationProps{  
}
interface ClientCardProps extends React.ComponentPropsWithoutRef<"view">{
  clientData:client
}
function renderCard({item}:{item:client}){
  return <ClientCard clientData={item} /> 
}
function ClientCard(props:ClientCardProps):JSX.Element{
  const nav = useNavigation();
  const temp = {...props.clientData}  
  return (
    <Pressable 
      onPress={()=>nav.navigate('cliEdit',{client:props.clientData})}
      style={cs.card}>
      <Text style={s.text}>{props.clientData.name}</Text>
      <Text style={s.text}>{props.clientData.address.street}</Text>
    </Pressable>
  )
}

const cs =  StyleSheet.create({
  card:{
    marginVertical:height*0.01,
    width:'80%',    
    borderRadius:15,    
    alignSelf:'center',
    backgroundColor:colorPalet.white,
    padding:15
  }
})
const s = StyleSheet.create({
  screen:{
    height:'100%',
    justifyContent:'flex-start',    
    backgroundColor:colorPalet.grey
  },
  text:{
    width:'100%',    
    fontFamily:'AlegreyaSans-Bold',
    fontSize:height*0.023,
    color:colorPalet.darkGrey,    
    alignSelf:'center'
  }
})