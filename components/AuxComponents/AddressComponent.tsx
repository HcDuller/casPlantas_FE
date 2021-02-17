import React from 'react';
import {TextInput,View,Dimensions,StyleSheet,Animated,Image,Pressable,Easing,ScrollView,Text} from 'react-native';
import {ViewStyle,StyleProp} from 'react-native'
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
type MergeElementProps<
  T extends React.ElementType,
  P extends object = {}
> = Omit<React.ComponentPropsWithoutRef<T>, keyof P> & P;

type SearchComponentProps = MergeElementProps<'view',{style:StyleProp<ViewStyle>}> & {action:(txt:string)=>void}
const {height,width} = Dimensions.get('window');
export default function AddressComponent(props:ProxyAddressInputProps){
  return (
    <View style={{width:'80%',flexDirection:'column'}}>      
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
  const imageDimension  = decimalSize.interpolate({inputRange:[0,1],outputRange:[5,25]});
  const breath          = Animated.loop(Animated.sequence([decreaseSize,increaseSize]),{iterations:-1});
 
  function submitSearch(txt:string):void{
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(true);      
      geocoding(txt)
        .then((e=>{           
          setTimeout(()=>{                        
            if((e as []).every(isGeocoderResult)){
              setResults(e as GeocoderResult[])
            }else{
              alert('Nenhum endereço foi encontrado.')
              setResults([]);
            }
            setLoading(false)
          },2000)
        }))
        .catch(e=>{          
          setTimeout(()=>{
            console.log(e);
            setResults([]);setLoading(false)
          },2000)
        })
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
  },[loading]);
  return(
    <View style={{flexDirection:'column',marginVertical:2}}>
      <RowComponent>
        <SearchComponent style={[{flex:1,maxWidth:width*0.8*0.8,borderTopRightRadius:0,borderBottomRightRadius:0},s.innerRowComponent]} action={submitSearch}/>        
        <View style={[s.innerRowComponent,{borderTopLeftRadius:0,borderBottomLeftRadius:0,justifyContent:'center',alignItems:'center',width:width*0.8*0.2}]}>
          <AnimatedImage source={images.loading} style={[{tintColor:colorPalet.darkGreen,backgroundColor:colorPalet.white,width:imageDimension,height:imageDimension}]}/>
        </View>        
      </RowComponent>            
      {(!loading && results.length>0)? <ScrollView style={{paddingVertical:5,borderRadius:10}} children={results.map(((e:any,index)=>{if(isGeocoderResult(e)){return (<AddressRow data={e} key={`addressRow${index}`} hocUpdater={addressRowClick}/>)}}))}/> : undefined}                      
    </View>
  ) 
}
function RowComponent(props:React.ComponentPropsWithoutRef<'view'>){
  return (
    <View style={s.rowComponent}>
      {props.children}
    </View>
  )
}
function SearchComponent(props:SearchComponentProps){    
  return (
    <TextInput style={props.style} onSubmitEditing={({nativeEvent: {text}})=>{props.action(text)}}/>
  )
}
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
      style={{height:height*0.1,justifyContent:'center',alignItems:'center',flex:1,borderWidth:StyleSheet.hairlineWidth,borderColor:colorPalet.darkGreen,borderRadius:10,backgroundColor:colorPalet.white}}      
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
      <RowComponent>        
        <Text 
          numberOfLines={1} 
          ellipsizeMode='tail'           
          style={[s.addressText,s.innerRowComponent,{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopRightRadius:0,flexGrow:8,maxWidth:width*0.8*0.8,height:'100%'}]}
          >
            {props.address.street}
        </Text>                
        <TextInput 
            value={number}
            keyboardType='number-pad'
            onChange={({ nativeEvent: {text} })=>setNumber(text.replace(/\D/g,''))}
            onSubmitEditing={updateHOC}
            onBlur={updateHOC}
            placeholder='Nº'   
            numberOfLines={1}            
            style={[s.addressText,s.innerRowComponent,{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopLeftRadius:0,flexGrow:2,maxWidth:width*0.8*0.2}]}
          />
      </RowComponent>
      <RowComponent>
        <TextInput           
          value={detail}
          placeholder='Detalhe'
          onChange={({ nativeEvent: {text} })=>setDetail(text)}
          style={[s.innerRowComponent,s.addressText,{flexGrow:1,borderRadius:0}]}
        />
      </RowComponent>      
      <RowComponent>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[s.addressText,s.innerRowComponent,{borderRadius:0,flexGrow:6,width:width*0.8*0.6}]}>{props.address.district}</Text>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[s.addressText,s.innerRowComponent,{borderRadius:0,flexGrow:4,width:width*0.8*0.4}]}>{props.address.town}</Text>        
      </RowComponent>   
      <RowComponent>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[s.addressText,s.innerRowComponent,{flexGrow:1,borderTopLeftRadius:0,borderTopRightRadius:0}]}>{props.address.state}</Text>
      </RowComponent>         
    </View>
  )
  /*
   <View style={s.addressLineContainer}>
        <View style={[s.borderedContainer,{flexGrow:8,maxWidth:width*0.8*0.8}]}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={s.addressText}>{props.address.street}</Text>
        </View>
        <View style={[s.borderedContainer,{flexGrow:2,maxWidth:width*0.8*0.2,alignItems:'center'}]}>
          <TextInput 
            value={number}
            keyboardType='number-pad'
            onChange={({ nativeEvent: {text} })=>setNumber(text)}            
            style={[s.addressText,{justifyContent:'center',alignItems:'center',alignContent:'center'}]}
          />
        </View>
      </View>
   */
}
const s = StyleSheet.create({
  container:{
    width:'80%',    
  },
  addressRow:{
    paddingHorizontal:15,
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    fontSize:height*0.02
  },
  addressLineContainer:{    
    flexDirection:'row',
    width:'100%'    
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
    textAlignVertical:'center'
  },  
  rowComponent:{
    width:'100%',
    height:height*0.055,
    borderRadius:10,    
    flexDirection:'row'    
  },
  innerRowComponent:{
    borderColor:colorPalet.green,
    borderWidth:StyleSheet.hairlineWidth,
    paddingHorizontal:15,
    borderRadius:10,
    backgroundColor:colorPalet.white,
    overflow:'hidden',
    justifyContent:'center',    
  }
})

