import React from 'react';
import {View,Text,StyleSheet,Image} from 'react-native';
import {colorPalet, product} from '../../util/util';



export default function ProductCard(props:{height:number,width:number,data:Partial<product>}) : JSX.Element{
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
      width:props.height-5
    }
  })
  return (
    <View style={s.outterContainer}>      
      <Image source={productPng} resizeMethod='resize' resizeMode='contain' style={s.imageContainer}/>    
      <View>
        <Text>{props.data.name}</Text>
        <Text>R${props.data.value}</Text>
        <Text>
          {props.data.components? 'Components: ': undefined}
          {props.data.components?.map((el:product)=>el.name).join(',')}
        </Text>
      </View>
    </View>
  )
}