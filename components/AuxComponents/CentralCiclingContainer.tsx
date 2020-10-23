import React from 'react';
import {View,Text,TouchableOpacity,Image, StyleSheet,Dimensions} from 'react-native'
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
      content?:string|JSX.Element|undefined
    }
    ){
  const leftFunction  = props.onLeftPress   ? props.onLeftPress   : ()=>{}
  const centerPress   = props.onRightPress  ? props.onRightPress  : ()=>{}
  const rightPress    = props.onCenterPress ? props.onLeftPress   : ()=>{}    
    
  const centralComponent = typeof props.content === 'string' ? <Text style={s.title}>{props.content}</Text> : props.content
  return (
    <View style={s.centralContainer}>
      <TouchableOpacity style={s.centralContainerComponents} onPress={leftFunction}>
        <Image source={images.leftArrow} style={s.centralContainerIcons}/>
      </TouchableOpacity>
      <TouchableOpacity style={s.centralContainerComponents} onPress={centerPress}>
        {centralComponent}
      </TouchableOpacity>  
      <TouchableOpacity style={s.centralContainerComponents} onPress={rightPress}>
        <Image source={images.rightArrow} style={s.centralContainerIcons} />
      </TouchableOpacity>
    </View>
  )
}
const s = StyleSheet.create({
  centralContainer:{
    backgroundColor:colorPalet.white,
    width:windowWidth*0.8,    
    flexDirection:'row',
    alignItems:'stretch',
    justifyContent:'space-between',    
    borderRadius:10,
    marginVertical:windowHeight*0.01,
    marginHorizontal:windowWidth*0.1
  },
  centralContainerComponents:{
    alignContent:'center',
    justifyContent:'center',
    minWidth:windowWidth*0.25,
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