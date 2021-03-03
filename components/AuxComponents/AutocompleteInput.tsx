import React from 'react';
import {} from 'react-native';
import {Dimensions,StyleSheet,Text,View,TextInput,TouchableHighlight,KeyboardAvoidingView} from 'react-native';
import {fonts,colorPalet,address} from '../../util/util';
import {autocomplete,placeDetails} from '../../util/requests'

const {height,width}  = Dimensions.get('window');
const strings = ['MKwcx2gKNVW5yqH','PSGKNW7C3OscXYf','CQ50hAETZom38WP','4GRzyS0QCjC4d84','HuMWDpnCCxr5I8d','FlVQVYVw6n9Ytli','LAagxqkJOlISk7z','oNFkzmc8LGHj97P','1Vyd0YtkM71l8cS','ErBnOHeLccwji04','lwAHqzQHPu9lFeV','h2Y70vdWzhhH9rP','BrMrUVKbcnsJJfr','sTkuixpXjxKndMw','ObtxESLtu76HFJ2','87QYUcgZp3JrouH','GgZaDpHV7gnBfss','fw6LtlDVAaV0QIt','4oP5tF6Qu0S4V75','uK1FTcYTzwcfvG3','7nsHfmrENcemuzz','DLzNN9BNJe82Ima','HBdalBHeIMbzcvv','bSVoMLIIF3Gypwr','eZEf4cqv2oRSKGO','i5iVyNsZHCckPDA','z9wbVwW9i49bO2g','VPiVjLI5tWLIQiT','gfbsemeT4KSRasZ','CGwAM7Ga7u1JZxI','uZP7GQNU5vVyNYz','MLABT7tlJfeF6Hx','mJhLEsKCmb72sFN','PGzuKLnaaHXQwAW','UnRzltER0JH8dEw','D7NwoX50lY645Cs','2ZLQ9agv2BtMwVp','xKgcuOvjOJJkaey','fY37IVVBprtssZS','vsyF8gmQsQGQgUS','I74mDwTE0LKoX1h','LEGKzqRiVaaOCRG','MBxwsrqYLCc3KuB','Wmy5THNTCZ1ZKL8','1vBfxVIDHYSrppc','TR1V7JFvrR9U2xj','KXYtxIpE3LPD59Z','d2IYELGMp9a2iOf','0YbQTQrCwuSSOuB','F997geMJ8w876QN'].map((e,i)=>{return{title:e,id:`${i}`}});

interface AutocompleteInput extends React.ComponentPropsWithoutRef<"ul">{
  hocUpdater:(a:address)=>void,
  address?: address
}

type MergeElementProps<
  T extends React.ElementType,
  P extends object = {}
> = Omit<React.ComponentPropsWithoutRef<T>, keyof P> & P;

interface ListItem extends React.ComponentPropsWithoutRef<"li">{
  title:string,
  id:string,
  hocUpdater?:()=>void
}
function ListItem(props:ListItem) : JSX.Element{

  return (
    <TouchableHighlight style={s.addressRow} underlayColor={colorPalet.green} onPress={props.hocUpdater}>
      <Text style={s.addressPredictionText}>{props.title}</Text>
    </TouchableHighlight>
  )
}
function List(props:React.ComponentPropsWithRef<'view'>&{predictions:any[],hocUpdater:(s:string)=>void}):JSX.Element{
  const {predictions} = props;  
  const itens = predictions.map((e)=>{return {title:e.description,id:e.place_id,hocUpdater:()=>props.hocUpdater(e.structured_formatting.main_text)}})
  return (
    <View>
      {itens.map(e=><ListItem title={e.title} id={e.id} key={e.id} hocUpdater={e.hocUpdater}/>)}
    </View>
  )
}
export default function AutocompletInput(props:AutocompleteInput) : JSX.Element {
  const [InputSearch,setSearch]   = React.useState<string>('');  
  const [resultSet,setResultSet]  = React.useState<any[]>([]);

  const inputRef  = React.useRef<TextInput>(null);

  function replaceSearch(e:string){
    setSearch(e);
    // @ts-ignore 
    inputRef.current.focus();
  }

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
  function submition(s:string){
    (async()=>{
      try{
        const predictions = await autocomplete(s);
        if(predictions.length > 0){
          const {results} = await placeDetails(predictions[0].place_id);
          const placeAddress : address = {
            street:   results[0].address_components.find((e:any)=>e.types.includes("route")).long_name,
            number:   results[0].address_components.find((e:any)=>e.types.includes("street_number")).long_name,            
            district: results[0].address_components.find((e:any)=>e.types.includes("sublocality_level_1")).long_name,
            town:     results[0].address_components.find((e:any)=>e.types.includes("administrative_area_level_2")).long_name,
            state:    results[0].address_components.find((e:any)=>e.types.includes("administrative_area_level_1")).long_name,                           
            geometry: results[0].geometry.location,             
            place_id: predictions[0].place_id,                
            detail:   '',
          }
          props.hocUpdater(placeAddress);
        }        
      }catch(e){
        console.log(e);
      }
    })()
  }
 
  return (
    <KeyboardAvoidingView style={s.centralContainer}>
      <TextInput value={InputSearch} onChangeText={changeFilter} style={s.addressQuery} ref={inputRef} onSubmitEditing={({nativeEvent: {text}})=>{submition(text);setResultSet([])}}/>      
      <List predictions={resultSet} hocUpdater={replaceSearch}/>      
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({  
  addressQuery:{
    fontSize:height*0.022,
    width:'100%',
    textAlign:'center'
  },
  addressRow:{
    paddingHorizontal:15,
    paddingVertical:4,
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    fontSize:height*0.02,    
    alignSelf:'center'
  },  
  addressPredictionText:{
    fontFamily:fonts.regular,
    color:colorPalet.darkGrey,
    fontSize:height*0.022,         
    textAlignVertical:'center'
  },    
  centralContainer:{    
    width:width*0.8,        
    minHeight:height*0.06,
    alignItems:'center',
    justifyContent:'center',    
    borderRadius:10,
    marginVertical:height*0.01,
    marginHorizontal:width*0.1,
    backgroundColor:colorPalet.white
  }
})
