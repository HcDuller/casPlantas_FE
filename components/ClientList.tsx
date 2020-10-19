import React from 'react';
import {View,Text,Image,StyleSheet,Dimensions,TouchableOpacity,Animated,FlatList,TextInput} from 'react-native';
import {colorPalet,client,fonts} from '../util/util';

const windowHeight  = Dimensions.get('window').height;
const windowWidth   = Dimensions.get('window').width;

type newClientItem = {
  _id:string,
  onPress:()=>void,
  newClient:boolean  
}
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const icons = {
  search: require('../assets/icons/Search.png'),
  delete: require('../assets/icons/Delete.png'),
}
export function ClientList(props:{clientList: client[] | [] | newClientItem[],onSelect:(clientId:string)=>void}) {
  
  const [open,setOpen] = React.useState(false);
  const [list,setList]  = React.useState([]);
  const [placeholder,setPlaceHolder] = React.useState('Select a client');
  
  const inputRef = React.useRef(null);

  const stretchAnim = React.useRef(new Animated.Value(0)).current;
  const horizontalTranslate = React.useRef(new Animated.Value(0)).current;
  const stretcher = () => {
    if(open){            
      animate(0);                  
    }else{      
      animate(150);                  
    }
    setOpen(!open);
  } 
  const animate = (size:number,time:number = 1000) => {    
    //Animated.timing(stretchAnim, {
    //  useNativeDriver: false,
    //  toValue: size,
    //  duration: time,
    //}).start();
    const stretcherAnim = Animated.timing(stretchAnim, {
      useNativeDriver: false,
      toValue: size,
      duration: time,
    });
    const translater = Animated.timing(horizontalTranslate,{
      useNativeDriver:true,
      toValue:size === 0 ? 0 : windowWidth,
      duration:time
    });
    stretcherAnim.start();
    //Animated.parallel([stretcherAnim,translater]).start();    
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
  function AddNewClient(props:any): JSX.Element{
    return (
      <TouchableOpacity>
        <View style={s.addNewClientButton}>
          <Text style={s.addNewClientText}>Add New Client</Text>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View style={s.centralContainer}>      
      <View style={s.centralContainerComponents}>                    
          <View style={[s.centralContainerComponents,{flexDirection:'row'}]}>
            <TextInput 
              ref={inputRef} 
              placeholder='Select a Client' 
              style={[s.title,{width:windowWidth*0.66,textAlign:'left',paddingRight:10}]} 
              onFocus={()=>{stretcher()}}
              onBlur={()=>{stretcher()}}
              />

              <TouchableOpacity onPress={()=>{inputRef.current?.isFocused() ? inputRef.current.blur() : inputRef.current.focus()}}>
                <Image source={inputRef.current?.isFocused() ? icons.delete : icons.search} 
                  style={
                    {height:windowHeight*0.03,
                    width:windowHeight*0.03,
                    tintColor: (inputRef.current?.isFocused() ? colorPalet.red : colorPalet.green)
                    }
                  }
                />                
              </TouchableOpacity>
          </View>
        {props.clientList.length===0? undefined : (
        <View>          
          <AnimatedFlatList
            data={props.clientList}
            ListHeaderComponent={AddNewClient}
            style={{maxHeight:stretchAnim,width:windowWidth*0.8}}                
            refreshing={list.length===0}
            keyExtractor={item=>item._id}
            renderItem={fListItem}                
          />
        </View>)}
        
      </View>
    </View>
  );
}
//{transform:[{translateX:((horizontalTranslate as unknown) as number)}]}


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
    alignItems:'center',   
    minWidth:windowWidth*0.25,
    minHeight:windowHeight*0.06,    
    overflow:'hidden'
  },
  title:{
    fontFamily:fonts.bold,
    fontSize:windowHeight*0.022,
    color:colorPalet.darkGrey    
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
  },
  addNewClientButton:{
    width:'90%',
    alignSelf:'center',
    borderRadius:windowHeight*0.04,
    height:windowHeight*0.04,
    paddingHorizontal:windowWidth*0.05,    
    backgroundColor:colorPalet.green,    
    justifyContent:'center',
    alignItems:'center',
    marginBottom:4
  },
  addNewClientText:{
    fontFamily:fonts.bold,
    color:colorPalet.white,
    fontSize:windowHeight*0.022,    
  },
})