import React from 'react';
import {StyleSheet,View,FlatList,Dimensions,TouchableOpacity,Image,Text} from 'react-native';
import MaskedTextInput from './AuxComponents/MaskedTextInput'
import CleanHeader from './AuxComponents/CleanHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProdCard from './AuxComponents/ProductCard';
import { AntDesign } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

import {getProductsRequest} from '../util/requests';
import {colorPalet, product, navProp, fonts} from '../util/util';
import CentralCiclingContainer from './AuxComponents/CentralCiclingContainer';
import { Switch, TextInput } from 'react-native-gesture-handler';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const logoDimentions = Math.floor(height*0.1);

const images = {
  search : require('../assets/icons/Search.png'),
  delete : require('../assets/icons/Delete.png')
}

async function getProds(){
  try{
    const prods = await getProductsRequest();
    return prods;
  }catch(e){
    console.error(e);
    return []
  }
}
interface ProductProps extends React.ComponentPropsWithRef<"view">{
  navigation: NavigationProp<Record<string, object | undefined>, string, Readonly<navProp>, {}, {}>,
  route: any,
}
export default function Products(props:ProductProps) : JSX.Element{

  const [prods,setProds] = React.useState<product[]>([]);
  const [showAll,setShowAll]  = React.useState<boolean>(false);
  const [textFilter,setTextFilter]  = React.useState<string>('')
  const [loadingProds,setLoadingProds] = React.useState<boolean>(true);

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
  
  function editProduct(product:product){
    props.navigation.navigate('prodEdit',{product:product})
  }
  function sortProds(a:product,b:product){
    const aName = a.name.toUpperCase();
    const bName = b.name.toUpperCase();
    if(aName < bName){
      return -1;
    }else if(aName > bName){
      return 1;
    }else{
      return 0;
    }
  }
  function changeTextFilter(a:string):void{    
    setTextFilter(a);
  }  
  const FilterRow : ()=>JSX.Element = ()=>(
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      <View style={{flexDirection:'row',overflow:'scroll'}}>
        <MaskedTextInput mask='none' value={textFilter} hocUpdater={changeTextFilter} placeholder='Buscar por nome' style ={{...s.defaultText,...s.placeholder,width:width*0.53}}/>        
        <Image source={images.search} style={{height:height*0.03,width:height*0.03,tintColor:colorPalet.green,marginHorizontal:width*0.03,alignSelf:'center'}}/>
      </View>
      <View style={{alignContent:'center',alignItems:'center',paddingHorizontal:15,borderLeftWidth:1,borderLeftColor:colorPalet.darkGrey}}>
        <Text style={s.switchText}>Inativos</Text>
        <Switch 
          trackColor={{ false: colorPalet.grey, true: colorPalet.green }}
          thumbColor={showAll ? colorPalet.green : colorPalet.grey}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=>setShowAll(!showAll)}
          value={showAll}
        />
      </View>
    </View>
  )
  
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
        <CentralCiclingContainer content={<FilterRow />}/>        
        {loadingProds && prods.length>0 ? undefined : 
          <FlatList 
            data={prods.filter((el:product)=>{if(showAll){return true}else{return el.active}}).filter((e:product)=>e.name.toUpperCase().includes(textFilter.toUpperCase().trim())).sort(sortProds).map((el:product)=>{return {id:el._id,...el}})}
            renderItem={({item}:{item:product})=>(<ProdCard height={height*0.06} width={width*0.8} data={item} key={item?._id} edit={()=>editProduct(item)}/>)}            
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
  },
  placeholder:{
    fontFamily:fonts.regular
  },
  filledInput:{
    fontFamily:fonts.bold
  },
  defaultText:{
    fontSize:height*0.022,
    marginHorizontal:width*0.02,    
  },
  switchText:{
    fontSize:height*0.011,
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey
  }
});
//{prods.map((prod : product)=>(<ProdCard height={height*0.08} width={width*0.8} data={prod} key={prod._id}/>))}