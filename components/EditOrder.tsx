import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,Image,ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colorPalet,fonts,order,dateStringFromDate,reserve,isOrder,isReserve} from '../util/util';
import CleanHeader from './AuxComponents/CleanHeader';
import {ordersGetRequest} from '../util/requests';
import NavigationRow from './AuxComponents/NavigationRow';
import { Route,NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface ProductLineProps extends React.ComponentPropsWithoutRef<"view">{
  reserve:reserve
}
function ProductLine(props:ProductLineProps):JSX.Element{
  const{name,_id,quantity=0,value=0,createdAt,lastUpdate,orderId,productId} = props.reserve;
  return (
    <View style={{marginVertical:5}}>
      <Text style={s.cardReserveHeaderText}>{name}</Text>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={s.cardReserveHeaderText}>{`Quantidade: ${quantity}`}</Text>
        <Text style={s.cardReserveHeaderText}>{`R$ ${value.toFixed().replace('.',',')}`}</Text>
      </View>
    </View>  
  )
}


export default function EditOrder({route,navigation}:{route:Route<'editOrder'>,navigation:any}): JSX.Element{
  const params = (route.params as {order:order,orderId:string});  
  
  const [order,setOrder]      = React.useState(undefined);
  const [loading,setLoading]  = React.useState(false);

  async function getOrderData(){
    try{      
      const tempOrders : any = await ordersGetRequest({orderId:params?.orderId});      
      if(tempOrders.length !== 1){        
        throw new Error('Zero or multiple orders for the provided ID');
      }else{
        setOrder(tempOrders[0]);
      }      
    }catch(e){
      console.log(e);
      setOrder(undefined)      
    }
  }
  
  function ConditionalCard(props:{order:order|undefined}):JSX.Element{    
    if(props.order && isOrder(props.order)){
      const order = props.order;
      const reserves : reserve[] = [];
      if(order.reserves.every(isReserve)){
        
      }
      const dtObj = dateStringFromDate(order.dueDate);
      const images ={
        edit:require('../assets/icons/Edit.png'),
        add:require('../assets/icons/Plus.png')
      }
      let clientData = {
        name:'Undefined Client',
        address:''
      };
      if(order.clientData){
        clientData = {
          name:`${order.clientData.name}`,
          address: `No address was found.`
        }        
        if( order.clientData?.address){
          const temp = order.clientData.address
          if(temp?.district && temp?.state && temp?.street && temp?.town){
            clientData.address = `${temp.street},${temp.number ? temp.number : 'SN'} - ${temp.district},${temp.state}`;
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
              <Text style={s.cardReserveHeaderText}>Pedido #{order.orderNumber}</Text>
              <View style={s.cardReserveHeaderIconContainer}>
                <Image source={images.add} style={s.cardReserveHeaderIcon}/>
                <Image source={images.edit} style={s.cardReserveHeaderIcon}/>
              </View>
            </View>
            <ScrollView style={{flexGrow:1}}>
              {/*order.reserves.map((e:reserve)=><ProductLine reserve={e} key={e._id}/>)*/}
              {order.reserves.map((e:any)=>{isReserve(e) ? <ProductLine reserve={e} key={e._id}/> : undefined})}
            </ScrollView>                        
          </View>
          <View style={s.totalContainer}></View>     
        </View>
      )
    }else{
      return <></>
    }
    
  }

  React.useEffect(()=>{
    getOrderData()
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
  },
  totalContainer:{
    backgroundColor:colorPalet.green,
    height:height*0.06,
    position:'absolute',
    bottom:0,
    width:'100%',
    paddingHorizontal:width*0.05
  }
})