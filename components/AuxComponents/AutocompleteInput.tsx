import React from 'react';
import {} from 'react-native';
import {ViewStyle,StyleProp,FlatList,Dimensions,StyleSheet,Text,View,TextInput,TouchableHighlight,KeyboardAvoidingView} from 'react-native';
import {fonts,colorPalet,address} from '../../util/util';
import {geocoding,autocomplete} from '../../util/requests'

const {height,width}  = Dimensions.get('window');
const strings = ['MKwcx2gKNVW5yqH','PSGKNW7C3OscXYf','CQ50hAETZom38WP','4GRzyS0QCjC4d84','HuMWDpnCCxr5I8d','FlVQVYVw6n9Ytli','LAagxqkJOlISk7z','oNFkzmc8LGHj97P','1Vyd0YtkM71l8cS','ErBnOHeLccwji04','lwAHqzQHPu9lFeV','h2Y70vdWzhhH9rP','BrMrUVKbcnsJJfr','sTkuixpXjxKndMw','ObtxESLtu76HFJ2','87QYUcgZp3JrouH','GgZaDpHV7gnBfss','fw6LtlDVAaV0QIt','4oP5tF6Qu0S4V75','uK1FTcYTzwcfvG3','7nsHfmrENcemuzz','DLzNN9BNJe82Ima','HBdalBHeIMbzcvv','bSVoMLIIF3Gypwr','eZEf4cqv2oRSKGO','i5iVyNsZHCckPDA','z9wbVwW9i49bO2g','VPiVjLI5tWLIQiT','gfbsemeT4KSRasZ','CGwAM7Ga7u1JZxI','uZP7GQNU5vVyNYz','MLABT7tlJfeF6Hx','mJhLEsKCmb72sFN','PGzuKLnaaHXQwAW','UnRzltER0JH8dEw','D7NwoX50lY645Cs','2ZLQ9agv2BtMwVp','xKgcuOvjOJJkaey','fY37IVVBprtssZS','vsyF8gmQsQGQgUS','I74mDwTE0LKoX1h','LEGKzqRiVaaOCRG','MBxwsrqYLCc3KuB','Wmy5THNTCZ1ZKL8','1vBfxVIDHYSrppc','TR1V7JFvrR9U2xj','KXYtxIpE3LPD59Z','d2IYELGMp9a2iOf','0YbQTQrCwuSSOuB','F997geMJ8w876QN'].map((e,i)=>{return{title:e,id:`${i}`}});

interface AutocompleteInput extends React.ComponentPropsWithoutRef<"ul">{
  
}
interface ListItem extends React.ComponentPropsWithoutRef<"li">{
  title:string,
  id:string
}
function ListItem(props:ListItem) : JSX.Element{

  return (
    <TouchableHighlight style={s.addressRow}>
      <Text style={s.addressText}>{props.title}</Text>
    </TouchableHighlight>
  )
}
function List(props:React.ComponentPropsWithRef<'view'>&{predictions:any[]}):JSX.Element{
  const {predictions} = props;
  const itens = predictions.map((e)=>{return {title:e.description,id:e.place_id}})
  return (
    <View>
    {itens.map(e=><ListItem title={e.title} id={e.id} key={e.id}/>)}
    </View>
  )
}
export default function AutocompletInput(props:AutocompleteInput) : JSX.Element {
  const [InputSearch,setSearch]  = React.useState<string>('');
  const [resultSet,setResultSet]  = React.useState<any[]>([]);

  const timer = React.useRef<number>(0);

  function changeFilter(value:string){
    clearTimeout(timer.current);
    setSearch(value);
    timer.current = window.setTimeout(()=>{
      (async()=>{
        try{
          const predictions =  await autocomplete(value);          
          setResultSet(predictions);
        }catch(e){
          console.log(e);
          setResultSet(['Error'])
        }
      })()                 
    },700)
  }
  
  function resultset() : {title:string,id:string}[]{    
    return resultSet.map((e)=>{return {title:e.description,id:e.place_id}})
  }

  /*
  return (
    
    <FlatList     
      style={s.container}
      ListHeaderComponent={<TextInput value={InputSearch} onChangeText={changeFilter}/>}
      ListHeaderComponentStyle={{backgroundColor:colorPalet.white}}
      data={resultset()}
      renderItem={({item})=>ListItem(item)}      
    />
    
    
  )
   */
  return (
    <KeyboardAvoidingView style={s.centralContainer}>
      <TextInput value={InputSearch} onChangeText={changeFilter} style={{width:'100%',textAlign:'center'}}/>      
      <List predictions={resultSet}/>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({  
  addressRow:{
    paddingHorizontal:15,
    paddingVertical:4,
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    fontSize:height*0.02,
    alignSelf:'center'
  },  
  addressText:{
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    fontSize:height*0.022,         
    textAlignVertical:'center'
  },    
  centralContainer:{    
    width:width*0.8,        
    alignItems:'center',
    justifyContent:'center',    
    borderRadius:10,
    marginVertical:height*0.01,
    marginHorizontal:width*0.1,
    backgroundColor:colorPalet.white
  }
})
