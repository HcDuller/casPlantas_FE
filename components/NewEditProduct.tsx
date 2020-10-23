import React from 'react';
import {View,Text,StyleSheet,Dimensions} from 'react-native';
import CleanHeader from './AuxComponents/CleanHeader';
import NavigationRow from './AuxComponents/NavigationRow';
import {colorPalet,fonts,fontStyle,product} from '../util/util';
import { SafeAreaView } from 'react-native-safe-area-context';
import CentralCiclingContainer from './AuxComponents/CentralCiclingContainer';


const {width,height} = Dimensions.get('window');

export default function NewEditProduct() : JSX.Element{
  const [product,setProduct]  = React.useState<product | undefined>(undefined);
  return (
    <SafeAreaView style={{backgroundColor:colorPalet.grey,height:'100%'}}>
      <CleanHeader/>
      <NavigationRow ohNoPress={()=>{}} goGoPress={()=>{}} loading={false}/>
      <CentralCiclingContainer />
    </SafeAreaView>
  )
}

const fontStyleObj = fontStyle(width);

const s = StyleSheet.create({
  ...fontStyleObj
})