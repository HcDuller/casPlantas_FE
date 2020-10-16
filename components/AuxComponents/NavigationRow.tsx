import React from 'react';
import {View,TouchableOpacity,Image,Text,StyleSheet,Dimensions} from 'react-native';
import ProgressBar from './ProgressBar';
import {colorPalet} from '../../util/util';

export default function NavigationRow({ohNoPress,goGoPress,loading=false}:{ohNoPress:()=>any,goGoPress:()=>any,loading:boolean}): JSX.Element {
  
  return (
    <View style={{width:'100%'}}>
      <View style={s.navigationLine}>
        <TouchableOpacity style={s.navigationTouchable} onPress={ohNoPress}>
          <Image source={images.leftArrow} style={s.navigationIcons}/>
          <Text style={s.navigationText}>{`OH NO`}</Text>          
        </TouchableOpacity>        
        <TouchableOpacity style={s.navigationTouchable} onPress={goGoPress}>    
          <Text style={[s.navigationText,{color:colorPalet.darkGreen}]}>{`GO GO`}</Text>
          <Image source={images.rightArrow} style={[s.navigationIcons,{tintColor:colorPalet.darkGreen}]}/>
        </TouchableOpacity>          
      </View>
      {loading?(<ProgressBar width={windowWidth} height={windowHeight*0.005} color={colorPalet.darkGreen} duration={2000}/>):undefined}
    </View>
  )
}
const windowHeight  = Dimensions.get('window').height;
const windowWidth   = Dimensions.get('window').width;
const images = {
  leftArrow:  require('../../assets/icons/Arrow_L.png'),
  rightArrow: require('../../assets/icons/Arrow_R.png')
}
const s = StyleSheet.create({
  navigationLine:{
    height:windowHeight*0.05,
    paddingHorizontal:windowWidth*0.04,
    width:'100%',
    flexDirection:'row',
    alignContent:'flex-start',
    alignItems:'flex-start',
    justifyContent:'space-between'
  },
  navigationTouchable:{
    flexDirection:'row'
  },
  navigationText:{
    fontFamily:'AlegreyaSans-Regular',
    fontSize:windowHeight*0.022,
    color:colorPalet.darkGrey,    
    alignSelf:'center'
  },
  navigationIcons:{
    height:windowHeight*0.035,
    width:windowHeight*0.035
  }
})
