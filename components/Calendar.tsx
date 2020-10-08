
import React from 'react';
import {Text,TouchableOpacity,View,StyleSheet,Dimensions} from 'react-native'
import {calendarArray,day,weekLine,calendar,order,colorPalet} from '../util/util';


function CalendarLines(props:{calendar:calendar,onDatePress?:(newDate:Date)=>Promise<void>}) : JSX.Element {
  const {calendar} = props
  return (
    <>
      {calendar.map((el:weekLine)=><CalendarLine key={Math.random()*1000+''} date={el} onDatePress={props.onDatePress}/>)}
    </>
  )
}
function CalendarLine(props:{date:weekLine,onDatePress?:(newDate:Date)=>Promise<void>}){
  return (
    <View style={s.line}>
      {props.date.map((el:day)=><DayBox key={`dayBox-${el.date}`} data={el} onDatePress={props.onDatePress}/>)}
    </View>
  )
}
function DayBox(props:{data:day,onDatePress?:(newDate:Date)=>Promise<void>}){      
  const fontFamily  = props.data.activeMonth ? 'AlegreyaSans-Bold' : 'AlegreyaSans-Regular';
  const upperStyle  = props.data.orders.filter((el)=>el.dueDate.getHours()<12).length>0   ? s.ActiveUpperHalf : s.upperHalf;
  const lowerStyle  = props.data.orders.filter((el)=>el.dueDate.getHours()>=12).length>0  ? s.ActiveLowerHalf : s.lowerHalf;
  const localStyle = StyleSheet.create({dayText:{color:colorPalet.darkGrey,fontSize:12,position:'absolute',fontFamily:fontFamily}})
  return (
    <TouchableOpacity key={Math.random()*1000} style={s.day} onPress={()=>{if(props.onDatePress){props.onDatePress(props.data.date)}}}>
      <View style={s.circularView}>
        <View style={upperStyle}></View>
        <View style={lowerStyle}></View>
        <Text style={localStyle.dayText}>{props.data.date.getDate()}</Text>
      </View>        
    </TouchableOpacity>
  )
} 
function WeekDayLine(props:any): JSX.Element{
  return  (
    <View style={s.weekLine}>              
      <View style={s.weekday}><Text style={s.weekDayText}>SUN</Text></View>
      <View style={s.weekday}><Text style={s.weekDayText}>MON</Text></View>
      <View style={s.weekday}><Text style={s.weekDayText}>TUE</Text></View>
      <View style={s.weekday}><Text style={s.weekDayText}>WED</Text></View>
      <View style={s.weekday}><Text style={s.weekDayText}>THU</Text></View>
      <View style={s.weekday}><Text style={s.weekDayText}>FRI</Text></View>
      <View style={s.weekday}><Text style={s.weekDayText}>SAT</Text></View>
    </View>
  )
}
export function Calendar(props:{activeDate:Date,orders:order[],month:number,changeMonth:((increment:number)=>Promise<void>),onDatePress?:(newDate:Date)=>Promise<void>}): JSX.Element{
  
  
  const [calendar,setCalendar] = React.useState(calendarArray(props.activeDate,props.orders));
  
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  React.useEffect(()=>{    
    (async()=>await setCalendar(calendarArray(props.activeDate,props.orders)))()
  },[props.orders])
  return (
    <>
      <View style={s.monthLine}>
        <TouchableOpacity 
          style={{width:Math.floor(availableWidth/3)}}
          onPress={()=>{props.changeMonth(-1)}}  
        >
          <Text style={{fontFamily:'AlegreyaSans-Bold',textAlign:'right',fontSize:20}}>
            {'<'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Text>
        </TouchableOpacity>        
        <TouchableOpacity 
          style={{width:Math.floor(availableWidth/3)}}>
          <Text style={{fontFamily:'AlegreyaSans-Bold',textAlign:'center',fontSize:20}}>
            {`${months[props.month]}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{width:Math.floor(availableWidth/3)}}
          onPress={()=>{props.changeMonth(1)}}  
        >
          <Text style={{fontFamily:'AlegreyaSans-Bold',textAlign:'left',fontSize:20}}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'>'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={s.whiteContainer}>
        <WeekDayLine />
        <CalendarLines calendar={calendar} onDatePress={props.onDatePress}/>        
      </View>        
    </>
  )    
}

const sourceWidth   = Dimensions.get('window').width;
const sourceHeigth  = Dimensions.get('window').height;

const widthReducingFactor     = 0.8; //1 = no reduction
const heightReducingFactor    = 0.6;
const circularReducingFactor  = 0.6; 

const availableWidth  = Math.floor(sourceWidth*widthReducingFactor);
const availableHeight = Math.floor(sourceHeigth*heightReducingFactor);

const horarioDeQuebra = 12;

const calendarColumnWidth       = Math.floor(availableWidth/  7)-4;
const calendarHeight            = Math.floor(availableHeight/2);
const calendarDayLineHeight     = Math.floor(calendarHeight/5.5);
const calendarWeekLineHeight    = Math.floor(calendarDayLineHeight*0.5);

const circularContainerSize              = calendarDayLineHeight > calendarColumnWidth ? calendarColumnWidth : calendarDayLineHeight;
const circularSize = circularContainerSize*circularReducingFactor;

const s = StyleSheet.create({  
  whiteContainer:{    
    backgroundColor:colorPalet.white,
    width:availableWidth,
    paddingTop:5,
    paddingBottom:10,
    borderRadius:10    
  },
  monthLine:{
    height:calendarDayLineHeight,
    justifyContent:'center',
    alignItems:'center',    
    flexDirection:'row'
  },
  weekLine:{
    height:calendarWeekLineHeight,   
    width:availableWidth*0.8,     
    marginLeft:availableWidth*0.1,
    display:'flex',
    flexDirection:'row',
    marginTop:3,
    marginBottom:5,
    justifyContent:'center',    
    borderBottomWidth:1,
    borderBottomColor:colorPalet.grey
  },
  line:{
    flexDirection:"row",
    justifyContent:'center',
    marginVertical:2,                
    height:circularContainerSize*0.7
  },  
  day:{        
    height:circularContainerSize*0.7,
    width:circularContainerSize*0.9,
    marginHorizontal:2,        
    padding:0,
    alignItems:'center',
    justifyContent:'center'    
  },
  circularView:{    
    width:circularSize,
    height:circularSize,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',        
  },
  upperHalf:{    
    height:circularSize/2,
    width:circularSize,       
    overflow:'hidden'
  },
  ActiveUpperHalf:{
    backgroundColor:colorPalet.green,    
    height:circularSize/2,
    width:circularSize,
    //borderTopRightRadius:Math.floor(circularSize/2),
    //borderTopLeftRadius:Math.floor(circularSize/2),
    borderTopRightRadius:circularSize,
    borderTopLeftRadius:circularSize,
    overflow:'hidden'
  }, 
  lowerHalf:{     
    height:circularSize/2,
    width:circularSize,        
    overflow:'hidden'
  },
  ActiveLowerHalf:{ 
    backgroundColor:colorPalet.green,    
    height:circularSize/2,
    width:circularSize,    
    borderBottomRightRadius:circularSize,
    borderBottomLeftRadius:circularSize,
    //borderBottomRightRadius:Math.floor(circularSize/2),
    //borderBottomLeftRadius:Math.floor(circularSize/2),
    overflow:'hidden'
  },   
  weekday:{        
    justifyContent:'center',
    height:calendarWeekLineHeight,
    width:circularContainerSize*0.9,
    marginHorizontal:2,        
  },
  weekDayText:{
    fontFamily:'AlegreyaSans-Regular',
    color:colorPalet.darkGrey,
    fontSize:11,
    textAlign:'center'
  }
})