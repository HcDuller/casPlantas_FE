import React from 'react';
import {colorPalet} from '../../util/util';
import {View,Image,StyleSheet,Dimensions} from 'react-native';

const defaultHeigth = Dimensions.get('window').height*0.1;

export default function CleanHeader({logoHeight = defaultHeigth}:{logoHeight?:number}) :JSX.Element{  
  const s = React.useMemo(()=>{
    return StyleSheet.create({
      logoHeaderContainer:{
        alignItems:"center",
        justifyContent:"flex-start",
        height:logoHeight+10,    
      },
      logoHeaderHalfHeight:{
        height:logoHeight*0.5+10,
        width:'100%',
      },
      logoHeaderTopHalf:{    
        backgroundColor:colorPalet.white
      },
      logoHeaderBottomHalf:{
        backgroundColor:colorPalet.grey,
        height:logoHeight*0.5,
        flexDirection:'row',
        justifyContent:'space-between'
      },    
      headerLogo:{    
        marginTop:10,
        height:logoHeight,
        width:logoHeight,
        position:'absolute'
      },
    })
  },[logoHeight]);
  return(
    <View style={s.logoHeaderContainer}>
      <View style={[s.logoHeaderTopHalf,s.logoHeaderHalfHeight]}/>
      <View style={[s.logoHeaderHalfHeight,s.logoHeaderBottomHalf]}/>                          
      <Image source={require('../../assets/icons/logo.png')} style={s.headerLogo}/>
    </View> 
  )
}
