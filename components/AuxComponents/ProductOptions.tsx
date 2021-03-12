import React from 'react';
import {View,StyleSheet,Text,Dimensions,Pressable,Image,Animated,Easing} from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import {productOptions,colorPalet,fonts} from '../../util/util'

interface ProdOptProps extends React.ComponentPropsWithoutRef<"view">{
  data:productOptions[];
  onNewOrEdit:(e?:productOptions)=>void;  
  onActiveChange:(index:number,active:boolean)=>void
}
interface OptionLineProps extends React.ComponentPropsWithoutRef<"view">{
  data: productOptions
}
interface ProductOptionRow extends React.ComponentPropsWithRef<"view">{
  option: productOptions;  
  onEdit:()=>void;
  onActiveChange:(active:boolean)=>void
}
const {width,height}  = Dimensions.get('window')
export default function ProductOptions(props:ProdOptProps): JSX.Element{
  
  const [instantPressed,setInstantPressed]  = React.useState(false);  
  
  function pressableStyle({pressed}:{pressed:boolean}) {
    const fs = StyleSheet.create({
      pressable:{
        backgroundColor:colorPalet.darkGreen,
        opacity: instantPressed ? 0.5 : 1,
        height:height*0.04,
        width:width*0.7,
        marginVertical:height*0.01,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
      }
    })
    return fs.pressable
  }
  function pressNew(){
    props.onNewOrEdit();
    setInstantPressed(true);
    setTimeout(() => {    
      setInstantPressed(false)
    }, 50);
  }
  return (
    <View style={s.centralContainer}    >
      <Pressable
        style={pressableStyle}
        onPress={pressNew}        
      >
        <Text style={s.newOptionButtonText}>Nova Característica</Text>            
      </Pressable>    
      {props.data.map((el:productOptions,index:number,array:productOptions[])=>{return <ProductOptionRow onEdit={()=>props.onNewOrEdit(el)} option={el} onActiveChange={(active:boolean)=>{props.onActiveChange(index,active)}} key={`${el.name}-${index}-opt-${array.length}`}/>})}      
    </View>
  )
}
function ProductOptionRow(props:ProductOptionRow): JSX.Element{
  
  const availableOpt = props.option.options.filter(el=>el.active);
  const [enabledOpt,setEnabledOpt]      = React.useState(props.option.active);
  //const [availableOpt,setAvailableOpt]  = React.useState(testeTemp);
  const [activeOpt,setActiveOpt]        = React.useState(0);

  const tiltBase  = React.useRef<Animated.Value>(new Animated.Value(0)).current;
  const colorBase = React.useRef<Animated.Value>(new Animated.Value(0)).current;

  const msToEdit    = 1000;
  const tiltDuration  = 40;

  const tiltLeft    = Animated.timing(tiltBase,{toValue:-1,duration:tiltDuration/2,useNativeDriver:false});
  const tiltRight   = Animated.timing(tiltBase,{toValue:1,duration:tiltDuration/2,useNativeDriver:false});
  const straighten  = Animated.timing(tiltBase,{toValue:0,duration:tiltDuration/4,useNativeDriver:false});
  const shake       = Animated.loop(Animated.sequence([tiltRight,tiltLeft,tiltRight,straighten]),{iterations:-1});  

  const holding     = Animated.timing(colorBase,{toValue:1,duration:msToEdit,easing:Easing.ease,useNativeDriver:false})

  const degTilt     = tiltBase.interpolate({inputRange:[-1,1],outputRange:['-2deg','2deg']});
  const finalColor  = colorBase.interpolate({inputRange:[0,1],outputRange:[colorPalet.white,colorPalet.green]});

  function cicleSubOptions(increment:number):void{
    const maxIndex = availableOpt.length -1;    
    const tempIndex = activeOpt + increment;    
    let newIndex : number = tempIndex;
    if(tempIndex > maxIndex){
      newIndex = 0;
    }else if(tempIndex < 0){
      newIndex = maxIndex;
    }    
    setActiveOpt(newIndex);
  }
  function changeActiveState(){    
    const prevState = enabledOpt;
    setEnabledOpt(!prevState);
    props.onActiveChange(!prevState);
    //props.onEdit(); //temporary use for debuggin
  }
 
  return (
    <Animated.View style={[s.hairlinedContainer,s.optionLine,{backgroundColor:finalColor,transform:[{rotate:degTilt}]}]}>
      <Pressable
        style={s.optionLine}
        delayLongPress={msToEdit}
        onPressIn={()=>{Animated.parallel([shake,holding]).start()}}
        onPressOut={()=>{shake.reset();holding.reset();straighten.start()}}
        onLongPress={props.onEdit}
      >
        <View style={{width:'40%',justifyContent:'flex-start',flexDirection:'row',alignItems:'center'}}>
          <Switch 
            thumbColor={colorPalet.grey}
            trackColor={{false:colorPalet.grey,true:colorPalet.darkGreen}}
            value={enabledOpt}
            onValueChange={changeActiveState}
          />
          <Text style={s.optionNameText}>{props.option.name.charAt(0).toUpperCase()+props.option.name.slice(1)}</Text>
        </View>
        <View style={[s.hairlinedContainer,{width:'50%',flexDirection:'row',justifyContent:'space-between',height:'100%',alignItems:'center'}]}>
          <Pressable onPress={()=>cicleSubOptions(-1)} style={{height:'100%',justifyContent:'center'}}>
            <Image style={[s.arrows,{marginLeft:5,marginRight:5}]} source={images.leftArrow}/>
          </Pressable>
            <Text style={s.subOptionText}>{availableOpt[activeOpt] ? availableOpt[activeOpt].name : ''}</Text>
          <Pressable onPress={()=>cicleSubOptions(1)} style={{height:'100%',justifyContent:'center'}}>
            <Image style={[s.arrows,{marginRight:5,marginLeft:5}]} source={images.rightArrow}/>
          </Pressable>
        </View>      
      </Pressable>
    </Animated.View>
  )
}
const images = {
  leftArrow   : require('../../assets/icons/Arrow_L.png'),
  rightArrow  : require('../../assets/icons/Arrow_R.png')
}
const s = StyleSheet.create({
  centralContainer:{    
    width:width*0.8,        
    alignItems:'center',
    justifyContent:'center',    
    borderRadius:10,
    marginVertical:height*0.01,
    marginHorizontal:width*0.1,
    backgroundColor:colorPalet.white,          
  },
  hairlinedContainer:{
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colorPalet.darkGrey,
    borderRadius:10
  },
  optionLine:{        
    height:height*0.05,
    width:width*0.7,
    marginVertical:height*0.01,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderRadius:10
  },
  newOptionButtonText:{
    fontFamily:fonts.regular,
    color:colorPalet.white,
    fontSize:height*0.022    
  },
  optionContainer:{
    width:'100%',
    flexDirection:'row'  
  },
  optionNameText:{
    fontFamily:fonts.bold,
    color:colorPalet.darkGrey,
    fontSize:height*0.02
  },
  subOptionText:{
    fontFamily:'AlegreyaSans-Bold',
      fontSize:height*0.023,
      color:colorPalet.darkGrey,
      textAlign:'center',
      alignSelf:'center'
  },
  arrows:{
    height:height*0.02,
    width:height*0.02
  }
}) 