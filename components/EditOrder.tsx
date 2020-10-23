import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colorPalet,fonts,order,dateStringFromDate} from '../util/util';
import CleanHeader from './AuxComponents/CleanHeader';
import {ordersGetRequest} from '../util/requests';
import NavigationRow from './AuxComponents/NavigationRow';
import { Route,NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';



export default function EditOrder({route,navigation}:{route:Route<'editOrder'>,navigation:any}): JSX.Element{
  const params = (route.params as {order:order});  
  const [orders,setOrders]    = React.useState([]);
  const [order,setOrder]      = React.useState(undefined);
  const [loading,setLoading]  = React.useState(false);

  async function teste(){
    try{
      
      const tempOrders : any = await ordersGetRequest({orderId:params?.order?._id});      
      if(tempOrders.length !== 1){
        throw new Error('Zero or multiple orders for the provided ID');
      }else{
        setOrder(tempOrders[0]);
      }      
    }catch(e){
      console.log(e);
      setOrder(undefined)
      setOrders([])
    }
  }
  

  function ConditionalCard(props:{order:order|undefined}):JSX.Element{
    
    if(props.order){
      const dtObj = dateStringFromDate(props.order.dueDate);
      const images ={
        edit:require('../assets/icons/Edit.png'),
        add:require('../assets/icons/Plus.png')
      }
      let clientData = {
        name:'Undefined Client',
        address:''
      };
      if(props.order.clientData){
        clientData = {
          name:`${props.order.clientData.name}`,
          address: `No address was found.`
        }        
        if( props.order.clientData?.address){
          const temp = props.order.clientData.address
          if(temp?.addressType && temp?.district && temp?.estate && temp?.street && temp?.town){
            clientData.address = `${temp.addressType} ${temp.street},${temp.number ? temp.number : 'SN'} - ${temp.district},${temp.estate}`;
          }          
        }
      }
      return (
        <View style={s.card}>        
          <View style={s.cardTitle}>
            <Text style={s.cardTitleText}>
              {`${dtObj.day}${String.fromCharCode(183)} ${dtObj.month[0]}  |  ${dtObj.weekDay[0]}  |  ${dtObj.hour}:${dtObj.minute}`}
            </Text>
            <TouchableOpacity>
              <Image source={images.edit} style={s.cardTitleIcon}/>
            </TouchableOpacity>
          </View>            
          <View style={s.cardSubTitle}>            
            <Text style={s.carSubTitleHeader}>{clientData.name}</Text>
            {clientData.address !== '' ? <Text style={s.cardSubTitleDescription}>{clientData.address}</Text> : undefined}                        
          </View>             
          <View style={s.cardReserveContaner}>
            <View style={s.cardReserveHeaderContainer}>
              <Text style={s.cardReserveHeaderText}>Pedido #{props.order.orderNumber}</Text>
              <View style={s.cardReserveHeaderIconContainer}>
                <Image source={images.add} style={s.cardReserveHeaderIcon}/>
                <Image source={images.edit} style={s.cardReserveHeaderIcon}/>
              </View>
            </View>
            
          </View>     
        </View>
      )
    }else{
      return <></>
    }
    
  }
  React.useEffect(()=>{
    teste()
  },[])
  return (
    <SafeAreaView style={s.safeArea}>
      <CleanHeader />
      <NavigationRow ohNoPress={()=>navigation.goBack()} goGoPress={()=>navigation.navigate('home')} loading={loading}/>
      <ConditionalCard order={(order as unknown) as order}/>
    </SafeAreaView>
  )
}
const width   = Dimensions.get('window').width;
const height  = Dimensions.get('window').height;

const s = StyleSheet.create({
  safeArea:{
    backgroundColor:colorPalet.grey,
    height:'100%'
  },
  tempContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    height:75
  },
  buttonT:{
    backgroundColor:colorPalet.darkGreen,
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  card:{
    justifyContent:'flex-start',
    height:height*0.75,
    backgroundColor:colorPalet.white,    
    width:'80%',
    borderRadius:10,
    overflow:'hidden',
    alignSelf:'center',

  },
  cardTitle:{
    height:height*0.06,
    backgroundColor:colorPalet.orange,    
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:width*0.05,
  },
  cardTitleText:{    
    fontFamily:fonts.bold,
    fontSize:height*0.02,
    color:colorPalet.white    
  },
  cardTitleIcon:{
    height:height*0.02,
    width:height*0.02,
    tintColor:colorPalet.white
  },
  cardSubTitle:{
    height:height*0.12,    
    backgroundColor:colorPalet.darkOrange, 
    paddingHorizontal:width*0.05,    
    justifyContent:'center',
    
  },
  carSubTitleHeader:{
    fontFamily:fonts.bold,
    fontSize:height*0.023,
    color:colorPalet.darkGrey
  },
  cardSubTitleDescription:{
    fontFamily:fonts.regular,
    fontSize:height*0.02,
    color:colorPalet.darkGrey,    
  },
  cardReserveContaner:{
    paddingHorizontal:width*0.05,
    borderBottomColor:colorPalet.darkGrey,    
  },
  cardReserveHeaderContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignContent:'center',
    alignItems:'center',
    height:height*0.06,
    borderBottomWidth:1,
    borderBottomColor:colorPalet.darkGrey
  },
  cardReserveHeaderText:{
    fontFamily:fonts.regular,
    fontSize:height*0.02,
    color:colorPalet.darkGrey,    
  },
  cardReserveHeaderIconContainer:{
    width:height*0.06,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  cardReserveHeaderIcon:{
    height:height*0.02,
    width:height*0.02,
    tintColor:colorPalet.darkGrey
  }
})