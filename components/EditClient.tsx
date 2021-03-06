import React from 'react';
import {Animated,View,Dimensions,Text,StyleSheet,TextInput,ScrollView,Platform,Pressable,KeyboardAvoidingView, Image,TouchableOpacity,Easing} from 'react-native';
import {TextInputChangeEventData,TextInputSubmitEditingEventData} from 'react-native';
import CentralCiclingContainer from './AuxComponents/CentralCiclingContainer';
import {client,colorPalet,fonts,address,ComponentWithNavigationProps, rgbColorPallet}  from '../util/util';
import AddressComponent from './AuxComponents/AddressComponent';
import MaskedTextInput from './AuxComponents/MaskedTextInput';
import {postClient,patchClient} from '../util/requests';
import {  SafeAreaView,useSafeAreaInsets }    from 'react-native-safe-area-context';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import NavigationRow from './AuxComponents/NavigationRow'
import ProgressBar from './AuxComponents/ProgressBar'


interface EditClientProps extends ComponentWithNavigationProps{
  client?:client  
}
interface ProxyTextInputProps extends React.ComponentPropsWithoutRef<"view">{
  placeholder:string,
  value:string,
  valueChanger:(txt:string)=>void
}
interface ProxyPhoneInputProps extends ProxyTextInputProps{}
interface AnniversaryComponentProps extends React.ComponentPropsWithoutRef<"view">{
  value:Date,
  hocUpdater:(newDate:Date)=>void
}

