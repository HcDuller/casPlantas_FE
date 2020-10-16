import axios from 'axios'
import {client,isClient} from '../util/util';


interface orderQuery{
  minFromDate:Date,
  maxFromDate:Date,
  minDueDate:Date,
  maxDueDate:Date,
  orderNumber:number,
  orderId:number
}
interface order{
  creationDate? :Date,
  dueDate?      :Date,
  status?       :string,
  _id?          :string,
  clientId?     :string,
  orderNumber?  :number,
}
interface product{
  active?: boolean,
  class?: string,
  components?: string[],
  _id?: string,
  name?: string,
  value?: number,
  productId?: number  
}
const globalHeader : HeadersInit ={
  'Accept'      : 'application/json',
  'Content-Type': 'application/json'
}

const endPoint = 'http://192.168.15.50:3000'

export async function ordersGetRequest(filters?:Partial<orderQuery>){
  try{    
    const worker = axios.create({
      baseURL:endPoint,
      headers:globalHeader,
      timeout:1000            
    })
    const {data} = await worker.get('/order',{
      params:filters
    });
    data.forEach((el:any)=>{
      el.creationDate = new Date(el.creationDate);
      el.dueDate      = new Date(el.dueDate);
    });      
    return data;   
     
  }catch(e){
    throw(e);    
  }    
}
export async function ordersPostRequest(order:order){
	try{
		const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000			
		});
    const {data} = await worker.post('/order',{order});    
    return data 
	}catch(e){
		throw(e);
	}
}
export async function getProductsRequest(product?:product) {
  try{
		const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {};
		if(product){
			params = {...product};
		}
		const {data} = await worker.get('/product',params);
		return data
	}catch(e){
		throw e;
	}
}
export async function getClients() : Promise<client[]> {
  try{
    const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {};		
    const {data} = await worker.get('/entities');
    const clients : client[] = data.filter((el:any)=>{
      if(isClient(el)){
        return el;
      }
    });
		return clients
  }catch(e){
    throw e;
  }
}
/*
function orderQueryParser(key:string,value:Date|number){
  if(key === 'minFromDate' ||  key === 'maxFromDate' ||  key === 'minDueDate' ||  key === 'maxDueDate'){
    return `${key}=${((value as Date).toISOString()).replace(' ','+')}`
  }else if(key === 'orderNumber' || key === 'orderId'){
    return `${key}=${value.toString().replace(' ','+')}`
  }else{
    throw new Error(`filter parameter ${key} is invalid`);
  }  
}
----------------------------------------------------getOrders-init
    let url = endPoint;
    url+='/order';    
    if(filters){
      url+='?'
      Object.entries(filters).forEach((entrie:[string,any],index:number,origin : Array<[string,any]>)=>{
        url+=orderQueryParser(entrie[0],entrie[1]);
        (index+1) < origin.length ? url+='&' : undefined;
      });
    }    
    const localOptions : RequestInit = {
      headers:{
        'Accept'      : 'application/json',
        'Content-Type': 'application/json'
      },method:'GET'
    }    
    
    const response = await (await fetch(url,localOptions)).json();   
    response.forEach((el:any)=>{
      el.creationDate = new Date(el.creationDate);
      el.dueDate      = new Date(el.dueDate);
    });   
----------------------------------------------------getOrders-end
*/