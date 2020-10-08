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

const globalHeader : HeadersInit ={
  'Accept'      : 'application/json',
  'Content-Type': 'application/json'
}

const endPoint = 'http://192.168.15.50:3000'

function orderQueryParser(key:string,value:Date|number){
  if(key === 'minFromDate' ||  key === 'maxFromDate' ||  key === 'minDueDate' ||  key === 'maxDueDate'){
    return `${key}=${((value as Date).toISOString()).replace(' ','+')}`
  }else if(key === 'orderNumber' || key === 'orderId'){
    return `${key}=${value.toString().replace(' ','+')}`
  }else{
    throw new Error(`filter parameter ${key} is invalid`);
  }  
}
export async function ordersGetRequest(filters?:Partial<orderQuery>){
  try{    
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
    return response;
  }catch(e){
    throw(e);    
  }    
}
export async function orderPostRequest(type:'new'|'update',order:order){

}