const {height,width}  = Dimensions.get('window');
const images  = {
  cake: require('../assets/icons/Bolo.png'),
  plus: require('../assets/icons/Plus.png'),
  delete: require('../assets/icons/Delete.png')
}
export default function EditClient(props:EditClientProps) :  JSX.Element {  
  const newClient : client  = {
    __v:'',
    _id:'',
    doc:'',
    address:{      
      detail:'',
      district:'district(bairro)',
      state:'State(estado)',
      number:0,
      street:'Street(rua)',
      town:'Town(cidade/municipio)',
      geometry:{
        lat:0,
        lng:0
      } 
    },
    name:'',
    anniversary:new Date(0),
    instagram:'',
    since:new Date(),
    phones:[]
  }
  const params : {client:client} = (props.route.params as {client:client})
  const [client,setClient]  = React.useState<client>(params?.client ? params?.client : newClient);  
  const [bDayPicker,setBDayPicker]  = React.useState<boolean>(false);  
  const title = params?.client ? 'Edição de Cliente' : 'Novo Cliente';
  const [tempDate,setTempDate]  = React.useState<Date>(new Date())
  const [loading,setLoading]  = React.useState<boolean>(false);

  function setName(txt:string){
    const temp  = {...client};
    temp.name = txt;
    setClient(temp);
  }
  function setInstagram(txt:string){
    const temp  = {...client};
    temp.instagram = txt;
    setClient(temp);
  }
  function setPhone(txt:string,index:number){
    const temp  = {...client};
    temp.phones[index] = txt;    
    setClient(temp);
  }
  function addPhone(){
    const temp = {...client};
    temp.phones.push('');
    setClient(temp);
  }
  function removePhone(index:number){
    const temp = {...client};
    temp.phones.splice(index,1);
    setClient(temp);
  }
  function setAddress(newAddress:Partial<address>):void{
    const temp = {...client};    
    newAddress?.street    ? temp.address.street   = newAddress.street   : undefined;
    newAddress?.number    ? temp.address.number   = newAddress.number   : undefined;
    newAddress?.detail    ? temp.address.detail   = newAddress.detail   : undefined;
    newAddress?.district  ? temp.address.district = newAddress.district : undefined;
    newAddress?.town      ? temp.address.town     = newAddress.town     : undefined;
    newAddress?.state     ? temp.address.state    = newAddress.state    : undefined;
    newAddress?.place_id  ? temp.address.place_id = newAddress.place_id : undefined;
    newAddress?.geometry  ? temp.address.geometry = newAddress.geometry : undefined;
    setClient(temp);    
  }  
  const bDayChange = (event:Event, selectedDate:Date|undefined):void => {
    const currentDate = selectedDate || tempDate;
    const temp  = {...client};
    temp.anniversary = currentDate.toISOString();
    setBDayPicker(Platform.OS === 'ios');
    setClient(temp);
  };
  async function saveClient(){
    try{
      const temp : Partial<client> = {...client}      
      setLoading(true);
      if( params?.client){
        await patchClient(temp);
      }else{
        delete temp._id;
        delete temp.__v;
        await postClient(temp);
      }      
      const fakeDelay:Promise<void> = new Promise((resolve,reject)=>{
        setTimeout(() => {resolve()}, 1200);
      })
      await fakeDelay;      
      setLoading(false);      
      props.navigation.goBack();
    }catch(e){
      setLoading(false);
      console.error(e.message);
    }
  }

  const AddPhone =function(props:React.ComponentPropsWithoutRef<'view'>):React.ReactElement {
    return (
      <View>
        <TouchableOpacity  onPress={addPhone} style={{alignSelf:'center'}}>
          <Image source={images.plus} style={{height:height*0.02,width:height*0.02,margin:height*0.015}} />
        </TouchableOpacity >
      </View>
    )
  }  
  const Phones = function(props:React.ComponentPropsWithoutRef<'view'>) : React.ReactElement{    
    return (
      <View style={{width:'100%'}}>      
        {client.phones.map((el:string,index:number,arr:string[])=><PhoneRow key={`PhoneNumber-${index}`} index={index} />)}
        <AddPhone />
      </View>
    )
  }
  const PhoneRow = function(props:(React.ComponentPropsWithoutRef<'view'> & {index:number})) : React.ReactElement{

    const tiltBase  = React.useRef<Animated.Value>(new Animated.Value(0)).current;
    const colorBase = React.useRef<Animated.Value>(new Animated.Value(0)).current;

    const msToEdit      = 1000;
    const tiltDuration  = 80;

    const tiltLeft    = Animated.timing(tiltBase,{toValue:-1,duration:tiltDuration/2,useNativeDriver:false});
    const tiltRight   = Animated.timing(tiltBase,{toValue:1,duration:tiltDuration/2,useNativeDriver:false});
    const straighten  = Animated.timing(tiltBase,{toValue:0,duration:tiltDuration/4,useNativeDriver:false});
    const shake       = Animated.loop(Animated.sequence([tiltRight,tiltLeft,tiltRight,straighten]),{iterations:-1});  

    const toRed       = Animated.timing(colorBase,{toValue:1,duration:msToEdit,easing:Easing.ease,useNativeDriver:false})
    const toWhite     = Animated.timing(colorBase,{toValue:0,duration:msToEdit,easing:Easing.ease,useNativeDriver:false})

    const holding     = Animated.parallel([toRed,shake])
    const release     = Animated.parallel([straighten,toWhite])

    const degTilt     = tiltBase.interpolate({inputRange:[-1,1],outputRange:['-2deg','2deg']});
    const finalColor  = colorBase.interpolate({inputRange:[0,1],outputRange:[colorPalet.white,colorPalet.red]});

    return (
      <Pressable 
        onPressIn={()=>Animated.parallel([holding]).start()} 
        onPressOut={()=>{release.start()}} 
        onLongPress={()=>{removePhone(props.index)}}
        style={{width:'100%'}} 
        delayLongPress={1000}
        >  
        <Animated.View style={{flexDirection:'row',justifyContent:'center',backgroundColor:finalColor,width:'100%',borderRadius:10,transform:[{rotate:degTilt}]}} >
          <MaskedTextInput  value={client.phones[props.index]} hocUpdater={(txt:string)=>setPhone(txt,props.index)} mask='phone' style={client.phones[props.index] ? s.phoneStyle : s.phoneStylePlaceholder} placeholder='(xx) 99999-9999'/>
        </Animated.View>
      </Pressable>  
    )

  }
 
  return (    
    <SafeAreaView style={s.screen}>      
    <View style={{width:'80%',height:height*0.1,alignItems:'center',marginVertical:height*0.02}}>        
      <Text style={s.title}>{title}</Text>
    </View>               
    <NavigationRow goGoPress={saveClient} ohNoPress={()=>{props.navigation.goBack()}} loading={false} />    
    {loading ? <ProgressBar color={colorPalet.green} width={width} height={5} duration={1000}/> : undefined}
      {bDayPicker ? (
        <DateTimePicker
          testID="datePicker"          
          value={new Date(client.anniversary)}
          mode='date'          
          display="default"
          onChange={bDayChange}
        />
      ) : undefined}            
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{flex:1}}
      >
        <ScrollView contentContainerStyle={s.screen}>              
          <CentralCiclingContainer contentDisposition='center' content={<ProxyTextInput value={client.name} placeholder='Nome' valueChanger={setName}/>}/>        
          <AnniversaryComponent value={new Date(client.anniversary)} hocUpdater={(newDate:Date)=>{const temp = {...client};temp.anniversary = newDate;setClient(temp)}}/>
          <CentralCiclingContainer contentDisposition='center' content={<ProxyTextInput value={client.instagram} placeholder='@Insta' valueChanger={setInstagram}/>}/>        
          <CentralCiclingContainer 
            contentDisposition='center' 
            content={<Phones />}/>                            
          <AddressComponent address={client.address} hocUpdater={setAddress}/>
          
        </ScrollView>        
      </KeyboardAvoidingView>
    </SafeAreaView>          
  )
}
// <ProxyPhoneInput key={`PhoneNumber-${index}`} value={client.phones[index]} placeholder='(xx)00000-0000' valueChanger={(txt:string)=>{setPhone(txt,index)}}/>

