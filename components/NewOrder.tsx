import React from 'react';
import {View,Text,Platform,StyleSheet,Dimensions,TouchableOpacity,VirtualizedList,Image,TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import {colorPalet,client,order} from '../util/util';
import {ClientList} from './ClientList';
import OrderCard from './AuxComponents/OrderCard';
import CleanHeader from './AuxComponents/CleanHeader';
import {ordersGetRequest,ordersPostRequest,getClients,ordersPatchRequest} from '../util/requests'
import NavigationRow  from './AuxComponents/NavigationRow';


const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

const orderPurpose : {value:'maintenance'|'sale'|'shopping',text:string}[] = [
  {value:'maintenance',text:'Maintenance'},
  {value:'sale',text:'Sale'},
  {value:'shopping',text:'Shopping'}
];
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
  const {params} = props.route;

  const [date, setDate]             = React.useState(params?.date ? params.date : new Date(Math.floor(Date.now()/1800000)*1800000));
  const [dateObj,setDateObj]        = React.useState(toDateObj(date));
  const [mode, setMode]             = React.useState('date'as tMode);
  const [orders,setOrders]          = React.useState([]);
  const [show, setShow]             = React.useState(false);
  const [loading,setLoading]        = React.useState(false);
  const [clientId,setClientId]      = React.useState(params?.order ? params.order.clientId : '');  
  const [purpose,setPurpose]        = React.useState(params?.order ? params.order.purpose : 0);
  const [clientList,setClientList]  = React.useState<client[] | []>([]);
  const [order,setOrder]            = React.useState(params?.order ? params.order : null);

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
      const params : Partial<order> ={        
        dueDate:date,        
        purpose:orderPurpose[purpose].value
      }     
      if(clientId){
        params.clientId = clientId
      }                  
      if(order){
        params._id = order._id
      }
      const response = order ? await ordersPatchRequest(params)  : await ordersPostRequest(params);          
      await simpleDelay(2000);
      setLoading(false);
      setOrder(response);
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
  function purposeCycle(increment:number):void{
    let temp = purpose + increment;
    if(temp < 0){
      temp = 2;
    }else if(temp > 2){
      temp = 0
    }
    setPurpose(temp);
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
      <ClientList clientList={clientList} customSelect={(a:string)=>{setClientId(a)}} />    
      <View style={s.centralContainer}>
        <TouchableOpacity style={s.centralContainerComponents} onPress={()=>{purposeCycle(-1)}}>
          <Image source={images.leftArrow} style={s.centralContainerIcons}/>
        </TouchableOpacity>
        <View style={s.centralContainerComponents} >
          <Text style={s.title}>{orderPurpose[purpose].text}</Text>
        </View>
        <TouchableOpacity style={s.centralContainerComponents} onPress={()=>{purposeCycle(1)}}>
          <Image source={images.rightArrow} style={s.centralContainerIcons} />
        </TouchableOpacity>
      </View>      
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
          <Text style={s.title}>{`${dateObj.hour}  :  ${dateObj.minute}  `}</Text>
        </TouchableOpacity>  
        <TouchableOpacity style={s.centralContainerComponents} onPress={()=>{setDate(new Date(date.valueOf()+1800000))}}>
          <Image source={images.rightArrow} style={s.centralContainerIcons} />
        </TouchableOpacity>
      </View>      
      {orders.length>0? listComponent() : (<View style={[s.centralContainer,{justifyContent:'center'}]}><View style={s.centralContainerComponents}><Text style={s.title}>All day is available</Text></View></View>)}      
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
  },  
})
