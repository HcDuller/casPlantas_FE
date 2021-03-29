import axios, { AxiosResponse, AxiosTransformer } from 'axios'
import {client,isClient} from '../util/util';
import {GeocoderResponse,isGeocoderResponse,GeocoderResult,responseStatus} from '../util/mapTypes'


interface orderQuery{
  minFromDate:Date,
  maxFromDate:Date,
  minDueDate:Date,
  maxDueDate:Date,
  orderNumber:number,
  orderId:string
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
      el.reserves.forEach((res:any)=>{
        res.createdAt = new Date(res.createdAt);
        res.lastUpdate = new Date(res.lastUpdate);
      })
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
export async function ordersPatchRequest(order:order){
	try{
		const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000			
    });    
    const {data} = await worker.patch('/order',{order});    
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
export async function postProductsRequest(product?:product) {
  try{
		const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {};
		if(product){
			params = {product};
		}
		const {data} = await worker.post('/product',params);
		return data
	}catch(e){
		throw e;
	}
}
export async function patchProductsRequest(product?:product) {
  try{
		const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {};
		if(product){
			params = {product};
		}
		const {data} = await worker.patch('/product',params);
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
    }).sort((a,b)=>a.name>b.name ? 1 : -1);    
		return clients
  }catch(e){
    throw e;
  }
}
export async function postClient(newClient:Partial<client>) : Promise<client[]> {
  try{
    const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {};		
    const {data} = await worker.post('/entities',{entity:{...newClient}});
		return data
  }catch(e){
    throw e;
  }
}
export async function patchClient(newClient:Partial<client>) : Promise<client[]> {
  try{
    const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {};		
    const result = await worker.patch('/entities',{entity:{...newClient}});
    const {data} = result    
		return data
  }catch(e){
    throw e;
  }
}
export async function geocoding(input:string):Promise<GeocoderResult[]>{
  try{
    const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {address:input};		
    const {data} = await worker.get('/google/geocoding',{params});        //:{data:GeocoderResponse}     
    //console.log(`Is geocoderResponse? ${isGeocoderResponse(data)}`) && isGeocoderResponse(data)
    if(data.status==="OK" ){            
      const predictions = data.results.map((el:any)=>(el))
      return predictions ? predictions : ['No results were found'];
    }else{  
      console.error(`Google GeocodingApi error:${data.status}`);
      throw new Error(data.status)
    }		
  }catch(e){
    return []
  }  
}
export async function autocomplete(input:string):Promise<any>{
  try{
    const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {input:input};		
    const response : AxiosResponse = await worker.get('/google/autocomplete',{params});        //:{data:GeocoderResponse}     
    
    if(response.data.status === "OK"){
      return response.data.predictions;
    }else{      
      throw new Error('Status is not OK')
    }    
  }catch(e){    
    return []
  }  
}
export async function placeDetails(input:string):Promise<any>{
  try{
    const worker = axios.create({
			baseURL:endPoint,
			headers:globalHeader,
			timeout:1000
		});
		let params = {place_id:input};		
    const response : AxiosResponse = await worker.get('/google/placeDetails',{params});        //:{data:GeocoderResponse}         
    if(response.data.status === "OK"){      
      return response.data;
    }else{      
      throw new Error('Status is not OK')
    }    
  }catch(e){    
    return []
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