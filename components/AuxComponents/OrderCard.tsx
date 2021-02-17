import React from 'react'
import {StyleSheet,View,Text,Dimensions,Pressable} from 'react-native'
import {colorPalet,order} from '../../util/util';


const screenHeight = Dimensions.get('window').height;
interface ViewOrderDataProps extends React.ComponentPropsWithoutRef<'view'>{
  item:order,
  cWidth:number,
  editOrder?:(order:order)=>void
}
export default function ViewOrderData(props:ViewOrderDataProps): JSX.Element{
  const {_id,clientId,creationDate,dueDate,orderNumber,reserves,status,clientData} = props.item;

  const s = StyleSheet.create({
    orderCard:{
      flexDirection:'row',    
      alignItems:'center',
      height:screenHeight*0.1,
      width:props.cWidth,
      paddingVertical:5
    },  
    orderCardDieTimeText:{
      color:colorPalet.white,
      fontFamily:'AlegreyaSans-Bold',
      fontSize:screenHeight*0.02
    },
    orderCardDetailTextRegular:{ 
      fontFamily:'AlegreyaSans-Regular',
      fontSize:screenHeight*0.017,
      color:colorPalet.darkGrey,
    },
    orderCardDetailTextBold:{ 
      fontFamily:'AlegreyaSans-Bold',
      fontSize:screenHeight*0.022,
      color:colorPalet.darkGrey,    
    },
  })
  
  const f = StyleSheet.create({
    orderCardDueTimeView:{
      borderRadius:screenHeight*0.1,
      height: screenHeight*0.1*0.6,
      width:  screenHeight*0.1*0.6,
      backgroundColor:dueDate.getHours()<12? colorPalet.orange : colorPalet.purple,
      alignItems:'center',
      justifyContent:'center',
      marginRight:10      
    }
  })
  const clientName = clientData?.name ? clientData.name : 'Sem Cliente Definido'    
  let address = '';
  let address2 = '';
  if(clientData){
    clientData.address.addressType  ? address   += `${clientData.address.addressType} ` : undefined ;
    clientData.address.street       ? address   += `${clientData.address.street}, ` : undefined ;
    clientData.address.number       ? address   += `${clientData.address.number}` : undefined ;
    clientData.address.district     ? address2  += `${clientData.address.district}, ` : undefined ;
    clientData.address.town         ? address2  += `${clientData.address.town}, ` : undefined ;
    clientData.address.state        ? address2  += `${clientData.address.state}` : undefined ;
  }
  let total = 0;
  reserves.forEach((el:any)=>{
    total+=(el.quantity*el.value);
  });
  return (
    <Pressable 
      style={s.orderCard}
      disabled={!props.editOrder}
      onPress={()=>{if(props?.editOrder){props.editOrder(props.item)}}}
    >
      <View style={f.orderCardDueTimeView}>
        <Text style={s.orderCardDieTimeText}>{`${dueDate.getHours()}:${dueDate.getMinutes()}`}</Text>
      </View>
      <View style={{flexWrap:'nowrap'}}>
        <Text style={s.orderCardDetailTextBold}>{clientName}</Text>
        <Text style={s.orderCardDetailTextRegular}>{address}</Text>      
        <Text style={s.orderCardDetailTextRegular}>{address2}</Text>    
        <Text style={s.orderCardDetailTextRegular}>{`R$ ${isNaN(total) ? 0 : total }`}</Text>         
      </View>      
    </Pressable>
  )  
}
