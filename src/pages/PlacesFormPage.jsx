import { useState,useEffect } from "react";
import PhotoUploader from "../PhotosUploader";
import Perks from "../Perks";
import axios from "axios";
import AccounNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";



export default function PlacesFormPage(){
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);

    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState('');
    const [extra, setExtra] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setmaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price,setPrice]=useState('');


useEffect(()=>{
if(!id){
    return;
}
axios.get('/places/'+id).then(response=>{
    const {data}=response;
    setTitle(data.title);
    setAddress(data.address);
    setAddedPhotos(data.photos);
    setDescription(data.description);
    setPerks(data.perks);
    setExtra(data.extra);
    setCheckIn(data.checkIn);
    setCheckOut(data.checkOut);
    setmaxGuests(data.maxGuests);
    setPrice(data.price);
});
},[id])


    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4 font-semibold">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className='text-gray-500 text-sm'>{text}</p>
        )
    }



    function preInput(header, description) {
        return (

            <>
                {inputHeader(header)}
                {inputDescription(description)}


            </>
        )
    }
    async function savePlace(ev) {
        ev.preventDefault();
        const placeData={
            title, address, description, addedPhotos, perks, extra, checkIn, checkOut, maxGuests,price,
        }
if(id)
{
    //update
    await axios.put('/places', {
        id,
       ...placeData
    });
    setRedirect(true);

}
else {//new place
    await axios.post('/places',placeData )
        
    setRedirect(true);
    }
}

        
if(redirect)
{
    return <Navigate to={'/account/places'}/>
}
    


    return(
     

        <div>
            <AccounNav/>
            
            <form onSubmit={savePlace}>
            {preInput('Title', 'Title for your place should be significant and good for advertising,so keep it concise and flashy!')}
            <input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} placeholder="Title,eg:My lovely appt." />

            {preInput('Address', 'Address to your place!')}
            <input type="text" value={address} onChange={(ev) => setAddress(ev.target.value)} placeholder="Address" />





            {preInput('Description', 'Add description of your place')}
            <textarea value={description} onChange={(ev) => setDescription(ev.target.value)} />

            {preInput('Perks', 'Select all the perks for your place:')}

            <Perks selected={perks} onChange={setPerks} />


            {preInput('Photos', 'Photos make it possible for the users to reach easily!')}
            <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

            {preInput('Extra Info', 'House Rules,etc..')}
            <textarea value={extra} onChange={(ev) => setExtra(ev.target.value)} />
            {preInput('Check-In&Out time and Price per night', 'Add check in and out time and remember to have a time window for cleaning and glorification purpose and to check the capacity of guests.Add a suitable price per night for your place.')}

            <div className='grid gap-2 sm:grid-cols-3 md:grid-cols-4'>
                <div><h3 className='mt-2 mb-1'>Check-in time</h3>
                    <input type="text" value={checkIn} onChange={(ev) => setCheckIn(ev.target.value)} placeholder="14:00" />
                </div>
                <div>
                    <h3 className='mt-2 mb-1'>Check-out time</h3>
                    <input type="text" value={checkOut}

                        onChange={(ev) => setCheckOut(ev.target.value)}

                        placeholder="12:00" />
                </div>
                <div>
                    <h3 className='mt-2 mb-1'>Max guests</h3>
                    <input type="number" value={maxGuests}

                        onChange={(ev) => setmaxGuests(ev.target.value)}
                        placeholder="Maybe 2-4" />
                </div>
                    <div>
                        <h3 className='mt-2 mb-1'>Price per night</h3>
                        <input type="text" value={price}

                            onChange={(ev) => setPrice(ev.target.value)}
                            placeholder="2,000" />
                    </div>
            </div>
            <div>
                <button className='primary my-4'>Save</button>
            </div>
        </form></div>
    )
}

