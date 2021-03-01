//https://developers.google.com/maps/documentation/javascript/reference/geocoder?hl=pt#GeocoderRequest
type 	LatLng								=	[lat:number,lng:number];
type	LatLngLiteral					=	[lat:number,lng:number];
type	LatLngBounds					=	[sw:LatLng|LatLngLiteral,ne:LatLng|LatLngLiteral];
type  LatLngBoundsLiteral  	=	[east:number,north:number,south:number,west:number];
type	GeocoderLocationType	=	"ROOFTOP"|"RANGE_INTERPOLATED"|"GEOMETRIC_CENTER"|"APPROXIMATE";
type 	pluscode	=	{global_code:string,compound_code:string};
type 	types =	'street_address'|'route'|'intersection'|'political'|'country'|'administrative_area_level_1'|'administrative_area_level_2'|'administrative_area_level_3'|'administrative_area_level_4'|'administrative_area_level_5'|'colloquial_area'|'locality'|'sublocality'|'neighborhood'|'premise'|'subpremise'|'plus_code'|'postal_code'|'natural_feature'|'airport'|'park'|'point_of_interest';
type 	addressComponentType	=	'accounting'|'airport'|'amusement_park'|'aquarium'|'art_gallery'|'atm'|'bakery'|'bank'|'bar'|'beauty_salon'|'bicycle_store'|'book_store'|'bowling_alley'|'bus_station'|'cafe'|'campground'|'car_dealer'|'car_rental'|'car_repair'|'car_wash'|'casino'|'cemetery'|'church'|'city_hall'|'clothing_store'|'convenience_store'|'courthouse'|'dentist'|'department_store'|'doctor'|'drugstore'|'electrician'|'electronics_store'|'embassy'|'fire_station'|'florist'|'funeral_home'|'furniture_store'|'gas_station'|'gym'|'hair_care'|'hardware_store'|'hindu_temple'|'home_goods_store'|'hospital'|'insurance_agency'|'jewelry_store'|'laundry'|'lawyer'|'library'|'light_rail_station'|'liquor_store'|'local_government_office'|'locksmith'|'lodging'|'meal_delivery'|'meal_takeaway'|'mosque'|'movie_rental'|'movie_theater'|'moving_company'|'museum'|'night_club'|'painter'|'park'|'parking'|'pet_store'|'pharmacy'|'physiotherapist'|'plumber'|'police'|'post_office'|'primary_school'|'real_estate_agency'|'restaurant'|'roofing_contractor'|'rv_park'|'school'|'secondary_school'|'shoe_store'|'shopping_mall'|'spa'|'stadium'|'storage'|'store'|'subway_station'|'supermarket'|'synagogue'|'taxi_stand'|'tourist_attraction'|'train_station'|'transit_station'|'travel_agency'|'university'|'veterinary_care'|'zoo'|'administrative_area_level_1'|'administrative_area_level_2'|'administrative_area_level_3'|'administrative_area_level_4'|'administrative_area_level_5'|'archipelago'|'colloquial_area'|'continent'|'country'|'establishment'|'finance'|'floor'|'food'|'general_contractor'|'geocode'|'health'|'intersection'|'landmark'|'locality'|'natural_feature'|'neighborhood'|'place_of_worship'|'plus_code'|'point_of_interest'|'political'|'post_box'|'postal_code'|'postal_code_prefix'|'postal_code_suffix'|'postal_town'|'premise'|'room'|'route'|'street_address'|'street_number'|'sublocality'|'sublocality_level_1'|'sublocality_level_2'|'sublocality_level_3'|'sublocality_level_4'|'sublocality_level_5'|'subpremise'|'town_square';
export type	responseStatus	=	"OK"|"ZERO_RESULTS"|"OVER_QUERY_LIMIT"|"REQUEST_DENIED"|"INVALID_REQUEST"|"UNKNOWN_ERROR"|"ERROR";
type	GeocoderComponentRestrictions	=	{
	administrativeArea: string,
	country:						string,
	locality:						string,
	postalCode:					string,
	route:							string
}
export type GeocoderResult = {
	types: 								types[],
	formatted_address: 		string,	
	partial_match: 				boolean,
	place_id: 						string,	
	postcode_localities?:	string[],
	pluscode?:						pluscode,
	address_components: {
		short_name: 					string,
		long_name: 						string,
		postcode_localities: 	string[],
		types: 								addressComponentType[]
	}[],
	geometry: {
		location: 			LatLng,
		location_type: 	GeocoderLocationType,
		viewport: 			LatLngBounds,
		bounds: 				LatLngBounds
	}		
}
export interface GeocoderRequest {
	address?: 							string,
	bounds?:								LatLngBounds|LatLngBoundsLiteral,
	componentRestrictions?:	GeocoderComponentRestrictions,
	location?:							LatLng|LatLngLiteral,
	placeId?:								string,
	region?:								string
}
export interface GeocoderResponse{
	results:	GeocoderResult[],
	status:		responseStatus
}
export function isTypes(arg:any):arg is types{
	const acceptableTypes	=	['street_address','route','intersection','political','country','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3','administrative_area_level_4','administrative_area_level_5','colloquial_area','locality','sublocality','neighborhood','premise','subpremise','plus_code','postal_code','natural_feature','airport','park','point_of_interest']
	return typeof arg === 'string' ? acceptableTypes.filter(el=>el===arg).length > 0 : false;
}
export function isAddressComponentType(arg:any):arg is types{
	const acceptableTypes	=	['accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar','beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','cafe','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery','church','city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','drugstore','electrician','electronics_store','embassy','fire_station','florist','funeral_home','furniture_store','gas_station','gym','hair_care','hardware_store','hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','light_rail_station','liquor_store','local_government_office','locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company','museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','plumber','police','post_office','primary_school','real_estate_agency','restaurant','roofing_contractor','rv_park','school','secondary_school','shoe_store','shopping_mall','spa','stadium','storage','store','subway_station','supermarket','synagogue','taxi_stand','tourist_attraction','train_station','transit_station','travel_agency','university','veterinary_care','zoo','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3','administrative_area_level_4','administrative_area_level_5','archipelago','colloquial_area','continent','country','establishment','finance','floor','food','general_contractor','geocode','health','intersection','landmark','locality','natural_feature','neighborhood','place_of_worship','plus_code','point_of_interest','political','post_box','postal_code','postal_code_prefix','postal_code_suffix','postal_town','premise','room','route','street_address','street_number','sublocality','sublocality_level_1','sublocality_level_2','sublocality_level_3','sublocality_level_4','sublocality_level_5','subpremise','town_square'];
	return typeof arg === 'string' ? acceptableTypes.filter(el=>el===arg).length > 0 : false;
}
export function isGeocoderResult(arg:any):arg is GeocoderResult{	
	
	if(typeof arg !== 'object'){
		return false
	}	
	const typeList						=	['street_address','route','intersection','political','country','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3','administrative_area_level_4','administrative_area_level_5','colloquial_area','locality','sublocality','neighborhood','premise','subpremise','plus_code','postal_code','natural_feature','airport','park','point_of_interest'];	
	const types 							=	arg?.types.every((e:string)=>typeList.findIndex(el=>e===el)>-1) ? true : false;	
	const formatted_address 	=	arg?.formatted_address ? true : false;			
	const address_components 	= arg?.address_components.every((e:any)=>typeof e === 'object');			
	const geometry						= arg?.geometry.location && arg.geometry.location_type && arg.geometry.viewport && arg.geometry.bounds;				
	console.log(`types : ${types}`)		
	console.log(`formatted_address : ${formatted_address}`)		
	console.log(`address_components : ${address_components}`)		
	console.log(`geometry : ${geometry}`)			
	return types && formatted_address && address_components && geometry;
}
export function isResponseStatus(arg:string){
	const acceptableStatus	=	["OK","ZERO_RESULTS","OVER_QUERY_LIMIT","REQUEST_DENIED","INVALID_REQUEST","UNKNOWN_ERROR","ERROR"];
	return acceptableStatus.filter(el=>el===arg).length > 0;
}
export function isLatLngBounds(arg:any): arg is LatLngBounds{
	const length 	= arg.length === 2;
	const lat			=	typeof arg[0] === 'number';
	const lng			=	typeof arg[1] === 'number';
	return length && lat && lng;
}
export function isLatLng(arg:[number,number]): arg is LatLng{
	const fixedLen = arg.length === 2;		
	const lat = (()=>{
		if(typeof arg[0] === 'number'){
			return arg[0] >= -90  && arg[0] <= 90
		}else{
			return false;
		}
	})()
	const lng = (()=>{
		if(typeof arg[1] === 'number'){
			return arg[1] >= -180 &&	arg[1] <= 180
		}else{
			return false;
		}
	})()	
	return fixedLen && lat && lng;
}
export function isGeocoderLocationType(arg:any): arg is GeocoderLocationType{
	return arg === "ROOFTOP" || arg === "RANGE_INTERPOLATED" ||arg === "GEOMETRIC_CENTER" ||arg === "APPROXIMATE";
}
export function isGeocoderResponse(arg:any): arg is GeocoderResponse{
	let 	results 	= arg.results ? Array.isArray(arg.results) 	: false;
	const status		=	typeof arg?.status === 'string'	?	isResponseStatus(arg.status)	:	false;	
	if(results){
		results = arg.results.every((el:any)=>isGeocoderResult(el));
	}	
	return results && status;
}