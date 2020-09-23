

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
    productId: string}[] | {}[], 
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
    __v: number
  } 
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
      return el.dueDate.getFullYear()  === tempDate.getFullYear() && el.dueDate.getMonth() === tempDate.getMonth() && el.dueDate.getDate()  === tempDate.getDate();
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
  darkGreen : '#8eb878',
  green:      '#c7dab0',
  darkGrey:   '#5b5a5d',
  grey:       '#edeef0',
  orange:     '#de9f00',
  purple:     '#7b74ad',
  white:      '#ffffff'
}