function  ProxyTextInput(props:ProxyTextInputProps):JSX.Element{
  const [innerValue,setInnerValue]  = React.useState<string>(props.value?props.value:'');

  function localChanger({ nativeEvent: { eventCount, target, text} }:{nativeEvent:TextInputChangeEventData}){    
    setInnerValue(text);
  }
  function hocUpdater({ nativeEvent: {text} }:{nativeEvent:TextInputSubmitEditingEventData}){
    props.valueChanger(text);
  }
  return (
    <TextInput 
      style={innerValue ? s.TextInputStyle : s.TextInputPlaceholder}
      value={innerValue}
      onChange={localChanger}      
      placeholder={props.placeholder}
      autoCapitalize='words'      
      onSubmitEditing={hocUpdater}  
      onBlur={()=>{props.valueChanger(innerValue)}}
    />
  )
}

function  AnniversaryComponent(props:AnniversaryComponentProps){
  const breathBase = React.useRef<Animated.Value>(new Animated.Value(0)).current;
  const [openPicker,setOpenPicker]  = React.useState(false);
  
  const d = props.value;
  const textLine  = d.valueOf() === 0 ? 'Qual o aniversário?' : `B.Day    ${d.getDate().toString().padStart(2,'0')} / ${(d.getMonth()+1).toString().padStart(2,'0')}`;
  
  const shine   = Animated.timing(breathBase,{toValue: 1,useNativeDriver: false,duration: 1000});
  const darken  = Animated.timing(breathBase,{toValue: 0,useNativeDriver: false,duration: 1000});
  const twinkle = Animated.loop(Animated.sequence([shine,darken]))

  const cakeColor   = breathBase.interpolate({
    inputRange:[0,1],
    outputRange:[colorPalet.white,colorPalet.green]
  })
  const bDayChange = (event:Event, selectedDate:Date|undefined):void => {         
    const currentDate = selectedDate || props.value;            
    setOpenPicker(Platform.OS === 'ios');    
    props.hocUpdater(currentDate);    
  };  
  React.useEffect(()=>{
    const dateNow = new Date();
    const tempDate = new Date(props.value)    
    if(
      (new Date(`${tempDate.getMonth()+1}/${tempDate.getDate()}/2000`)).valueOf()
      ===
      (new Date(`${dateNow.getMonth()+1}/${dateNow.getDate()}/2000`)).valueOf()
    ){
      twinkle.start()
    }        
  },[props.value])
  return (
    <KeyboardAvoidingView style={s.AnniversaryStyle}>
      {openPicker ? (
        <DateTimePicker
          testID="datePicker"
          value={props.value}
          mode='date'          
          display="default"
          onChange={bDayChange}      
          locale='pt-BR'    
          minimumDate={new Date(`01/01/${(new Date()).getFullYear()}`)}
          maximumDate={new Date(`12/31/${(new Date()).getFullYear()+4}`)}
        />
      ) : undefined}  
      <Pressable 
        onPress={()=>{setOpenPicker(true)}}
        style={{backgroundColor:colorPalet.white,borderRadius:10,width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center',marginVertical:height*0.01,marginHorizontal:width*0.1}}
      >                
        <Text 
          style={[{overflow:'visible',flexWrap:undefined},s.TextInputStyle]}
          numberOfLines={1}                      
          >{textLine}
        </Text>                  
        <Animated.Image source={images.cake} style={{height:height*0.04,width:height*0.04,position:'absolute',top:-height*0.005,right:0,tintColor:cakeColor,zIndex:100}}/>
      </Pressable>
      
    </KeyboardAvoidingView>
  )
}
const s = StyleSheet.create({
  screen:{    
    flexGrow:1,
    justifyContent:'flex-start',    
    alignItems:'center',
    backgroundColor:colorPalet.grey,    
  },  
  title:{    
    fontFamily:fonts.bold,
    color:colorPalet.darkGrey,
    fontSize:Number.parseFloat((height*0.05).toFixed(2))
  },  
  TextInputStyle:{
    width:'100%',    
    fontFamily:fonts.bold,
    fontSize:Number.parseFloat((height*0.023).toFixed(2)),
    color:colorPalet.darkGrey,
    textAlign:'center',
    alignSelf:'center'
  },  
  TextInputPlaceholder:{
    width:'100%',    
    fontFamily:fonts.regular,
    fontSize:Number.parseFloat((height*0.023).toFixed(2)),
    color:colorPalet.darkGrey,
    textAlign:'center',
    alignSelf:'center'
  },  
  AnniversaryStyle:{
    width:width*0.8,
    justifyContent:'center',
    flexDirection:'row',
    borderRadius:10,
    minHeight:height*0.05+8,
    backgroundColor:colorPalet.white,
    marginVertical:height*0.01,
    marginHorizontal:width*0.1,            
    paddingHorizontal:15,
    paddingVertical:4
  },
  phoneStyle:{
    backgroundColor:'rgba(255, 255, 255, 0.0)',
    width:'50%',
    textAlign:'center',            
    fontSize:Number.parseFloat((height*0.022).toFixed(2)),
    fontFamily:fonts.bold,
    color:colorPalet.darkGrey,
    paddingHorizontal:width*0.01
  },
  phoneStylePlaceholder:{
    backgroundColor:'rgba(255, 255, 255, 0.0)',
    width:'50%',
    textAlign:'center',            
    fontSize:Number.parseFloat((height*0.022).toFixed(2)),
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    paddingHorizontal:width*0.01
  }
})