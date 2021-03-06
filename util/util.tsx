import React from 'react';
import { NavigationProp,RouteProp,Route} from '@react-navigation/native';

type productClass       = 'product'|'accessory'|'service';
type productSubClass    = 'kokedama'|'plant vase'|'succulents vase'|'accessory'|'plant'|'consulting'|'miniatures'|'holder'|'tripod'|'dish'|'basic'|'fertilizer'|'vase'|'cachepot';

export interface ComponentWithNavigationProps extends React.ComponentPropsWithoutRef<"view">{
  navigation: NavigationProp<Record<string, object | undefined>, string, Readonly<navProp>, {}, {}>,
  route: RouteProp<Record<string,object|undefined>,string>,  
}
export type productOptions     = {
  _id?:string,
  name:string,
  active:boolean,
  options:{
    _id?:string,  
    name:string,
    active:boolean,      
  }[]
}
export type navProp = {
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
export interface order {
  _id: string,
  clientId: string,
  creationDate: Date,
  dueDate: Date,
  status: 'New'|'Ready'|'Delivered'|'Canceled',
  orderNumber: number,
  reserves:{ 
    name: string,    
    _id: string,
    quantity: number,
    value: number,
    createdAt: Date,
    lastUpdate: Date,
    orderId: string,    
    productId: string,
    components: product[]}[] | {}[],     
  clientData?: {
    _id: string, 
    address: { 
      addressType : 'Rua' | 'Avenida',
      street:       string,
      number:     number,
      district:     string,
      town?: string,
      state?:    string,
    }, 
    phones: string[],
    doc?:         string,
    instagram?:   string,
    anniversary?: Date,
    since: Date,
    name: string,
    __v: number,
    purpose: 'maintenance'|'sale'|'shopping'
  },
  purpose: 'maintenance'|'sale'|'shopping'
}
export interface product{
  _id: string,
  active: boolean,
  productId: number,
  name: string,
  value: number,
  class: productClass,
  subClass: productSubClass,
  options:productOptions[]  
  components: string[]
}
export interface customDateObj{  
  month:[string,number],
  weekDay:[string,number],
  day:string,
  year:string,
  hour:string,
  minute:string
}
export interface client{
  address: address,
  phones: string[],
  doc: string,
  instagram: string,
  anniversary: Date|string,
  since: Date|string,
  _id: string,
  name: string,
  __v: any
}
export interface address{    
  street: string,
  number: number,
  detail: string,
  district: string,
  town: string,
  state: string,
  place_id: string,
  geometry:{
    lat:number,
    lng:number
  }
}
export interface reserve{
  name: string,
  _id: string,
  quantity: number,
  value: number,
  createdAt: Date,
  lastUpdate: Date,
  orderId: string,
  productId: string,
  availableOpt:productOptions[],
  selectedOpt:{
    _id:string,
    opt_id:string,
    selected_id:string
  }[]
}

export type day      = {date:Date,activeMonth:boolean,orders:order[]|[]}
export type weekLine = day[];
export type calendar = weekLine[];

export function calendarArray(date:Date,events?: order[]) : calendar{
  const firstDay = new Date(date.getFullYear(),date.getMonth(),1);
  const lastDay = new Date(date.getFullYear(),date.getMonth()+1,0);
  const days = [];  
  const fator = (firstDay.getDay()*-1 +1);
  const tempEvents = events ? events : [];

  for(let i = fator; i < 42+fator ;i++){    
    const tempDate = new Date(firstDay.getFullYear(),date.getMonth(),i);        
    const tempOrders = tempEvents?.filter((el:order) => {      
      const year    = el.dueDate.getFullYear()  === tempDate.getFullYear();
      const month   = el.dueDate.getMonth()     === tempDate.getMonth();
      const day     = el.dueDate.getDate()      === tempDate.getDate();
      return  year && month && day;
    });    
    const temp ={
      date: tempDate,
      activeMonth: tempDate.getMonth() === firstDay.getMonth(),
      orders:tempOrders
    }      
    days.push(temp);
  }  
  const result : calendar = [
    days.slice(0,7)   as day[],
    days.slice(7,14)  as day[],
    days.slice(14,21) as day[],
    days.slice(21,28) as day[],
    days.slice(28,35) as day[],
    days.slice(35,42) as day[]
  ]
  return result
}
export const colorPalet= {  
  purple:     '#7b74ad',
  white:      '#ffffff',
  red:        '#af132d',
  green:      '#c7dab0', 
  grey:       '#e7e8e4',
  orange:     '#de9f00',  
  darkGrey:   '#5b5a5d',  
  darkGreen : '#617961',
  darkOrange: '#f8e0cc',  
  reactDefPlaceholder: '#c7c7Cd',
}
export const rgbColorPallet = {
  purple:     'rgb(123,116,173)',
  white:      'rgb(255,255,255)',
  red:        'rgb(175,19,45)',
  green:      'rgb(199,218,176)',  
  grey:       'rgb(231,232,228)',
  orange:     'rgb(222,159,0)',  
  darkGrey:   'rgb(97,121,97)',  
  darkGreen : 'rgb(142,184,120)',
  darkOrange: 'rgb(248,224,204)',
}
export const fonts={
  regular:'AlegreyaSans-Regular',
  bold:   'AlegreyaSans-Bold'
}
export const endpoint = 'http://192.168.15.50:3000';
export function fontStyle(windowHeight:number){
  return {
    title:{
      fontFamily:fonts.bold,
      fontSize:windowHeight*0.022,
      color:colorPalet.darkGrey    
    },
  }
}
export function dateStringFromDate(date:Date) : customDateObj {
  const months  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dtObj : customDateObj = {    
    month:    [months[date.getMonth()],date.getMonth()+1],
    weekDay:  [weekDay[date.getDay()] ,date.getDay()],
    day:      `${date.getDate()}`,
    year:     `${date.getFullYear()}`,    
    hour:     date.getHours()   < 10 ? `0${date.getHours()}`    : `${date.getHours()}`,
    minute:   date.getMinutes() < 10 ? `0${date.getMinutes()}`  : `${date.getMinutes()}`,
  }
  return dtObj
}
export function isClient(client:any) : client is client{
  const conditions : boolean[] = [];
  const existingKeys : string[] = Object.keys(client);
  if(existingKeys.find(el=>el==='address')){
    conditions.push(true);    
    existingKeys.find(el=>el==='addressType') ?  conditions.push(true) : conditions.push(false);
    existingKeys.find(el=>el==='street')      ?  conditions.push(true) : conditions.push(false);
    existingKeys.find(el=>el==='number')      ?  conditions.push(true) : conditions.push(false);
    existingKeys.find(el=>el==='detail')      ?  conditions.push(true) : conditions.push(false);
    existingKeys.find(el=>el==='district')    ?  conditions.push(true) : conditions.push(false);
    existingKeys.find(el=>el==='town')        ?  conditions.push(true) : conditions.push(false);
    existingKeys.find(el=>el==='estate')      ?  conditions.push(true) : conditions.push(false);
  }else{
    conditions.push(false);
  }
  existingKeys.find(el=>el==='phones')     ?  conditions.push(true) : conditions.push(false) ;
  existingKeys.find(el=>el==='doc')        ?  conditions.push(true) : conditions.push(false) ;
  existingKeys.find(el=>el==='instagram')  ?  conditions.push(true) : conditions.push(false) ;
  existingKeys.find(el=>el==='anniversary')?  conditions.push(true) : conditions.push(false) ;
  existingKeys.find(el=>el==='since')      ?  conditions.push(true) : conditions.push(false) ;
  existingKeys.find(el=>el==='_id')        ?  conditions.push(true) : conditions.push(false) ;
  existingKeys.find(el=>el==='name')       ?  conditions.push(true) : conditions.push(false) ;
  return existingKeys.every(el=>el);
}
export function simpleDelay(time:number){
  return new Promise((resolve)=>{return setTimeout(resolve,time)})
}
export function isReserve(reserve:any): reserve is reserve{
  const compiledValidations : boolean[] = [];  
  // dateString matching .match(/[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}.[\d]{3}Z/)
  reserve.hasOwnProperty('name')        ?   compiledValidations.push(typeof reserve.name        === 'string') : compiledValidations.push(false);
  reserve.hasOwnProperty('_id')         ?   compiledValidations.push(typeof reserve._id         === 'string') : compiledValidations.push(false);
  reserve.hasOwnProperty('quantity')    ?   compiledValidations.push(typeof reserve.quantity    === 'number') : compiledValidations.push(false);
  reserve.hasOwnProperty('value')       ?   compiledValidations.push(typeof reserve.value       === 'number') : compiledValidations.push(false);
  reserve.hasOwnProperty('createdAt')   ?   compiledValidations.push(Object.prototype.toString.call(reserve.createdAt)  === '[object Date]' ? true : false) : compiledValidations.push(false);
  reserve.hasOwnProperty('lastUpdate')  ?   compiledValidations.push(Object.prototype.toString.call(reserve.lastUpdate) === '[object Date]' ? true : false) : compiledValidations.push(false);
  reserve.hasOwnProperty('orderId')     ?   compiledValidations.push(typeof reserve.orderId     === 'string') : compiledValidations.push(false);
  reserve.hasOwnProperty('productId')   ?   compiledValidations.push(typeof reserve.productId   === 'string') : compiledValidations.push(false);      
  //console.log(`Validation ${compiledValidations}`);
  return compiledValidations.every(e=>e);
}
export function isOrder(order:any) : order is order{
  const compiledValidations : boolean[] = [];
  order.hasOwnProperty('_id')           ?   compiledValidations.push(typeof order._id === 'string')           : compiledValidations.push(false);
  order.hasOwnProperty('clientId')      ?   compiledValidations.push(typeof order.clientId === 'string')      : compiledValidations.push(false);  
  order.hasOwnProperty('status')        ?   compiledValidations.push(typeof order.status === 'string')        : compiledValidations.push(false);
  order.hasOwnProperty('purpose')       ?   compiledValidations.push(typeof order.purpose === 'string')       : compiledValidations.push(false);
  order.hasOwnProperty('orderNumber')   ?   compiledValidations.push(typeof order.orderNumber === 'number')   : compiledValidations.push(false);

  order.hasOwnProperty('creationDate')  ?   compiledValidations.push(Object.prototype.toString.call(order.creationDate) === '[object Date]')  : compiledValidations.push(false);
  order.hasOwnProperty('dueDate')       ?   compiledValidations.push(Object.prototype.toString.call(order.dueDate)      === '[object Date]')  : compiledValidations.push(false);
  
  //validar clientData
  if(order.hasOwnProperty('clientData')){    
    compiledValidations.push(isClient(order.clientData));
  }else{
    compiledValidations.push(false)
  }
  
  //validar reserves
  if(order.hasOwnProperty('reserves')){
    try{
      compiledValidations.push(order.reserves.every(isReserve));
    }catch(e){
      compiledValidations.push(false);
    }
  }else{
    compiledValidations.push(false);
  }    
  //console.log(`Validation ${compiledValidations}`);
  return compiledValidations.every(e=>e);
   
}