import React from 'react';
import {StyleSheet,TextInput} from 'react-native';

interface MaskedTextInputProps extends React.ComponentPropsWithoutRef<'input'> {
  mask: 'cep' | 'phone' | 'currency'
}
// cep        99999-999
// phone      (dd) 9999-9999 / (99) 99999-9999
// currency   R$ 40.00
export default function MaskedTextInput(props:MaskedTextInputProps,...rest:any) : JSX.Element {
  return (
    <>
      <TextInput {...rest}/>
    </>
  )
}

const s = StyleSheet.create({

})