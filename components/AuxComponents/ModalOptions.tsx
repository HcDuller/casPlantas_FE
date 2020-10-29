import React from 'react';
import {colorPalet, fonts} from '../../util/util'
import {View,Dimensions,StyleSheet,TextInput,Text,Image,Switch} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



interface ModalOptionsProps extends React.ComponentPropsWithoutRef<"view">{
  visible:boolean;  
  navigation?:any
}

export default function ModalOptions(props:ModalOptionsProps){
  
  const insets = useSafeAreaInsets();//{ top: number, right: number, bottom: number, left: number }
 
  
  if(!props.visible){
    return <></>
  }
  return (    
    <View style={[s.screen,{paddingTop:(insets.top+height*0.15+10)}]}>
      <View style={[s.centralContainer]}>
        <FeatureNameInput />
        <FeatureOptionNameInput />
        <FeatureOptionNameInput />
        <FeatureOptionNameInput />
        <FeatureOptionNameInput />
        <FeatureOptionNameInput />
        <NavLine />
      </View>
    </View>
  )
}

function FeatureNameInput(props:React.ComponentPropsWithoutRef<"input">){
  return  (
    <TextInput 
      placeholder='Nome da Característica'
      style={[s.hairlinedContainer,s.featureNameInput]}      
    />
  )
}
function FeatureOptionNameInput(props:React.ComponentPropsWithoutRef<"view">){
  const [enabled,setEnabled]  = React.useState(true);
  return  (
    <View style={[s.hairlinedContainer,s.featureOptionNameContainer]}>
      <Switch 
        thumbColor={colorPalet.white}
        trackColor={{true:colorPalet.darkGreen,false:colorPalet.grey}}
        onValueChange={()=>setEnabled(!enabled)}
        value={enabled}
        style={{marginRight:10}}
      />
      <TextInput 
        placeholder='Variante'
      />
    </View>
  )
}
function NavLine(props:React.ComponentPropsWithoutRef<"view">){
  return  (
    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:height*0.01}}>
      <View style={{flexDirection:'row'}}>
        <Image source={images.leftArrow}  style={{height:iconSize,width:iconSize}}/>
        <Text style={s.navigationText}>OH NO</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <Image source={images.plus}       style={{height:iconSize,width:iconSize}}/>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text style={[s.navigationText,{color:colorPalet.darkGreen}]}>GO GO</Text>
        <Image source={images.rightArrow} style={{height:iconSize,width:iconSize,tintColor:colorPalet.darkGreen}}/>
      </View>      
    </View>
  )
}
const {width,height}  = Dimensions.get('window');
const iconSize  = height*0.028;
const images = {
  leftArrow   : require('../../assets/icons/Arrow_L.png'),
  rightArrow  : require('../../assets/icons/Arrow_R.png'),
  plus        : require('../../assets/icons/Plus.png')
};
const s = StyleSheet.create({
  screen:{
    backgroundColor:'rgba(0,0,0,0.5)',
    height:height,
    width:width,
    position:'absolute',
    top:0,
    left:0,
    zIndex:2,    
    justifyContent:'flex-start'    
  },
  centralContainer:{
    backgroundColor:colorPalet.white,
    width:width*0.8,            
    borderRadius:10,
    marginVertical:height*0.01,
    marginHorizontal:width*0.1,
    paddingVertical:10,
    paddingHorizontal:5
    
  },
  hairlinedContainer:{
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:colorPalet.darkGrey,
    borderRadius:10,
    height:height*0.05,
  },
  featureNameInput:{        
    fontFamily:fonts.regular,
    fontSize:height*0.022
  },
  featureOptionNameContainer:{
    marginLeft:width*0.1,
    marginVertical:height*0.01,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  navigationText:{
    fontSize:height*0.02,
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey
  }
})