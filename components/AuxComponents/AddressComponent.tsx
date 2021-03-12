import React from 'react';
import {View,StyleSheet,Text,Dimensions,Image,TouchableOpacity} from 'react-native';
import AutocompleteInput from './AutocompleteInput';
import CentralCiclingContainer from './CentralCiclingContainer';
import {colorPalet,fonts,address} from '../../util/util';

const {height,width}  = Dimensions.get('window');

type ExtendedComponent<
  P extends React.ElementType,
  T extends object = {} 
  > = Omit<React.ComponentPropsWithRef<P>,keyof T> & T

interface AddressComponentProps extends React.ComponentPropsWithoutRef<'view'>{
  hocUpdater:(a:address)=>void,
  address:address
}

export default function AddressComponent(props:AddressComponentProps){
  const [isEditing,setEditing]  = React.useState<boolean>(false);
  
  function backToDisplay(a:address):void{
    try{
      props.hocUpdater(a);
      setEditing(false);
    }catch(e){
      alert('Endereco deu PAU!')
    }
  }
  const AddressF = ()=><Text style={[s.addressDefaults,s.addressF]}>{`${props.address.street}, ${props.address.number}`}</Text>
  const AddressS = ()=><Text style={[s.addressDefaults,s.addressS]}>{`${props.address.district}`}</Text>
  const AddressT = ()=><Text style={[s.addressDefaults,s.addressS,{paddingBottom:4}]}>{`${props.address.town}`}</Text>
  const AddressWrapper = () => (
    <View style={{flexDirection:'row'}}>
      <Image source={require('../../assets/icons/pin.png')} style={{height:height*0.05,width:height*0.05,alignSelf:'center',marginHorizontal:width*0.06,tintColor:colorPalet.darkGrey,marginVertical:0}}/>
      <View style={{flexDirection:'column'}}>
        <AddressF/>
        <AddressS/>
        <AddressT/>
      </View>
    </View>
  )  
  const simple =  <TouchableOpacity style={s.container} children={<AddressWrapper />} onPress={()=>{setEditing(true)}}/>
  const editing = <AutocompleteInput hocUpdater={backToDisplay} closeEditing={()=>setEditing(false)}/>


  return (
  <View>
    {!isEditing ? simple : editing}        
  </View>
  );
}

const s = StyleSheet.create({
  addressDefaults:{       
    width:'100%',
    textAlign:'left',
    alignSelf:'center', 
  },
  addressF:{
    fontFamily:fonts.bold,
    fontSize:height*0.023,
    color:colorPalet.darkGrey,   
  },
  addressS:{
    fontFamily:fonts.regular,
    fontSize:height*0.018,
    color:colorPalet.darkGrey,       
  },
  container:{
    backgroundColor:colorPalet.white,
    width:width*0.8,        
    alignItems:'stretch',
    justifyContent:'center',    
    borderRadius:10,
    marginVertical:height*0.01,
    marginHorizontal:width*0.1,
    paddingVertical:height*0.015
  }
})