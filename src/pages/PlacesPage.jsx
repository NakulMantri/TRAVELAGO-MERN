import { Link, useParams } from "react-router-dom";
import AccounNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import Rupee from "../Rupee";
import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
    const { action } = useParams();
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
        });
    }, []);

    return (
        <div>
            <AccounNav />

            <div className='text-center'>
                <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full mb-8 ' to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    Add new place
                </Link>
            </div>

            <div className='mt-4'>
                {places.length > 0 && places.map((place) => (
                    <Link key={place._id} to={'/account/places/' + place._id} className=' flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl'>
                        <div className='flex w-32 h-32 bg-gray-300 shrink-0'>
                          <PlaceImg place={place}/>
                        </div>
                        <div className='grow-0 shrink'>
                            <h2 className='text-xl font-extrabold'>{place.title}</h2>
                            <div className='flex  items-center'>
                            
                              
                                <Rupee /><span className='text-lg font-bold'>{place.price}
                                <span className='text-gray-400 font-medium text-sm'>/night</span></span></div>
                                
                                
                              
                            <p className='text-sm mt-2'>{place.description}</p>
                          
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
