import React from 'react';
import {View,Text,Button,Platform,StyleSheet,Dimensions,TouchableOpacity,Animated,FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import {colorPalet} from '../util/util';

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

type dateObj = {
  day: string,
  month:string,
  hour:string,
  minute:string,
  period: string
}
function toDateObj(date:Date): dateObj {
  const tempHour = date.getHours();

  const newDateObj = {
    day:    `${date.getDate()}`,
    month:  monthNames[date.getMonth()],
    hour:   tempHour > 12 ? `${tempHour-12}` : `${tempHour}`,
    minute: `${date.getMinutes()}`,
    period: tempHour >= 12 ? 'PM' : 'AM'
  };
  
  return newDateObj;
}

export default function NewOrder(props:any){
  type tMode = "date" | "time" | "datetime" | "countdown" | undefined ;

  const [date, setDate] = React.useState(new Date());
  const [dateObj,setDateObj] = React.useState(toDateObj(date));
  const [mode, setMode] = React.useState('date'as tMode);
  const [show, setShow] = React.useState(false);
  
  const onChange = (event:Event, selectedDate:Date|undefined):void => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode:tMode) => {
    setMode(currentMode);
    setShow(true);    
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };  

  React.useEffect(()=>{
    setDateObj(toDateObj(date));
  },[date]);

  return (
    <SafeAreaView style={s.container}>
      
      <Text style={s.title}>
        Set this order due date:
      </Text>
      <View>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={s.hours}>{`${dateObj.month}, ${dateObj.day}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showTimepicker}>
          <Text style={s.hours}>{`${dateObj.hour}  :  ${dateObj.minute}  ${dateObj.period}`}</Text>
        </TouchableOpacity>                
      </View>
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
      
      <FlatList
        data={dummyData}
        keyExtractor={item=>item._id}
        renderItem={item=>(<Text>{item.name}</Text>)}
      />
      
    </SafeAreaView>
  );
}
/**
 <Animated.FlatList
        data={dummyData}
        keyExtractor={item=>item._id}
        renderItem={item=>(<Text>{item.name}</Text>)}
      />
 */
const windowHeight  = Dimensions.get('window').height;
const windowWidth   = Dimensions.get('window').width;

const s = StyleSheet.create({
  container:{
    flexDirection:'column',
    height:'100%',
    justifyContent:'center',
    //alignContent:'center',
    //alignItems:'center'    
  },
  title:{
    fontFamily:'AlegreyaSans-Bold',
    fontSize:windowHeight*0.03,
    color:colorPalet.darkGrey,
    textAlign:'center'
  },
  hours:{
    fontFamily:'AlegreyaSans-Bold',
    fontSize:windowHeight*0.06,
    color:colorPalet.darkGrey,
    textAlign:'center'
  },
  flatListItem:{
    color:colorPalet.grey,
    fontSize:windowHeight*0.03
  }
})