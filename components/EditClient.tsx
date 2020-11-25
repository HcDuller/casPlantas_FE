import React from 'react';
import {View,Dimensions,Text,StyleSheet,TextInput,Animated,Image,Easing,ScrollView,Pressable} from 'react-native';
import {TextInputChangeEventData,TextInputSubmitEditingEventData} from 'react-native';
import CentralCiclingContainer from './AuxComponents/CentralCiclingContainer';
import {client,colorPalet,fonts,address,ComponentWithNavigationProps}  from '../util/util';
import AddressComponent from './AuxComponents/AddressComponent'
import {  SafeAreaView,useSafeAreaInsets }    from 'react-native-safe-area-context';
import { useRoute,RouteProp } from '@react-navigation/native';


//@react-navigation/stack @react-navigation/bottom-tabs

interface EditClientProps extends ComponentWithNavigationProps{
  client?:client  
}
interface ProxyTextInputProps extends React.ComponentPropsWithoutRef<"view">{
  placeholder:string,
  value:string,
  valueChanger:(txt:string)=>void
}
interface ProxyPhoneInputProps extends ProxyTextInputProps{}

const {height,width}  = Dimensions.get('window');

export default function EditClient(props:EditClientProps) :  JSX.Element {
  const safeInsets = useSafeAreaInsets();
  const newClient : client  = {
    __v:'',
    _id:'',
    doc:'',
    address:{      
      detail:'detail(detalhe)',
      district:'district(bairro)',
      state:'State(estado)',
      number:0,
      street:'Street(rua)',
      town:'Town(cidade/municipio)',
      geometry:{
        lat:0,
        lng:0
      } 
    },
    name:'',
    anniversary:new Date(),
    instagram:'',
    since:new Date(),
    phones:['']
  }
  const params : {client:client} = (props.route.params as {client:client})
  const [client,setClient]  = React.useState<client>(params?.client ? params?.client : newClient);
  const title = params?.client ? 'Edição de Cliente' : 'Novo Cliente';
  function setName(txt:string){
    const temp  = {...client};
    temp.name = txt;
    setClient(temp);
  }
  function setPhone(txt:string,index:number){
    const temp  = {...client};
    temp.phones[index] = txt;
    setClient(temp);
  }
  function setAddress(newAddress:Partial<address>):void{
    const temp = {...client};
    newAddress?.street    ? temp.address.street   = newAddress.street   : undefined;
    newAddress?.number    ? temp.address.number   = newAddress.number   : undefined;
    newAddress?.detail    ? temp.address.detail   = newAddress.detail   : undefined;
    newAddress?.district  ? temp.address.district = newAddress.district : undefined;
    newAddress?.town      ? temp.address.town     = newAddress.town     : undefined;
    newAddress?.state     ? temp.address.state    = newAddress.state    : undefined;
    newAddress?.geometry  ? temp.address.geometry = newAddress.geometry : undefined;
    setClient(temp);    
  }
  return (    
    <SafeAreaView style={s.screen}>      
      <ScrollView contentContainerStyle={s.screen}>
        <View style={{width:'80%',height:height*0.1,alignItems:'center',marginVertical:height*0.02}}>        
          <Text style={s.title}>{title}</Text>
        </View>   
        <AddressComponent address={client.address} hocUpdater={setAddress}/>        
        <CentralCiclingContainer contentDisposition='center' content={<ProxyTextInput value={client.name} placeholder='Nome' valueChanger={setName}/>}/>
        <CentralCiclingContainer contentDisposition='center' content='Aniversario'/>
        <CentralCiclingContainer contentDisposition='center' content={<ProxyTextInput value={client.instagram} placeholder='Instagram' valueChanger={setName}/>}/>
        <CentralCiclingContainer contentDisposition='center' content='Desde'/>
        <CentralCiclingContainer contentDisposition='center' content={client.phones.map((el:string,index:number)=><ProxyPhoneInput key={`PhoneNumber-${index}`} value={client.phones[index]} placeholder='(xx)00000-0000' valueChanger={(txt:string)=>{setPhone(txt,index)}}/>)}/>        
      </ScrollView>
    </SafeAreaView>          
  )
}


function ProxyTextInput(props:ProxyTextInputProps):JSX.Element{
  const [innerValue,setInnerValue]  = React.useState<string>(props.value?props.value:'');

  function localChanger({ nativeEvent: { eventCount, target, text} }:{nativeEvent:TextInputChangeEventData}){    
    setInnerValue(text);
  }
  function hocUpdater({ nativeEvent: {text} }:{nativeEvent:TextInputSubmitEditingEventData}){
    props.valueChanger(text);
  }
  return (
    <TextInput 
      style={s.TextInputStyle}
      value={innerValue}
      onChange={localChanger}      
      placeholder={props.placeholder}
      //onChangeText={}
      onSubmitEditing={hocUpdater}      
    />
  )
}
function  ProxyPhoneInput(props:ProxyPhoneInputProps){
  const [innerValue,setInnerValue]  = React.useState<string>(props.value?props.value:'');

  function localChanger({ nativeEvent: { eventCount, target, text} }:{nativeEvent:TextInputChangeEventData}){    
    setInnerValue(text);
  }
  function hocUpdater({ nativeEvent: { text} }:{nativeEvent:TextInputSubmitEditingEventData}){
    props.valueChanger(text);
  }
  return (
    <TextInput 
      style={s.TextInputStyle}
      keyboardType='number-pad'
      value={innerValue}
      onChange={localChanger}      
      placeholder={props.placeholder}
      //onChangeText={}
      onSubmitEditing={hocUpdater}      
    />
  )
}

const s = StyleSheet.create({
  screen:{    
    flexGrow:1,
    justifyContent:'flex-end',    
    alignItems:'center',
    backgroundColor:colorPalet.grey,    
  },
  
  title:{    
    fontFamily:fonts.bold,
    color:colorPalet.darkGrey,
    fontSize:height*0.07
  },  
  TextInputStyle:{
    width:'100%',    
    fontFamily:'AlegreyaSans-Bold',
    fontSize:height*0.023,
    color:colorPalet.darkGrey,
    textAlign:'center',
    alignSelf:'center'
  }
})