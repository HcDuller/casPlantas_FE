import React from 'react';
import {View,Text,Button,Platform,StyleSheet,Dimensions,TouchableOpacity,TouchableHighlight,Animated,FlatList} from 'react-native';
import {colorPalet,client,fonts} from '../util/util';

const windowHeight  = Dimensions.get('window').height;
const windowWidth   = Dimensions.get('window').width;

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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export function ClientList(props:{clientList: client[] | [],onSelect:(clientId:string)=>void}) {
  
  const [open,setOpen] = React.useState(false);
  const [list,setList]  = React.useState([]);

  const stretchAnim = React.useRef(new Animated.Value(0)).current;
  const stretcher = () => {
    if(open){            
      animate(0);                  
    }else{      
      animate(150);                  
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
  function fListItem({item}){  
    return (
      <TouchableOpacity>
        <View style={s.flatListItem}>
          <Text style={s.flatListText}>{`${item.name}`}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View style={s.centralContainer}>
      <View style={s.centralContainerComponents}>  
        <TouchableOpacity style={{minWidth:windowWidth*0.25,minHeight:windowHeight*0.06,justifyContent:'center'}}>
          <Text style={s.title} onPress={()=>{stretcher()}}> Select Client </Text>
        </TouchableOpacity> 
        {props.clientList.length===0? undefined : (<AnimatedFlatList
          data={props.clientList}
          style={{maxHeight:stretchAnim,width:windowWidth*0.8}}                
          refreshing={list.length===0}
          keyExtractor={item=>item._id}
          renderItem={fListItem}                
        />)}
        
      </View>
    </View>
  );
}
/**
 <TouchableOpacity style={{backgroundColor:'black',zIndex:0}}>
        <Text style={[s.title]} onPress={()=>{console.log('teste'),strechOut()}}> Select Client </Text>
      </TouchableOpacity> 
 */

const s = StyleSheet.create({
  container:{
    flexDirection:'column',
    height:'100%',
    justifyContent:'center',
    //alignContent:'center',
    //alignItems:'center'    
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
    minHeight:windowHeight*0.06,    
  },
  title:{
    fontFamily:fonts.bold,
    fontSize:windowHeight*0.022,
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
    height:windowHeight*0.04,
    paddingHorizontal:windowWidth*0.05,        
    justifyContent:'center',    
    borderBottomWidth:1,
    borderBottomColor:colorPalet.grey
  },
  flatListText:{
    fontFamily:fonts.bold,
    color:colorPalet.darkGrey,
    fontSize:windowHeight*0.022,    
  }
})