import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet,View,Dimensions,Image,Text,VirtualizedList,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderCard from './AuxComponents/OrderCard';
import {Calendar} from './Calendar';
import {colorPalet,order} from '../util/util';
import { AntDesign } from '@expo/vector-icons';
import {ordersGetRequest} from '../util/requests'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const logoDimentions = Math.floor(screenHeight*0.1);





export default function Home(props:any){  
  const [activeDate,setActiveDate]  = React.useState({date:new Date(),orders:[]});
  const [activeMonth,setActiveMonth]=React.useState(activeDate.date.getMonth() as number);
  const [orders,setOrders] = React.useState([]);  
  
  async function getOrders(activeDate:Date){    
    try{                 
      const minDate = new Date(activeDate.getFullYear(),activeDate.getMonth()-1,0);
      const maxDate = new Date(activeDate.getFullYear(),activeDate.getMonth()+1,8);
      const response = await ordersGetRequest({minDueDate:minDate,maxDueDate:maxDate});       
      return response; 
    }catch(e){
      console.log(e);
    }
  }
  async function onDatePress(newDate:Date) : Promise<void>{    
    const minDate = new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0);
    const maxDate = new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),23,59,59,999);        
    try{
      const response = await ordersGetRequest({minDueDate:minDate,maxDueDate:maxDate});       
      response.forEach((el:any)=>{
        el.creationDate = new Date(el.creationDate);
        el.dueDate      = new Date(el.dueDate);
      }); 
      setActiveDate({date:newDate,orders:response}) 
    }catch(e){
      console.log(e)
      setActiveDate({date:newDate,orders:[]}) 
    }
  }
  type changeMonth = (increment:number) => Promise<void>

  const changeMonth :changeMonth = async (increment:number) => {  
    try{      
      const nextMonth = (activeMonth+increment)%12 === -1 ? 11 : (activeMonth+increment)%12;
      const elapsedYears = Math.floor((activeMonth+increment)/12);
      const nextDate  = (activeMonth+increment)/12 > 1 ? new Date(activeDate.date.getFullYear(),activeDate.date.getMonth()+increment,1) : new Date(activeDate.date.getFullYear()+elapsedYears,activeDate.date.getMonth()+increment,1);
      setActiveDate({date:nextDate,orders:[]});
      setActiveMonth(nextMonth);
      setOrders(await getOrders(nextDate));
    }catch(e){
      console.log(e);
    }
  }  

  React.useEffect(()=>{    
    (async()=>{      
      setOrders(await getOrders(activeDate.date));
    })()    
  },[]);
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      (async()=>{      
        setOrders(await getOrders(activeDate.date));
      })()    
    });
    return unsubscribe;
  },[props.navigation]);
  return (    
    <SafeAreaView style={s.screen}>          
      <View style={{alignItems:"center",justifyContent:"center"}}>
        <View style={{height:(logoDimentions*0.5+10),backgroundColor:colorPalet.white,width:screenWidth,flexDirection:'row',justifyContent:'flex-end'}}>
          <TouchableOpacity 
            style={{justifyContent:'center',height:(logoDimentions*0.5+10),width:(screenWidth*0.1)}} 
            onPress={()=>props.navigation.navigate('newOrder')}>
            <AntDesign name="pluscircle" size={logoDimentions*0.4} color={colorPalet.darkGreen} />
          </TouchableOpacity>
        </View>
        <View style={{height:(logoDimentions*0.5+10),width:screenWidth}}></View>
        <Image source={require('../assets/icons/logo.png')} style={{height:logoDimentions,width:logoDimentions,position:'absolute'}}/>
      </View>
      <Calendar orders={orders} activeDate={activeDate.date} month={activeMonth} changeMonth={changeMonth} onDatePress={onDatePress}/>              
      <View style={s.centralContainer}>
        <View style={s.selectedDayContainer}>
          <View style={s.selectedDay}>
            <Text style={s.selectedDayText}>{activeDate.date.getDate()}</Text>
          </View>           
        </View>
        <VirtualizedList           
          style={s.listSize}
          data={activeDate.orders.sort((el:order,el2:order)=>{ return el.dueDate.getHours()>el2.dueDate.getHours() ? 1 : -1 })}
          initialNumToRender={4}
          getItem={(data,index)=>data[index]}
          getItemCount={(data)=>data.length}        
          keyExtractor={(item:any)=>item._id}
          renderItem={({item}:any)=>(<OrderCard item={item} cWidth={screenWidth*0.7}/>)}
        />
      </View>
    </SafeAreaView>    
  )  
}
const s = StyleSheet.create({
  screen:{
    backgroundColor:colorPalet.grey,
    alignItems:'center',
    flex:1
  },
  centralContainer:{
    width:screenWidth*0.8,
    backgroundColor:colorPalet.white,    
    alignItems:'center',
    marginTop:10,
    paddingTop:5,
    paddingBottom:10,
    borderRadius:10  
  },
  selectedDayContainer:{
    borderBottomColor:colorPalet.grey,
    borderBottomWidth:2,
    width:screenWidth*0.7,
    padding:5,
    alignItems:'center'
  },
  selectedDay:{
    backgroundColor:colorPalet.green,
    height:screenHeight*0.04,
    width:screenHeight*0.04,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:screenHeight*0.04    
  },
  selectedDayText:{
    color:colorPalet.white,
    fontFamily:'AlegreyaSans-Bold',
    fontSize:screenHeight*0.025,
    padding:0
  },
  
  listSize:{
    maxHeight:(screenHeight-screenHeight*0.73)
  }
})
