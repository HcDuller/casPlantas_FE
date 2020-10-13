import React, { SetStateAction } from 'react';
import {Animated,View,TouchableHighlight,Text, Easing} from 'react-native';

export default function ProgressBar ({color,width,height,duration}:{color:string,width:number,height:number,duration:number,}) : JSX.Element{

  
  const prValue         = React.useRef(new Animated.Value(0)).current;
  const invertedPrValue = React.useRef(new Animated.Value(width)).current;
  const animatedHeight  = React.useRef(new Animated.Value(0)).current;
  
  const fadeInOut = 400;

  function animate(){
    Animated.sequence([
      Animated.timing(animatedHeight,{
        toValue:height,
        useNativeDriver:false,
        duration:fadeInOut
      }),
      Animated.parallel([
        Animated.timing(prValue,{
          toValue:width,
          useNativeDriver:false,
          duration:(duration-fadeInOut)
        }),
        Animated.timing(invertedPrValue,{
          toValue:0,
          useNativeDriver:false,
          duration:(duration-fadeInOut)
        })
      ]),
      Animated.timing(animatedHeight,{
        toValue:0,
        useNativeDriver:false,
        duration:fadeInOut
      })
    ]).start()    
  }  
  React.useEffect(()=>{
    animate();
  },[])
  
  return (
    <Animated.View style={{
      width:width,
      height:animatedHeight,
      flexDirection:'row',
      justifyContent:'flex-start',            
    }}>
      <Animated.View style={{
        width:prValue,
        height:'100%',
        opacity:1,
        backgroundColor:color
      }}/>            
      <Animated.View style={{
        width:invertedPrValue,
        height:'100%',
        opacity:0.5,
        backgroundColor:color
      }}/>      
    </Animated.View>
  )
}

