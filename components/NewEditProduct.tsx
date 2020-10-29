import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, ScrollView,BackHandler } from 'react-native';
import CleanHeader from './AuxComponents/CleanHeader';
import NavigationRow from './AuxComponents/NavigationRow';
import ProductOptions from './AuxComponents/ProductOptions';
import ModalOptions from './AuxComponents/ModalOptions';
import { colorPalet, fonts, fontStyle, product, productOptions } from '../util/util';
import { SafeAreaView } from 'react-native-safe-area-context';
import CentralCiclingContainer from './AuxComponents/CentralCiclingContainer';
import { NavigationProp } from '@react-navigation/native';


type selectdProdProps = { selectedClass: number, selectedSubClass: number };
const { width, height } = Dimensions.get('window');
const productClassOptd = [
  ['product', 'Produto'],
  ['accessory', 'Acessorio'],
  ['service', 'Serviço']
]
const productSubClassOptd = [
  ['accessory', 'Acessorio'],
  ['fertilizer', 'Adubo'],
  ['basic', 'Basico'],
  ['cachepot', 'Cachepo'],
  ['consulting', 'Consultoria'],
  ['kokedama', 'Kokedama'],
  ['miniatures', 'Miniaturas'],
  ['plant', 'Planta'],
  ['dish', 'Prato'],
  ['holder', 'Suporte'],
  ['tripod', 'Tripé'],
  ['succulents vase', 'Vaso de Suculenta'],
  ['vase', 'Vaso'],
  ['plant vase', 'Vaso de Planta']
]
type navProp = {
  key: string;
  index: number;
  routeNames: string[];
  history?: unknown[] | undefined;
  routes: (Readonly<{
    key: string;
    name: string;
    params?: object | undefined;
  }>)[];
  type: string;
  stale: false;
}


