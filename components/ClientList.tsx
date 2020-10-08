import React from 'react';
import {View,Text,Button,Platform,StyleSheet,Dimensions,TouchableOpacity,Animated,FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import {colorPalet} from '../util/util';


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
function fListItem({item}){  
  return (
    <Text style={s.flatListItem}>{`${item.name}`}</Text>
  )
}
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export function ClientList(props:any) {
  
  const [open,setOpen] = React.useState(false);
  const [list,setList]  = React.useState([]);

  const stretchAnim = React.useRef(new Animated.Value(0)).current;
  const stretcher = () => {
    if(open){            
      animate(0);            
      console.log('retracting');
    }else{      
      animate(400);            
      console.log('expanding');
    }
    setOpen(!open);
  } 
  const animate = (size:number,time:number = 1000) => {    
    Animated.timing(stretchAnim, {
      useNativeDriver: false,
      toValue: size,
      duration: time,
    }).start();
  };
  
  return (
    <View>  
      <TouchableOpacity>
        <Text style={s.title} onPress={()=>{stretcher()}}> Select Client </Text>
      </TouchableOpacity> 
      <AnimatedFlatList
        data={dummyData}
        style={{maxHeight:stretchAnim}}                
        refreshing={list.length===0}
        keyExtractor={item=>item._id}
        renderItem={fListItem}                
      />
    </View>
  );
}
/**
 <TouchableOpacity style={{backgroundColor:'black',zIndex:0}}>
        <Text style={[s.title]} onPress={()=>{console.log('teste'),strechOut()}}> Select Client </Text>
      </TouchableOpacity> 
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
    color:colorPalet.darkGrey,
    fontSize:windowHeight*0.03,
    textAlign:'center'
  }
})