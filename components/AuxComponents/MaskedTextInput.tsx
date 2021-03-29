import React from 'react';
import {StyleProp, StyleSheet,TextInput} from 'react-native';
import {colorPalet} from '../../util/util';

type mask = 'cep' | 'phone' | 'currency' | 'none';
interface MaskedTextInputProps extends React.ComponentPropsWithoutRef<'input'> {
  mask: mask,
  value: string,
  hocUpdater:(a:string)=>void
}
// cep        99999-999
// phone      (dd) 9999-9999 / (99) 99999-9999
// currency   R$ 40.00
function cepMask(s:string):string{
  let nS :string  = '';
  nS  = s.replace(/[^\d]*/g,'');
  nS  = nS.replace(/(\d)(\d{3})$/g,'$1-$2');
  return nS;
}
function phoneMask(s:string):string{
  let nS = ''
  nS  = s.replace(/[^\d]*/g,'');
  nS  = nS.replace(/^(\d{2})/g,'($1');
  nS  = nS.replace(/^(\(\d{2})(\d+)/g,'$1) $2');
  nS  = nS.replace(/^(\(\d{2}\)) (\d*)?(\d{4})$/g,'$1 $2-$3');  
  return nS;
}
function currencyMask(s:string):string{
  let nS : string = '';  
  nS  = s.replace(/[^\d]*/g,'');
  if(nS){
    nS  = Number.parseInt(nS).toString();
    if(nS === 'NaN'){throw new Error('NaN from string!')}
    nS  = nS.replace(/([\d]*)([\d]{2})$/,'$1.$2')
  }else{
    nS = '0.00';
  }  
  return 'R$ '+nS;
}

export default function MaskedTextInput(props:MaskedTextInputProps) : JSX.Element {  
  const [innerValue,setInnerValue] = React.useState('')
  const hocProps : Partial<MaskedTextInputProps> = {...props};
  delete hocProps.mask
  let maxLength = 50;
  const maskFunction : (s:string)=>string = (()=>{    
    switch(props.mask){
      case  'cep':        
        maxLength = 9;
        return cepMask;     
      case  'phone':
        maxLength = 15;
        return phoneMask;    
      case  'currency':
        maxLength = 15;
        return currencyMask;        
      default:
        return (s:string)=>s
    }
  })();
  const updaterFunction : (a:string)=>void = (()=>{
    switch(props.mask){
      case  'cep':        
        return (s:string)=>{          
          props.hocUpdater(s.replace(/[^\d]*/g,''))
        };     
      case  'phone':
        return (s:string)=>{
          props.hocUpdater(s.replace(/[^\d]*/g,''))
        };    
      case  'currency':
        return (s:string)=>{                    
          props.hocUpdater(s.replace(/[^\d]*/g,'').replace(/([\d]*)([\d]{2})$/,'$1.$2'))
        };        
      default:        
        return (s:string)=>{                    
          props.hocUpdater(s)
        };     
    }    
  })();
  const keeper = (s:string)=>{
    try{
      const newS = maskFunction(s);
      setInnerValue(newS);      
    }catch(e){
      //do nothing =)
    }    
  };
  React.useEffect(()=>{
    setInnerValue(maskFunction(props.value));
  },[]);

  // @ts-ignore
  const localStyles : StyleProp<TextInput> = props.style ? {...props.style,marginVertical:10} : {marginVertical:10}  
  return (
    <TextInput {...hocProps} 
      value={innerValue} 
      onChangeText={keeper} 
      // @ts-ignore
      style={localStyles} 
      maxLength={maxLength} 
      onEndEditing={()=>{updaterFunction(innerValue)}}
      onSubmitEditing={({nativeEvent: {text}})=>updaterFunction(text)}
      />
    )
}

const s = StyleSheet.create({

})