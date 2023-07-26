import { useEffect, useState } from "react";
import axios from "axios";
import Rupee from "../Rupee";
import { Link } from "react-router-dom";
export default function IndexPage()
{
   const[places,setPlaces]=useState([]);
   useEffect(()=>{

   axios.get('/places').then(response=>{
       setPlaces(response.data);
   })
   },[]);
   
    return(
        <div className="mt-8 grid gap-x-4 gap-y-9 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
         {places.length>0 && places.map(place=>(
            <Link to={'/place/'+place._id}>
                 <div className='bg-gray-500 rounded-2xl flex mb-2'>
                 {place.photos?.[0]&&(
                     <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+place.photos?.[0]} alt=""/>
                 )}
                </div>
                 <h2 className="font-bold ">{place.address}</h2>
                 <h3 className="text-sm text-gray-500">{place.title}</h3>
                 
                

                 <div className='mt-1 flex  items-center'>


                     <Rupee /><span className='text-medium font-bold'>{place.price}
                         <span className='text-gray-400 font-medium text-sm'>/night</span></span></div></Link>

         ))}      
        </div>
    );
}