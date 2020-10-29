import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import {View,StyleSheet,Text,Dimensions,Pressable} from 'react-native';
import {ListRenderItem} from 'react-native'
import {productOptions,colorPalet,fonts} from '../../util/util'

interface ProdOptProps extends React.ComponentPropsWithoutRef<"view">{
  data:productOptions[]
}
interface OptionLineProps extends React.ComponentPropsWithoutRef<"view">{
  data: productOptions
}
const {width,height}  = Dimensions.get('window')

export default function ProductOptions(props:ProdOptProps): JSX.Element{
  
  const [instantPressed,setInstantPressed]  = React.useState(false);
  
  function pressableStyle({pressed}:{pressed:boolean}) {
    const fs = StyleSheet.create({
      pressable:{
        backgroundColor:colorPalet.green,
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
    console.log('instant');
    setInstantPressed(true);
    setTimeout(() => {
      console.log('delayed')
      setInstantPressed(false)
    }, 50);
  }
  return (
    <View style={s.centralContainer}    >
      <Pressable
        style={pressableStyle}
        onPress={pressNew}        
      >
        <Text>TESTE</Text>    
      </Pressable>       
      {props.data.map((el:productOptions,index:number)=><ListLine key={`${el.name}-${index}`} data={el}/>)}
    </View>
  )
}
/*
 <FlatList 
    data={props.data}
    renderItem={({item}:{item:any})=>ListLine(item)}
    keyExtractor={(item,index)=>`${item.name}-${index}`}
  />
*/
function ListLine(props:OptionLineProps): React.ReactElement{
  const {name,options} = props.data
  return(
    <View style={s.optionContainer}>      
      <View style={{width:'50%'}}>
        <Text style={s.optionNameText}>{name}</Text>
      </View>
      <View style={{width:'50%'}}>
        {options.map((el,index)=><Text style={s.subOptionText} key={`opt-${el}-${index}`}>{el}</Text>)}
      </View>
    </View>
  )
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
  newOptionButton:{

  },
  optionContainer:{
    width:'100%',
    flexDirection:'row'  
  },
  optionNameText:{
    fontFamily:fonts.regular,
    fontSize:height*0.02
  },
  subOptionText:{
    fontFamily:fonts.regular,
    fontSize:height*0.015
  },
}) 