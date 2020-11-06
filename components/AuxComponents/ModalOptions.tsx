import React from 'react';
import {colorPalet, fonts,productOptions} from '../../util/util'
import {View,Dimensions,StyleSheet,TextInput,Text,Image,Switch,Pressable,Animated,Easing} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



interface ModalOptionsProps extends React.ComponentPropsWithoutRef<"view">{
  visible:boolean;  
  navigation?:any;
  option?:productOptions;
  gogoAction:(newOpt:productOptions)=>void;
  goBack:()=>void
}
interface NaviLineProps extends React.ComponentPropsWithoutRef<"view">{
  onGogo:()=>void;
  newOpt:()=>void;
  goBack:()=>void;
}
interface FeatureNameInput extends React.ComponentPropsWithoutRef<"input">{
  name:string;
  nameChanger:(name:string)=>void;
}
interface OptionFeatureContainerProps extends React.ComponentPropsWithoutRef<"view">{
  nameChanger:(name:string)=>void;
  activeChanger:(newActiveState:boolean)=>void;
  onDelete:()=>void;
  data?:{name:string,active:boolean}
}
export default function ModalOptions(props:ModalOptionsProps){
  const insets = useSafeAreaInsets();//{ top: number, right: number, bottom: number, left: number }
  const newOption : productOptions = {
    active:false,
    name:'',
    options:[]
  }  
  const [focusedOpt,setFocusedOpt] = React.useState<productOptions>(props.option ? props.option : newOption);
  
  function changeName(newName:string):void{
    const tempOptions   = {...focusedOpt};
    tempOptions.name    = newName;
    setFocusedOpt(tempOptions);
  }
  function optionNameChanger(name:string,index:number):void{    
    const tempOpt = {...focusedOpt};
    if(tempOpt.options){
      tempOpt.options[index].name = name;
    }    
    setFocusedOpt(tempOpt);
  }
  function subOptionActiveChanger(activeState:boolean,index:number){
    const tempOpt = {...focusedOpt};
    if(tempOpt.options){
      tempOpt.options[index].active = activeState;
    }
    setFocusedOpt(tempOpt);
  }
  function addNewOption(){
    const tempOptions = {...focusedOpt};
    tempOptions.options.push({
      active:true,
      name:''
    })
    setFocusedOpt(tempOptions)
  }
  function removeSubOption(index:number){
    const temp = {...focusedOpt};
    if(temp.options){      
      temp.options.splice(index,1);      
      setFocusedOpt(temp);
    }
  }
  function onGogo(){
    if(focusedOpt?.name && focusedOpt?.options.length > 0){
      setFocusedOpt(newOption);    
      props.gogoAction(focusedOpt);    
    }else{
      alert('Empty option cannot be created');
    }    
  }
  function onOhNo(){
    if(props.option){

    }else{
      
    }
  }
  if(!props.visible){
    return <></>
  }
  
  return (    
    <View style={[s.screen,{paddingTop:(insets.top+height*0.15+10)}]}>
      <View style={[s.centralContainer]}>
        <FeatureNameInput nameChanger={changeName} name={focusedOpt.name}/>
        {focusedOpt.options.map((el,index)=><OptionFeatureContainer 
                                                key={`father-${el.name}-${index}`}                                                
                                                data={el}
                                                activeChanger={(newState:boolean)=>subOptionActiveChanger(newState,index)} 
                                                nameChanger={(name:string)=>optionNameChanger(name,index)}
                                                onDelete={()=>removeSubOption(index)}
                                                />)}
        <NavLine goBack={props.goBack} newOpt={addNewOption} onGogo={onGogo}/>
      </View>
    </View>
  )
}

