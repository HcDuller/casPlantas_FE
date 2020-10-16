import React from 'react';
import {View,Text,Platform,StyleSheet,Dimensions,TouchableOpacity,VirtualizedList,Image,TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import {colorPalet,client, isClient} from '../util/util';
import {ClientList} from './ClientList';
import OrderCard from './AuxComponents/OrderCard';
import CleanHeader from './AuxComponents/CleanHeader';
import {ordersGetRequest,ordersPostRequest,getClients} from '../util/requests'
import ProgressBar from './AuxComponents/ProgressBar'
import NavigationRow  from './AuxComponents/NavigationRow';
import { TouchableHighlight } from 'react-native-gesture-handler';

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const dummyData = [
  {
    "address": {
      "addressType": "",
      "street": "",
      "number": null,
      "detail": "",
      "district": "",
      "town": "",
      "estate": ""
    },
    "phones": [
      "a"
    ],
    "doc": "",
    "instagram": "isso eh um teste",
    "anniversary": "2020-08-24T18:17:34.815Z",
    "since": "2020-08-24T18:17:34.815Z",
    "_id": "5f4404531c0ce002908a8de1",
    "name": "Bruno Bredariol",
    "__v": 1
  },
  {
    "address": {
      "addressType": "",
      "street": "",
      "number": null,
      "detail": "",
      "district": "",
      "town": "",
      "estate": ""
    },
    "phones": [
      "862315862"
    ],
    "doc": "",
    "instagram": "",
    "anniversary": "2020-08-21T21:07:26.066Z",
    "since": "2014-08-22T21:07:26.066Z",
    "_id": "5f40411660eab43504cabbae",
    "name": "Camila Pontes",
    "__v": 0
  },
  {
    "address": {
      "addressType": "Rua",
      "street": "Wiliam Furneau",
      "number": 140,
      "detail": "",
      "district": "Santo Elias",
      "town": "Sao Paulo",
      "estate": "Sao Paulo"
    },
    "phones": [
      "862315862"
    ],
    "doc": "",
    "instagram": "",
    "anniversary": "2020-08-21T21:07:26.066Z",
    "since": "2012-08-21T21:07:26.066Z",
    "_id": "5f40411360eab43504cabbad",
    "name": "Henrique de Campos Duller",
    "__v": 0
  },
  {
    "address": {
      "addressType": "",
      "street": "",
      "number": null,
      "detail": "",
      "district": "",
      "town": "",
      "estate": ""
    },
    "phones": [
      "862315862"
    ],
    "doc": "",
    "instagram": "",
    "anniversary": "2020-08-21T21:07:26.066Z",
    "since": "2020-08-21T21:07:26.066Z",
    "_id": "5f40411f60eab43504cabbb1",
    "name": "Jade Jado Anjos",
    "__v": 0
  },
  {
    "address": {
      "addressType": "",
      "street": "",
      "number": null,
      "detail": "",
      "district": "",
      "town": "",
      "estate": ""
    },
    "phones": [
      "862315862"
    ],
    "doc": "",
    "instagram": "",
    "anniversary": "2020-08-21T21:07:26.066Z",
    "since": "2010-08-21T21:07:26.066Z",
    "_id": "5f4037da60eab43504cabbac",
    "name": "Joao Abidu Jajaja",
    "__v": 0
  },
  {
    "address": {
      "addressType": "",
      "street": "",
      "number": null,
      "detail": "",
      "district": "",
      "town": "",
      "estate": ""
    },
    "phones": [
      "862315862"
    ],
    "doc": "",
    "instagram": "",
    "anniversary": "2020-08-21T21:07:26.066Z",
    "since": "2016-08-21T21:07:26.066Z",
    "_id": "5f40411960eab43504cabbaf",
    "name": "Juliana Bunda Mole de Campos",
    "__v": 0
  },
  {
    "address": {
      "addressType": "",
      "street": "",
      "number": null,
      "detail": "",
      "district": "",
      "town": "",
      "estate": ""
    },
    "phones": [
      "862315862"
    ],
    "doc": "",
    "instagram": "",
    "anniversary": "2020-08-21T21:07:26.066Z",
    "since": "2020-08-21T21:07:26.066Z",
    "_id": "5f40411c60eab43504cabbb0",
    "name": "Julio Akira Oriental",
    "__v": 0
  }
]
const logoHeight = Dimensions.get('window').height*0.1;
type dateObj = {
  day: string,
  month:string,
  'twelveHour':string,
  hour:string,
  minute:string,
  period: string
}
const images = {
  leftArrow:  require('../assets/icons/Arrow_L.png'),
  rightArrow: require('../assets/icons/Arrow_R.png')
}
function toDateObj(date:Date): dateObj {
  const tempHour = date.getHours();

  const newDateObj = {
    day:    `${date.getDate()}`,
    month:  monthNames[date.getMonth()],
    twelveHour:   tempHour > 12 ? `${tempHour-12}` : `${tempHour}`,
    hour: `${tempHour}`,
    minute: `${date.getMinutes()>9?'':0}${date.getMinutes()}`,
    period: tempHour >= 12 ? 'PM' : 'AM'
  };
  
  return newDateObj;
}
async function getOrders(activeDate:Date){    
  try{          
    const minDate = new Date(activeDate.getFullYear(),activeDate.getMonth(),activeDate.getDate(),0);
    const maxDate = new Date(activeDate.getFullYear(),activeDate.getMonth(),activeDate.getDate(),23,59,59,999);
    const response = await ordersGetRequest({minDueDate:minDate,maxDueDate:maxDate});       
    return response;      
  }catch(e){
    console.log(e);
  }
}
export default function NewOrder(props:any){
  type tMode = "date" | "time" | "datetime" | "countdown" | undefined ;

  const [date, setDate]             = React.useState(new Date());
  const [dateObj,setDateObj]        = React.useState(toDateObj(date));
  const [mode, setMode]             = React.useState('date'as tMode);
  const [orders,setOrders]          = React.useState([]);
  const [show, setShow]             = React.useState(false);
  const [loading,setLoading]        = React.useState(false);
  const [clientName,setClientName]  = React.useState('');  
  const [clientList,setClientList]  = React.useState<client[] | []>([]);

  const onChange = (event:Event, selectedDate:Date|undefined):void => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const showMode = (currentMode:tMode) => {
    setMode(currentMode);
    setShow(!show);    
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showTimepicker = () => {
    showMode('time');
  };  
  function simpleDelay(time:number){
    return new Promise((resolve)=>{return setTimeout(resolve,time)})
  }
  async function fetchClients(){
    try{
      const clients = await getClients();            
      setClientList(clients);
    }catch(e){
      throw e;
    }
  }
  
  async function saveAndGo(){
    try{
      setLoading(true);      
      const response = await ordersPostRequest({dueDate:date});            
      await simpleDelay(2000);
      setLoading(false);
      props.navigation.navigate('editOrder',{order:response});
    }catch(e){
      console.log(e)
    }
  }
  React.useEffect(()=>{
    setDateObj(toDateObj(date));
    (async ()=>{
      await fetchClients();
      setOrders(await getOrders(date))})();    
  },[date,loading]);  
    
  function listComponent(){
    return(
      <View style={s.toDoList}>      
        <VirtualizedList           
          data={orders.sort((el,el2)=>{ return el.dueDate.valueOf()>el2.dueDate.valueOf() ? 1 : -1 })}
          initialNumToRender={4}
          getItem={(data:Array<any> ,index:number)=>data[index]}
          getItemCount={(data)=>data.length}        
          keyExtractor={(item:any)=>item._id}
          renderItem={({item}:any)=>(<OrderCard cWidth={windowWidth*0.7} item={item}/>)}
        />
      </View>
    )
  }
  
  return (
    <SafeAreaView style={s.container}>            
      <CleanHeader logoHeight={logoHeight}/>                      
      <NavigationRow loading={loading} ohNoPress={()=>props.navigation.goBack()} goGoPress={saveAndGo}/>      
      {show ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          //is24Hour={false}
          display="default"
          onChange={onChange}
        />
      ) : undefined}            
      <View style={s.centralContainer}>
        <TouchableOpacity style={s.centralContainerComponents} onPress={()=>{setDate(new Date(date.valueOf()-86400000))}}>
          <Image source={images.leftArrow} style={s.centralContainerIcons}/>
        </TouchableOpacity>
        <TouchableOpacity style={s.centralContainerComponents} onPress={showDatepicker}>
          <Text style={s.title}>{`${dateObj.month}, ${dateObj.day}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.centralContainerComponents} onPress={()=>{setDate(new Date(date.valueOf()+86400000))}}>
          <Image source={images.rightArrow} style={s.centralContainerIcons} />
        </TouchableOpacity>
      </View>
      <View style={s.centralContainer}>
        <TouchableOpacity style={s.centralContainerComponents} onPress={()=>{setDate(new Date(date.valueOf()-1800000))}}>
          <Image source={images.leftArrow} style={s.centralContainerIcons}/>
        </TouchableOpacity>
        <TouchableOpacity style={s.centralContainerComponents} onPress={showTimepicker}>
          <Text style={s.title}>{`${dateObj.twelveHour}  :  ${dateObj.minute}  ${dateObj.period}`}</Text>
        </TouchableOpacity>  
        <TouchableOpacity style={s.centralContainerComponents} onPress={()=>{setDate(new Date(date.valueOf()+1800000))}}>
          <Image source={images.rightArrow} style={s.centralContainerIcons} />
        </TouchableOpacity>
      </View>
      <ClientList clientList={clientList} onSelect={(a:string)=>{}} />
      {orders.length>0? listComponent() : (<View style={[s.centralContainer,{justifyContent:'center'}]}><View style={s.centralContainerComponents}><Text style={s.title}>All day is available</Text></View></View>)}                                   
      <View style={s.centralContainer}>
        <View style={[s.centralContainerComponents]}>          
          <Text style={s.title}>Implementation pending</Text>
        </View>
      </View>      
    </SafeAreaView>
  );
}
const windowHeight  = Dimensions.get('window').height;
const windowWidth   = Dimensions.get('window').width;

const s = StyleSheet.create({
  container:{  
    backgroundColor:colorPalet.grey,
    height:windowHeight,        
    flex:1
    //alignContent:'center',
    //alignItems:'center'    
  },
  
  title:{
    fontFamily:'AlegreyaSans-Bold',
    fontSize:windowHeight*0.023,
    color:colorPalet.darkGrey,
    textAlign:'center',
    alignSelf:'center'
  },
  hours:{
    fontFamily:'AlegreyaSans-Bold',
    fontSize:windowHeight*0.06,
    color:colorPalet.darkGrey,
    textAlign:'center'
  },
  flatListItem:{
    color:colorPalet.darkGrey,
    fontSize:windowHeight*0.03,
    textAlign:'center'
  },
  centralContainer:{
    backgroundColor:colorPalet.white,
    width:windowWidth*0.8,    
    flexDirection:'row',
    alignItems:'stretch',
    justifyContent:'space-between',    
    borderRadius:10,
    marginVertical:windowHeight*0.01,
    marginHorizontal:windowWidth*0.1
  },
  centralContainerComponents:{
    alignContent:'center',
    justifyContent:'center',
    minWidth:windowWidth*0.25,
    height:windowHeight*0.06
  },
  centralContainerIcons:{    
    alignSelf:'center',    
    height:windowHeight*0.02,
    width:windowHeight*0.02
  },
  toDoList:{
    minHeight:windowHeight*0.06,
    maxHeight:windowHeight*0.2,    
    width:windowWidth*0.8,
    marginHorizontal:windowWidth*0.1,
    alignContent:'center',
    alignSelf:'center',
    backgroundColor:colorPalet.white,    
    alignItems:'center',
    marginTop:10,
    paddingTop:5,
    paddingBottom:10,
    borderRadius:10  
  },
  navigationLine:{
    height:windowHeight*0.05,
    paddingHorizontal:windowWidth*0.04,
    width:'100%',
    flexDirection:'row',
    alignContent:'flex-start',
    alignItems:'flex-start',
    justifyContent:'space-between'
  },
  navigationTouchable:{
    flexDirection:'row'
  },
  navigationText:{
    fontFamily:'AlegreyaSans-Regular',
    fontSize:windowHeight*0.022,
    color:colorPalet.darkGrey,    
    alignSelf:'center'
  },
  navigationIcons:{
    height:windowHeight*0.035,
    width:windowHeight*0.035
  }
})