export default function NewEditProduct(props: {
  navigation: NavigationProp<Record<string, object | undefined>, string, Readonly<navProp>, {}, {}>,
  route: any
}): JSX.Element {
  const tempoProd: Partial<product> & selectdProdProps = {
    name: 'Nome Padrao',
    value: 0,
    class: 'product',
    subClass: 'basic',
    selectedClass: 0,    // base value must be assigned programmatically based on props.route.param.product.class,     when available
    selectedSubClass: 2, // base value must be assigned programmatically based on props.route.param.product.subClass,  when available
    options: [{ name: 'Tamanho', options: ['P', 'M', 'G'] }, { name: 'Tamanho', options: ['PP', 'M', 'GG'] }, { name: 'Tamanho', options: ['XP', 'M', 'XG'] }, { name: 'Tamanho', options: ['P', 'M', 'G'] }, { name: 'Tamanho', options: ['PP', 'M', 'GG'] }, { name: 'Tamanho', options: ['XP', 'M', 'XG'] }, { name: 'Tamanho', options: ['P', 'M', 'G'] }, { name: 'Tamanho', options: ['PP', 'M', 'GG'] }, { name: 'Tamanho', options: ['XP', 'M', 'XG'] }, { name: 'Tamanho', options: ['P', 'M', 'G'] }, { name: 'Tamanho', options: ['PP', 'M', 'GG'] }, { name: 'Tamanho', options: ['XP', 'M', 'XG'] }],
    components: [],
  }
  const [product, setProduct] = React.useState<Partial<product> & selectdProdProps>(tempoProd);
  const [modalStatus, setModalStatus] = React.useState(false);
  const nameRef = React.useRef<TextInput>(null);
  
  const pseudoModalController = ()=>{       
    BackHandler.removeEventListener('hardwareBackPress',pseudoModalController) 
    setModalStatus(false) ;    
    return true;
  }

  function cicleType(increment: number) {
    const maxIndex = productClassOptd.length - 1;
    const newIndex = product.selectedClass + increment;
    let tempProd = { ...product };
    if (newIndex > maxIndex) {
      tempProd.selectedClass = 0;
    } else if (newIndex < 0) {
      tempProd.selectedClass = maxIndex;
    } else {
      tempProd.selectedClass = newIndex
    }
    setProduct(tempProd);
  }
  function cicleSubType(increment: number) {
    const maxIndex = productSubClassOptd.length - 1;
    const newIndex = product.selectedSubClass + increment;
    let tempProd = { ...product };
    if (newIndex > maxIndex) {
      tempProd.selectedSubClass = 0;
    } else if (newIndex < 0) {
      tempProd.selectedSubClass = maxIndex;
    } else {
      tempProd.selectedSubClass = newIndex
    }
    setProduct(tempProd);
  }
  function valueIncrement(increment: number) {
    const previousValue = product.value ? product.value : 0;
    const tempProd = { ...product, value: previousValue + increment };
    setProduct(tempProd);
  }
  function valueChange(newValue: number) {
    const tempProd = { ...product, value: newValue };
    setProduct(tempProd);
  }
  function nameChange(text: string) {
    const tempProd = { ...product };
    setProduct({ ...tempProd, name: text });
  }
  function NameInput(props: {
    value: string | undefined,
    onChange: (text: string) => void
  }) {

    const [innerValue, setInnerValue] = React.useState(props.value ? props.value : 'Alterar Nome');
    function onChangeText(text: string) {
      setInnerValue(text);
    }
    return (
      <TextInput
        style={{
          fontFamily: 'AlegreyaSans-Bold',
          fontSize: height * 0.023,
          color: colorPalet.darkGrey,
          textAlign: 'center',
          alignSelf: 'center',
          width: width * 0.7
        }}
        ref={nameRef}
        onChangeText={onChangeText}
        value={innerValue}
        onSubmitEditing={({ nativeEvent: { text } }) => console.log(props.onChange(text))}
      />
    )
  }
  function ValueInput(props: {
    value: number | undefined,
    onChange: (text: number) => void
  }) {

    const [innerValue, setInnerValue] = React.useState<string>(props.value ? padronizeValue(props.value.toString()) : '0.00');
    const l = StyleSheet.create({
      localStyle: {
        fontFamily: 'AlegreyaSans-Bold',
        fontSize: height * 0.023,
        color: colorPalet.darkGrey,
        textAlign: 'center',
        alignSelf: 'center',
        width: width * 0.4,
      }
    })
    function padronizeValue(text: string) {
      const strArray = Array.from(text.replace('R$', '')).filter(el => {
        const blank = el === ' ';
        const comma = el === ',';
        const dot = el === '.';
        return !(blank || comma || dot);
      });  // removeu R$ espacos e pontos
      if (strArray.length > 0) {
        while (strArray[0] === '0') {
          strArray.shift()
        }
      }

      switch (strArray.length) {
        case 0:
          strArray.push('0', '.', '0', '0',);
          break;
        case 1:
          strArray.splice(0, 0, '0', '.', '0');
          break;
        case 2:
          strArray.splice(0, 0, '0', '.');
          break;
        default:
          strArray.splice(strArray.length - 2, 0, '.');
          break;
      }
      const finalValue = strArray.join('');
      return finalValue;
    }
    function onValueChange(text: string) {
      const teste = padronizeValue(text)
      setInnerValue(teste);
    }
    return (
      <TextInput
        style={l.localStyle}
        allowFontScaling={true}
        onChangeText={onValueChange}
        onSubmitEditing={() => { const parsedValue = parseFloat(innerValue); valueChange(parsedValue) }}
        value={'R$ ' + innerValue}
        keyboardType='decimal-pad'
      />
    )
  }
  function modalOptions(){    
    if(!modalStatus){
      BackHandler.addEventListener('hardwareBackPress',pseudoModalController)
      setModalStatus(true)      
    }
  }
  return (

    <SafeAreaView style={{ backgroundColor: colorPalet.grey, minHeight: '100%' }}>
      <ModalOptions visible={modalStatus} />
      <ScrollView>
        <CleanHeader />
        <NavigationRow ohNoPress={() => { props.navigation.goBack() }} goGoPress={() => { }} loading={false} />
        <CentralCiclingContainer
          title='Tipo'
          onLeftPress={() => cicleType(-1)}
          onRightPress={() => cicleType(1)}
          content={productClassOptd[product.selectedClass][1]}
        />
        <CentralCiclingContainer
          title='Sub Tipo'
          onLeftPress={() => cicleSubType(-1)}
          onRightPress={() => cicleSubType(1)}
          content={productSubClassOptd[product.selectedSubClass][1]}
        />
        <CentralCiclingContainer
          title='Nome'
          contentDisposition='center'
          onCenterPress={() => nameRef.current?.focus()}
          content={<NameInput
            onChange={nameChange}
            value={product.name}
          />}
        />
        <CentralCiclingContainer
          title='Valor'
          onLeftPress={() => valueIncrement(-1)}
          onRightPress={() => valueIncrement(1)}
          content={<ValueInput
            value={product.value}
            onChange={() => { }} />}
        />

        <CentralCiclingContainer
          onCenterPress={() => modalOptions()}
          content='Aperte aqui!'
        />
        <ProductOptions
          data={(product.options as productOptions[])}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
//product.value?.toString()
const fontStyleObj = fontStyle(width);

const s = StyleSheet.create({
  ...fontStyleObj
})