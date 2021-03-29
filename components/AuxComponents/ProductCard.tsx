import React from 'react';
import {View,Text,StyleSheet,Image,Pressable,Dimensions} from 'react-native';
import {colorPalet, fonts, product} from '../../util/util';

interface ProductCardProps extends React.ComponentPropsWithRef<"view">{
  height:number,
  width:number,
  data:Partial<product>,
  edit:()=>void,
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function ProductCard(props:ProductCardProps) : JSX.Element{
  const productPng = require('../../assets/icons/Product.png');
  const s = StyleSheet.create({
    outterContainer:{            
      minHeight:props.height,
      width:props.width,
      borderRadius:10,       
      backgroundColor:colorPalet.white,
      marginVertical:5,
      flexDirection:'row',
      alignItems:'center',
      overflow:'hidden'           
    },
    imageContainer:{      
      height:props.height-5,
      width:props.height-5,      
    },
    defaultText:{
      fontFamily:fonts.bold      
    }
  })
  return (
    <Pressable 
      onPress={props.edit}
      style={s.outterContainer}>      
      <Image source={productPng} resizeMethod='resize' resizeMode='contain' style={[s.imageContainer,props.data.active ? {tintColor:colorPalet.darkGrey} : {tintColor:colorPalet.reactDefPlaceholder}]}/>    
      <View>
        <Text style={[s.defaultText,props.data.active ? {color:colorPalet.darkGrey} : {color:colorPalet.reactDefPlaceholder},{fontSize:height*0.018}]}>{props.data.name}</Text>
        <Text style={[s.defaultText,props.data.active ? {color:colorPalet.darkGrey} : {color:colorPalet.reactDefPlaceholder},{fontSize:height*0.012}]}>R${props.data.value}</Text>
        <Text style={[s.defaultText,props.data.active ? {color:colorPalet.darkGrey} : {color:colorPalet.reactDefPlaceholder},{fontSize:height*0.012}]}>
          {props.data.components? 'Components: ': undefined}
          {props.data.components?.map((el:any)=>el.name).join(',')}
        </Text>
      </View>
    </Pressable>
  )
}