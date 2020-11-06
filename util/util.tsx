type productClass       = 'product'|'accessory'|'service';
type productSubClass    = 'kokedama'|'plant vase'|'succulents vase'|'accessory'|'plant'|'consulting'|'miniatures'|'holder'|'tripod'|'dish'|'basic'|'fertilizer'|'vase'|'cachepot';

export type productOptions     = {
  name:string,
  active:boolean,
  options:{
    _id?:string,  
    name:string,
    active:boolean,      
  }[]
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
    orderId: Date,    
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
      estate?:    string,
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
  address: {
    addressType: string
    street: string,
    number: number,
    detail: string,
    district: string,
    town: string,
    estate: string
  },
  phones: string[],
  doc: string,
  instagram: string,
  anniversary: Date,
  since: Date,
  _id: string,
  name: string,
  __v: any
}

export type day      = {date:Date,activeMonth:boolean,orders:order[]|[]}
export type weekLine = day[];
export type calendar = weekLine[];

export function calendarArray(date:Date,events?: order[]) : calendar{
  const firstDay = new Date(date.getFullYear(),date.getMonth(),1);
  const lastDay = new Date(date.getFullYear(),date.getMonth()+1,0);
  const days = [];  
  const fator = (firstDay.getDay()*-1 +1);
  
  for(let i = fator; i < 41 ;i++){    
    const tempDate = new Date(firstDay.getFullYear(),date.getMonth(),i);    
    const tempEvents = events ? events : [];
    const tempOrders = tempEvents?.filter((el:order) => {      
      const year    = el.dueDate.getFullYear()  === tempDate.getFullYear();
      const month   = el.dueDate.getMonth()     === tempDate.getMonth();
      const day     = el.dueDate.getDate()      === tempDate.getDate();
      return  year && month && day;
    })    
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
  grey:       '#edeef0',
  orange:     '#de9f00',  
  darkGrey:   '#5b5a5d',  
  darkGreen : '#8eb878',
  darkOrange: '#f8e0cc',  
}
export const rgbColorPallet = {
  purple:     'rgb(123,116,173)',
  white:      'rgb(255,255,255)',
  red:        'rgb(175,19,45)',
  green:      'rgb(199,218,176)',  
  grey:       'rgb(237,238,240)',
  orange:     'rgb(222,159,0)',  
  darkGrey:   'rgb(91,90,93)',  
  darkGreen : 'rgb(142,184,120)',
  darkOrange: 'rgb(248,224,204)',
}
export const fonts={
  regular:'AlegreyaSans-Regular',
  bold:'AlegreyaSans-Bold'
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