function FeatureNameInput(props:FeatureNameInput){  
  const [name,setName]  = React.useState(props.name ? props.name : '')
  function nameChanger(newName:string):void{
    props.nameChanger(newName);
    setName(newName);
  }
  const tiltBase  = React.useRef<Animated.Value>(new Animated.Value(0)).current;
  const colorBase = React.useRef<Animated.Value>(new Animated.Value(0)).current;

  const msToDelete    = 2000;
  const tiltDuration  = 40;

  const tiltLeft    = Animated.timing(tiltBase,{toValue:-1,duration:tiltDuration/2,useNativeDriver:false});
  const tiltRight   = Animated.timing(tiltBase,{toValue:1,duration:tiltDuration/2,useNativeDriver:false});
  const straighten  = Animated.timing(tiltBase,{toValue:0,duration:tiltDuration/4,useNativeDriver:false});
  const shake       = Animated.loop(Animated.sequence([tiltRight,tiltLeft,tiltRight,straighten]),{iterations:-1});  

  const holding     = Animated.timing(colorBase,{toValue:1,duration:msToDelete,easing:Easing.ease,useNativeDriver:false})

  const degTilt     = tiltBase.interpolate({inputRange:[-1,1],outputRange:['-2deg','2deg']});
  const finalColor  = colorBase.interpolate({inputRange:[0,1],outputRange:[colorPalet.white,colorPalet.red]});

  return  (
    <Animated.View style={[s.hairlinedContainer,{paddingLeft:20,justifyContent:'center',transform:[{rotate:degTilt}],backgroundColor:finalColor}]}>
      <Pressable
        delayLongPress={msToDelete}
        onPressIn={()=>Animated.parallel([shake,holding]).start()}
        onPressOut={()=>{shake.reset();holding.reset();straighten.start();}}
        onLongPress={()=>alert('deleta')}        
      >
        <TextInput 
          placeholder='Nome da Característica'
          value={name}
          style={[s.featureNameInput,{width:'70%'}]}   
          onChange={({ nativeEvent: { text} })=>nameChanger(text)}  
        />
      </Pressable>
    </Animated.View>
  )
}
function OptionFeatureContainer(props:OptionFeatureContainerProps){
  const [enabled,setEnabled]  = React.useState(props.data ? props.data.active : true);
  const [name,setName]        = React.useState(props.data ? props.data.name   : '' );

  const tiltBase  = React.useRef<Animated.Value>(new Animated.Value(0)).current;
  const colorBase = React.useRef<Animated.Value>(new Animated.Value(0)).current;

  const msToDelete    = 2000;
  const tiltDuration  = 40;

  const tiltLeft    = Animated.timing(tiltBase,{toValue:-1,duration:tiltDuration/2,useNativeDriver:false});
  const tiltRight   = Animated.timing(tiltBase,{toValue:1,duration:tiltDuration/2,useNativeDriver:false});
  const straighten  = Animated.timing(tiltBase,{toValue:0,duration:tiltDuration/4,useNativeDriver:false});
  const shake       = Animated.loop(Animated.sequence([tiltRight,tiltLeft,tiltRight,straighten]),{iterations:-1});  

  const holding     = Animated.timing(colorBase,{toValue:1,duration:msToDelete,easing:Easing.ease,useNativeDriver:false})

  const degTilt     = tiltBase.interpolate({inputRange:[-1,1],outputRange:['-2deg','2deg']});
  const finalColor  = colorBase.interpolate({inputRange:[0,1],outputRange:[colorPalet.white,colorPalet.red]});
  
  const timer = React.useRef<number>(0);
  function nameChanger(name:string):void{
    clearTimeout(timer.current);
    setName(name);
    timer.current = setTimeout(() => {
        props.nameChanger(name);
    }, 500);            
  }
  function enabledChanger(){
    const temp = !enabled;
    setEnabled(temp);
    props.activeChanger(temp);
  }
  
  return  (
    <Animated.View style={[s.hairlinedContainer,s.featureOptionNameContainer,{backgroundColor:finalColor,transform:[{rotate:degTilt}]}]}>
      <Pressable
        style={{
          height:'100%',
          width:'100%',
          flexDirection:'row',
          justifyContent:'flex-start',
          alignItems:'center'}}
          delayLongPress={msToDelete}
          onPressIn={()=>{Animated.parallel([shake,holding]).start()}}
          onPressOut={()=>{shake.reset();holding.reset();straighten.start();}}
          onLongPress={props.onDelete}
        >
        <Switch 
          thumbColor={colorPalet.white}
          trackColor={{true:colorPalet.darkGreen,false:colorPalet.grey}}
          onValueChange={enabledChanger}
          value={enabled}
          style={{marginRight:10}}
        />
        <TextInput 
          placeholder='Variante'
          value={name}          
          onChange={({ nativeEvent: {text} })=>nameChanger(text)}  
          style={{minWidth:'50%'}}
        />
        
      </Pressable>
    </Animated.View>
  )
}
function NavLine(props:NaviLineProps){
  return  (
    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:height*0.01}}>
      <Pressable 
        style={{flexDirection:'row'}}
        onPress={props.goBack}
      >
        <Image source={images.leftArrow}  style={{height:iconSize,width:iconSize}}/>
        <Text style={s.navigationText}>OH NO</Text>
      </Pressable>
      <Pressable onPress={props.newOpt}>
        <View style={{flexDirection:'row'}}>
          <Image source={images.plus}       style={{height:iconSize,width:iconSize}}/>
        </View>
      </Pressable>
      <Pressable 
        style={{flexDirection:'row'}}
        onPress={props.onGogo}
      >
        <Text style={[s.navigationText,{color:colorPalet.darkGreen}]}>GO GO</Text>
        <Image source={images.rightArrow} style={{height:iconSize,width:iconSize,tintColor:colorPalet.darkGreen}}/>
      </Pressable>      
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
    fontSize:height*0.022,
    minWidth:'50%'
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