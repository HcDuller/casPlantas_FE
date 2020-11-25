import React from 'react';
import {View,Text,TouchableOpacity,Image, StyleSheet,Dimensions} from 'react-native';
import {KeyboardAvoidingView} from 'react-native'
import {colorPalet,fonts} from '../../util/util';
const {width:windowWidth,height:windowHeight} = Dimensions.get('window');

const images = {
  leftArrow:  require('../../assets/icons/Arrow_L.png'),
  rightArrow: require('../../assets/icons/Arrow_R.png')
}

export default function CentralCiclingContainer(
    props:{
      onLeftPress?:()=>void,
      onCenterPress?:()=>void,
      onRightPress?:()=>void,
      content?:string|JSX.Element|undefined|JSX.Element[],
      title?:string,
      contentDisposition?: 'center'|'space-between'
    }
  ){
  const ctDisposition = props.contentDisposition ? props.contentDisposition : 'center';
  const s = StyleSheet.create({
    centralContainer:{    
      width:windowWidth*0.8,        
      alignItems:'center',
      justifyContent:'center',    
      borderRadius:10,
      marginVertical:windowHeight*0.01,
      marginHorizontal:windowWidth*0.1
    },
    cicleContainer:{
      backgroundColor:colorPalet.white,
      width:windowWidth*0.8,    
      flexDirection:'row',
      alignItems:'stretch',
      justifyContent:ctDisposition,    
      borderRadius:10,
      marginVertical:windowHeight*0.01,
      marginHorizontal:windowWidth*0.1
    },
    centralContainerComponents:{
      alignContent:'center',
      justifyContent:'center',
      //minWidth:windowWidth*0.25,
      flexGrow:1,
      height:windowHeight*0.06
    },
    centralContainerIcons:{    
      alignSelf:'center',    
      height:windowHeight*0.02,
      width:windowHeight*0.02      
    },
    title:{
      fontFamily:'AlegreyaSans-Bold',
      fontSize:windowHeight*0.023,
      color:colorPalet.darkGrey,
      textAlign:'center',
      alignSelf:'center'
    }
  
  })
  

  const leftFunction  = props.onLeftPress     ? props.onLeftPress     : ()=>{}
  const centerPress   = props.onCenterPress   ? props.onCenterPress   : ()=>{}
  const rightPress    = props.onRightPress    ? props.onRightPress    : ()=>{}    

  const headerComponent = props.title ? <Text style={s.title}>{props.title}</Text> : undefined   
  const centralComponent = typeof props.content === 'string' ? <Text style={s.title}>{props.content}</Text> : props.content
  
  const leftComponent = (
    <TouchableOpacity style={s.centralContainerComponents} onPress={leftFunction}>
      <Image source={images.leftArrow} style={s.centralContainerIcons}/>
    </TouchableOpacity>
  )
  const rightComponent = (
    <TouchableOpacity style={s.centralContainerComponents} onPress={rightPress}>
        <Image source={images.rightArrow} style={s.centralContainerIcons} />
      </TouchableOpacity>
  )
  
  const conditionalLeftArrowComponent = props.onLeftPress ? leftComponent : undefined;
  const conditionalRightArrowComponent = props.onRightPress ? rightComponent : undefined;

  return (
    <KeyboardAvoidingView style={s.centralContainer}>
      {headerComponent}
      <View style={s.cicleContainer}>              
        {conditionalLeftArrowComponent}
        <TouchableOpacity style={s.centralContainerComponents} onPress={centerPress}>
          {centralComponent}
        </TouchableOpacity>  
        {conditionalRightArrowComponent}
      </View>
    </KeyboardAvoidingView>
  )
}
