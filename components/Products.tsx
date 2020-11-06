import React from 'react';
import {StyleSheet,View,FlatList,Dimensions,TouchableOpacity,Image,Text} from 'react-native';
import CleanHeader from './AuxComponents/CleanHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProdCard from './AuxComponents/ProductCard';
import { AntDesign } from '@expo/vector-icons';

import {getProductsRequest} from '../util/requests';
import {colorPalet, product} from '../util/util';
import { floor } from 'react-native-reanimated';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const logoDimentions = Math.floor(height*0.1)

async function getProds(){
  try{
    const prods = await getProductsRequest();
    return prods;
  }catch(e){
    console.error(e);
    return []
  }
}
export default function Products(props:any) : JSX.Element{

  const [prods,setProds] = React.useState([]);
  const [loadingProds,setLoadingProds] = React.useState(true);

  React.useEffect(()=>{    
    (async()=>{
      const tempProds = await getProds();      
      setProds(tempProds);
      setLoadingProds(false);
    })();
    
  },[])
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      (async()=>{
        const tempProds = await getProds();      
        setProds(tempProds);
        setLoadingProds(false);
      })();
    });

    return unsubscribe;
  },[props.navigation]);
  
  return (
    <SafeAreaView style={s.screen}>      
      <View style={{alignItems:"center",justifyContent:"center"}}>
        <View style={{height:(logoDimentions*0.5+10),backgroundColor:colorPalet.white,width:width,flexDirection:'row',justifyContent:'flex-end'}}>
          <TouchableOpacity 
            style={{justifyContent:'center',height:(logoDimentions*0.5+10),width:(width*0.1)}} 
            onPress={()=>props.navigation.navigate('prodEdit')}>
            <AntDesign name="pluscircle" size={logoDimentions*0.4} color={colorPalet.darkGreen} />
          </TouchableOpacity>
        </View>
        <View style={{height:(logoDimentions*0.5+10),width:width}}></View>
        <Image source={require('../assets/icons/logo.png')} style={{height:logoDimentions,width:logoDimentions,position:'absolute'}}/>
      </View>
      <View style={s.centralContainer}>
        {loadingProds && prods.length>0 ? undefined : 
          <FlatList 
            data={prods.map((el:product)=>{return {id:el._id,...el}})}
            renderItem={({item}:{item:product})=>(<ProdCard height={height*0.08} width={width*0.8} data={item} key={item?._id}/>)}
            
          />
        }        
      </View>      
    </SafeAreaView>
  )
}
const s = StyleSheet.create({
  screen:{
    height:'100%',
    justifyContent:'flex-start',    
    backgroundColor:colorPalet.grey
  },
  centralContainer:{
    width:'100%',    
    alignItems:'center'
  }
});
//{prods.map((prod : product)=>(<ProdCard height={height*0.08} width={width*0.8} data={prod} key={prod._id}/>))}