import React from 'react';
import {TextInput,View,Dimensions,StyleSheet,Animated,Image,Pressable,Easing,ScrollView,Text} from 'react-native';
import {fonts,colorPalet,address} from '../../util/util'
import {geocoding} from '../../util/requests'
import {GeocoderResult,isGeocoderResult} from '../../util/mapTypes';

const images  = {
  loading:  require('../../assets/icons/Search.png')
}

interface MapSearchInputProps extends React.ComponentPropsWithoutRef<"view">{
  hocUpdater:(address:Partial<address>)=>void
}
interface AddressRowProps extends React.ComponentPropsWithoutRef<"view">{
  data:GeocoderResult,
  hocUpdater:(address:Partial<address>)=>void
}
interface ProxyAddressInputProps  extends React.ComponentPropsWithoutRef<"view">{
  address:address,
  hocUpdater:(newAddress:Partial<address>)=>void
}
const {height,width} = Dimensions.get('window');
export default function AddressComponent(props:ProxyAddressInputProps){
  return (
    <View style={{width:'80%'}}>
      <MapSearchInput hocUpdater={props.hocUpdater}/>
      <ProxyAddressInput address={props.address} hocUpdater={props.hocUpdater} />
    </View>
  )
}
function MapSearchInput(props:MapSearchInputProps){
  type localState = {
    loading:boolean,
    results:string[]
  }
  const [loading,setLoading]  = React.useState<boolean>(false);
  const [results,setResults]  = React.useState<GeocoderResult[]>([]);   

  const AnimatedImage = Animated.createAnimatedComponent(Image);
  
  const decimalSize   = React.useRef<Animated.Value>(new Animated.Value(1)).current;
  const timer         = React.useRef<number>(0);
  
  const anDuration      = 1000;
  const increaseSize    = Animated.timing(decimalSize,{toValue:1,duration:anDuration,easing:Easing.linear,useNativeDriver:false});
  const decreaseSize    = Animated.timing(decimalSize,{toValue:0,duration:anDuration,easing:Easing.linear,useNativeDriver:false});
  const percentileSize  = decimalSize.interpolate({inputRange:[0,1],outputRange:['20%','50%']});
  const breath          = Animated.loop(Animated.sequence([decreaseSize,increaseSize]),{iterations:-1});
 
  function submitSearch(txt:string):void{
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(true);      
      geocoding(txt)
        .then((e=>{ setTimeout(()=>{
          if((e as []).every(isGeocoderResult)){
            setResults(e as GeocoderResult[])
          }
          setLoading(false)},2000)
        }))
        .catch(e=>{setTimeout(()=>{setResults([]);setLoading(false)},2000)})
    }, 300);
  }
  function addressRowClick(address:Partial<address>){
    setResults([]);
    props.hocUpdater(address);
    
  }
  React.useEffect(()=>{
    if(loading){
      breath.start();
    }else{      
      //breath.stop();
      increaseSize.start();
    }
  },[loading])  
  return(
    <View style={{borderRadius:10}}>
      <View style={{backgroundColor:colorPalet.white,flexDirection:'row',borderRadius:10}}>
        <TextInput 
          style={[{flex:8,fontFamily:fonts.regular,color:colorPalet.darkGrey,borderWidth:StyleSheet.hairlineWidth,borderColor:colorPalet.darkGreen,borderRadius:10,paddingHorizontal:4}]} 
          editable={!loading}        
          onSubmitEditing={({nativeEvent: {text}})=>{submitSearch(text)}}          
        />      
        <View style={{flex:2,height:30,justifyContent:'center',alignItems:'center'}} children={<AnimatedImage source={images.loading} style={{tintColor:colorPalet.darkGreen,resizeMode:'contain',width:percentileSize,backgroundColor:'transparent'}}/>}/>              
      </View>
      {(!loading && results.length>0)? <ScrollView style={{maxHeight:height*0.4,paddingVertical:5,backgroundColor:colorPalet.white,borderRadius:10}} children={results.map(((e:any,index)=>{if(isGeocoderResult(e)){return (<AddressRow data={e} key={`addressRow${index}`} hocUpdater={addressRowClick}/>)}}))}/> : undefined}
    </View>
  )
}
//{loading ? (<View style={{flex:2,height:30,justifyContent:'center',alignItems:'center'}} children={<AnimatedImage source={images.loading} style={{tintColor:colorPalet.darkGreen,resizeMode:'contain',width:percentileSize,backgroundColor:'transparent'}}/>}/>) : undefined}                    
function AddressRow(props:AddressRowProps):JSX.Element{
  function update(){
    const {address_components : components}  = props.data;
    const newAddress :address = {
      street:    '',
      number:    0,
      detail:    '',
      district:  '',
      town:      '',
      state:     '',
      geometry:  {
        lat:0,
        lng:0
      }      
    }
    components.forEach(el=>{
      if(el.types.find(type=>type==='route')){
        newAddress.street = el.long_name;
      };
      if(el.types.find(type=>type==='sublocality_level_1')){
        newAddress.district = el.long_name;
      };
      if(el.types.find(type=>type==='administrative_area_level_2')){
        newAddress.town = el.long_name;
      };
      if(el.types.find(type=>type==='administrative_area_level_1')){
        newAddress.state = el.long_name;
      };
    });
    props.hocUpdater(newAddress);
  }
  return (
    <Pressable 
      onPress={update}
      style={{justifyContent:'center',alignItems:'center',flex:1,borderWidth:StyleSheet.hairlineWidth,borderColor:colorPalet.darkGreen,borderRadius:10}}      
      >
      <Text style={s.addressRow}>{props.data.formatted_address}</Text>
    </Pressable>
  )
}
function ProxyAddressInput(props:ProxyAddressInputProps){    
  const [number,setNumber]      = React.useState<string>(props.address?.number ? props.address.number.toString() : '0');
  const [detail,setDetail]      = React.useState<string>(props.address?.detail ? props.address.detail : '');
  function updateHOC(){
    const temp = {...props.address}
    temp.detail = detail;
    temp.number = parseInt(number);
    props.hocUpdater(temp);
  }
  return (
    <View>
      <View style={s.addressLineContainer}>
        <View style={[s.borderedContainer,{flexGrow:8}]}>
          <Text style={s.addressText}>{props.address.street}</Text>
        </View>
        <View style={[s.borderedContainer,{flexGrow:2,alignItems:'center'}]}>
          <TextInput 
            value={number}
            keyboardType='number-pad'
            onChange={({ nativeEvent: {text} })=>setNumber(text)}            
            style={[s.addressText,{justifyContent:'center',alignItems:'center',alignContent:'center'}]}
          />
        </View>
      </View>
      <View style={s.addressLineContainer}>        
        <TextInput           
          value={detail}
          onChange={({ nativeEvent: {text} })=>setDetail(text)}
          style={[s.borderedContainer,{flexGrow:1},s.addressText]}
        />
      </View>
      <View style={s.addressLineContainer}>
        <View style={[s.borderedContainer,{flexGrow:1}]}>
          <Text style={[s.addressText]}>{props.address.district}</Text>
        </View>
        <View style={[s.borderedContainer,{flexGrow:1}]}>
          <Text style={[s.addressText]}>{props.address.town}</Text>        
        </View>
      </View>
      <View style={s.addressLineContainer}>
        <View style={[s.borderedContainer,{flexGrow:1}]}>
          <Text style={[s.addressText]}>{props.address.state}</Text>        
        </View>
      </View>      
    </View>
  )
}
const s = StyleSheet.create({
  container:{
    width:'80%',    
  },
  addressRow:{
    paddingHorizontal:4,
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    fontSize:height*0.02
  },
  addressLineContainer:{
    flexDirection:'row',
    flexGrow:1,    
  },
  borderedContainer:{
    backgroundColor:colorPalet.white,
    borderWidth:StyleSheet.hairlineWidth,
    borderRadius:10,
    borderColor:colorPalet.darkGreen,
    minHeight:height*0.055,
    justifyContent:'center'
  },
  addressText:{
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    fontSize:height*0.022,
    paddingLeft:4
  },  
  
})

