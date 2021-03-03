import React from 'react';
import {View,StyleSheet} from 'react-native';
import AutocompleteInput from './AutocompleteInput';
import CentralCiclingContainer from './CentralCiclingContainer';
import {colorPalet,fonts,address} from '../../util/util';

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
  const simple  = <CentralCiclingContainer content={`${props.address.street}, ${props.address.number} - ${props.address.town}`} onCenterPress={()=>{setEditing(true)}}/>;
  const editing = <AutocompleteInput hocUpdater={backToDisplay}/>


  return (
  <View>
    {!isEditing ? simple : editing}        
  </View>
  );
}

const s = StyleSheet.create({

})