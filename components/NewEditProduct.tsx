import React from 'react';
import { TextInput, StyleSheet, Dimensions, ScrollView,BackHandler } from 'react-native';
import CleanHeader from './AuxComponents/CleanHeader';
import NavigationRow from './AuxComponents/NavigationRow';
import ProductOptions from './AuxComponents/ProductOptions';
import ModalOptions from './AuxComponents/ModalOptions';
import { colorPalet, fonts, fontStyle, product, productOptions } from '../util/util';
import {postProductsRequest,patchProductsRequest} from '../util/requests';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from './AuxComponents/ProgressBar';
import CentralCiclingContainer from './AuxComponents/CentralCiclingContainer';
import { NavigationProp} from '@react-navigation/native';
import MaskedTextInput from './AuxComponents/MaskedTextInput'


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
const defaultNewProduct : Partial<product> & selectdProdProps = {
  name: 'Nome Padrao',
  value: 0,
  class: 'product',
  subClass: 'basic',
  selectedClass: 0,    // base value must be assigned programmatically based on props.route.param.product.class,     when available
  selectedSubClass: 2, // base value must be assigned programmatically based on props.route.param.product.subClass,  when available
  options: [
    {
      name:'tamanho',
      active:true,
      options:[
        {
          name:'P',
          active:true            
        },
        {
          name:'M',
          active:true            
        },
        {
          name:'G',
          active:true            
        },
        {
          name:'GG',
          active:true            
        }
      ]
    }
  ],
  components: [],
}
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
interface NewEditProductProps extends React.ComponentPropsWithRef<"view">{
  navigation: NavigationProp<Record<string, object | undefined>, string, Readonly<navProp>, {}, {}>,
  route: any,  
}
function parseProduct(product:product) : Partial<product> & selectdProdProps {
  const classNumber     = productClassOptd.findIndex(el=>el[0].toLowerCase()===product.class.toLowerCase());
  const subClassNumber  = productSubClassOptd.findIndex(el=>el[0].toLowerCase()===product.subClass.toLowerCase());
  const parsedProd : Partial<product> & selectdProdProps = {
    selectedClass : classNumber > -1 ? classNumber : 0,
    selectedSubClass  : subClassNumber > -1 ? subClassNumber : 0,
    ...product
  }
  return parsedProd;
}
export default function NewEditProduct(props: NewEditProductProps): JSX.Element {
  
  const parsedProd : (Partial<product> & selectdProdProps) | boolean = props?.route?.params?.product ? parseProduct(props.route.params.product) : false;

  const tempProd: Partial<product> & selectdProdProps = parsedProd ? parsedProd : defaultNewProduct;  
  const [product, setProduct] = React.useState<Partial<product> & selectdProdProps>(tempProd);  
  const [prodOpt,setProdOpt]  = React.useState<productOptions | undefined>(undefined);
  const [loading,setLoading]  = React.useState<boolean>(false);
  const [modalStatus, setModalStatus] = React.useState(false);
  const nameRef = React.useRef<TextInput>(null);
  
  const pseudoModalController = ()=>{       
    BackHandler.removeEventListener('hardwareBackPress',pseudoModalController) 
    setModalStatus(false) ;    
    return true;
  }
  async function saveProduct(){
    try{      
      if(parsedProd){ //parsedProd is either a product os a false(boolean)
        const response = await patchProductsRequest(product);        
      }else{
        const response = await postProductsRequest(product);
      }            
      props.navigation.goBack();
    }catch(e){      
      setLoading(false);
      alert('Erro ao salvar produto');
    }
  }
  function cicleType(increment: number) {
    const maxIndex = productClassOptd.length - 1;
    const newIndex = product.selectedClass + increment;
    let tempProd = { ...product };
    if (newIndex > maxIndex) {
      tempProd.selectedClass = 0;
      tempProd.class  = (productClassOptd[0][0] as typeof product.class);
    } else if (newIndex < 0) {
      tempProd.selectedClass = maxIndex;
      tempProd.class  = (productClassOptd[maxIndex][0] as typeof product.class);
    } else {
      tempProd.selectedClass = newIndex;
      tempProd.class  = (productClassOptd[newIndex][0] as typeof product.class);
    }
    setProduct(tempProd);
  }
  function cicleSubType(increment: number) {
    const maxIndex = productSubClassOptd.length - 1;
    const newIndex = product.selectedSubClass + increment;
    let tempProd = { ...product };
    if (newIndex > maxIndex) {
      tempProd.selectedSubClass = 0;
      tempProd.subClass = (productSubClassOptd[0][0] as typeof product.subClass);
    } else if (newIndex < 0) {
      tempProd.selectedSubClass = maxIndex;
      tempProd.subClass = (productSubClassOptd[maxIndex][0] as typeof product.subClass);
    } else {
      tempProd.selectedSubClass = newIndex;
      tempProd.subClass = (productSubClassOptd[newIndex][0] as typeof product.subClass);
    }
    setProduct(tempProd);
  } 
  function valueChange(newValue: string) {    
    const tempProd = { ...product };
    tempProd.value =Number.parseFloat(newValue);
    setProduct(tempProd);
  }
  function nameChange(text: string) {
    const tempProd  = { ...product };    
    tempProd.name   = text;
    setProduct(tempProd);
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
        onSubmitEditing={({ nativeEvent: { text } })=>props.onChange(text)}
        onBlur={()=>props.onChange(innerValue)}
      />
    )
  }
  
  function optionActivator(index:number,newActiveState:boolean){
    const tempProd = {...product};    
    if(tempProd.options){
      tempProd.options[index].active = newActiveState
    }
    setProduct(tempProd);
  }
  function newOptionHandler(newOption:productOptions):void{
    const tempOpt = {...product};
    if(tempOpt.options){      
      const actualIndex = tempOpt.options.findIndex(el=>el.name.toLowerCase().trim()===newOption.name.toLowerCase().trim());
      if(actualIndex < 0){
        tempOpt.options.push(newOption);
      }else{
        tempOpt.options.splice(actualIndex,1,newOption);        
      }      
    }
    setModalStatus(false);
    setProduct(tempOpt);
  }
  function deleteOption(_id:string){
    const tempProd = { ...product};
    tempProd.options = tempProd.options?.filter(el=>el?._id !== _id);
    setProduct(tempProd)
  }
  function modalOptionsHandler(option?:productOptions){    
    if(!modalStatus){
      BackHandler.addEventListener('hardwareBackPress',pseudoModalController);      
      setModalStatus(true);
      setProdOpt(option);
    }
  }    
  //simpleDelay
  //{loading?(<ProgressBar width={width} height={height*0.005} color={colorPalet.darkGreen} duration={2000}/>):undefined}
  return (
    <SafeAreaView style={{ backgroundColor: colorPalet.grey, minHeight: '100%' }}>
      <ModalOptions 
        option={prodOpt}
        visible={modalStatus}         
        gogoAction={newOptionHandler}
        goBack={()=>setModalStatus(false)}
        onDeleteAction={deleteOption}
        key={prodOpt? `modal-edit-${prodOpt.name}` : 'newOptionModal'}
      />      
      <ScrollView>
        <CleanHeader />
        <NavigationRow ohNoPress={() => { props.navigation.goBack() }} goGoPress={saveProduct} loading={false} />
        <CentralCiclingContainer        
          onLeftPress={() => cicleType(-1)}
          onRightPress={() => cicleType(1)}
          content={productClassOptd[product.selectedClass][1]}
        />
        <CentralCiclingContainer          
          onLeftPress={() => cicleSubType(-1)}
          onRightPress={() => cicleSubType(1)}
          content={productSubClassOptd[product.selectedSubClass][1]}
        />
        <CentralCiclingContainer
          contentDisposition='center'
          onCenterPress={() => nameRef.current?.focus()}
          content={<NameInput
            onChange={nameChange}
            value={product.name}
          />}
        />
        <CentralCiclingContainer         
          content={
            <MaskedTextInput mask='currency' value={product.value ? product.value.toString() : '0'} hocUpdater={valueChange} placeholder='R$ 99.99' style={{...s.textInput,...s.filledInput}}/>
          }
        />        
        <ProductOptions
          data={(product.options as productOptions[])}
          onNewOrEdit={modalOptionsHandler}          
          onActiveChange={optionActivator}        
          key={`featureList-${product.options?.length}`}  
        />        
      </ScrollView>
    </SafeAreaView>
  )
}

//product.value?.toString()
const fontStyleObj = fontStyle(width);

const s = StyleSheet.create({
  title:{
    fontFamily:fonts.bold,
    fontSize:height*0.022,
    color:colorPalet.darkGrey    
  }, 
  textInput:{    
    fontSize: height * 0.023,
    color: colorPalet.darkGrey,
    textAlign: 'center',
    alignSelf: 'center',
    width: width * 0.7
  },
  filledInput:{
    fontFamily:fonts.bold
  },
  emptyInput:{
    fontFamily:fonts.regular
  }
})
