import { useContext, useState,useEffect } from "react";
import Rupee from "./Rupee";
import { differenceInCalendarDays } from "date-fns"; //to calculate the difference in date//
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from './UserContext';



export default function BookingWidget({place}){

const[checkIn,setCheckIn]=useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setnumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const[email,setEmail]=useState('');
    const [phone, setPhone] = useState('');
const [redirect,setRedirect]=useState('');
    const { user } = useContext(UserContext);

useEffect(()=>{
    if(user){
        setName(user.name);
    }
},[user]);





let numberOfNights=0;
if(checkIn &&checkOut){
    numberOfNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
}

    function multiplyWithCommas(priceString, factor) {
        // Step 1: Convert priceString to a number by removing commas
        const priceWithoutCommas = parseFloat(priceString.replace(/,/g, ''));

        // Step 2: Perform multiplication
        const result = priceWithoutCommas * factor;

        // Step 3: Convert the result back to a string with commas
        const resultWithCommas = result.toLocaleString();

        return resultWithCommas;
    }


    function formatPriceInLakhsAndCrores(price) {
        // Convert the price to a number by removing commas
        const priceWithoutCommas = parseFloat(price.replace(/,/g, ''));

        if (priceWithoutCommas >= 10000000) {
            // If the price is in crores (10,000,000 or more), divide by 10,000,000 (1 crore)
            const priceInCrores = priceWithoutCommas / 10000000;
            const formattedPriceInCrores = priceInCrores.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' Cr';
            return formattedPriceInCrores;
        } else if (priceWithoutCommas >= 100000) {
            // If the price is in lakhs (100,000 or more), divide by 100,000 (1 lakh)
            const priceInLakhs = priceWithoutCommas / 100000;
            const formattedPriceInLakhs = priceInLakhs.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' Lakh';
            return formattedPriceInLakhs;
        } else {
            // For prices less than 100,000, format with commas as thousands separators only
            const formattedPrice = priceWithoutCommas.toLocaleString();
            return formattedPrice;
        }
    }

    

async function bookThisPlace(){
   
       
   
    const response=await axios.post('/bookings', {checkIn, checkOut, numberOfGuests, name,email, phone,
        place: place._id,
        price: formatPriceInLakhsAndCrores(multiplyWithCommas(place.price, numberOfNights)),
    })
    const bookingId=response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
};

if(redirect){
    return <Navigate to={redirect}/>
}



    return(
        <div className='bg-white shadow p-4 rounded-2xl'>
            <div className="text-center">
                <span className="text-lg font-bold ">Price : </span><Rupee/><span className="text-lg font-bold">{place.price} <span className='text-gray-500 font-medium text-base'>/  night</span></span>
            </div>
            <div className="border border-black rounded-2xl mt-4">
                <div className="flex">
                    <div className=" py-3 px-4 ">
                        <label className="font-semibold ">Check-In : </label>
                        <input type="date" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)}  />
                    </div>
                    <div className=" py-3  px-4 border-l border-black">
                        <label className="font-semibold">Check-Out : </label>
                        <input type="date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                    </div>

                </div>
                <div className=" py-3 px-4  border-t border-black">
                    <label className="font-semibold">Number of Guests : </label>
                    <input type="number" value={numberOfGuests} onChange={ev => setnumberOfGuests(ev.target.value)} />
                </div>
{numberOfNights>0 &&(
    <div className="  py-3 px-4  border-t border-black">
                    <label >Your full name: </label>
                            <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Arjun Behra"/>

                        <label >Email: </label>
                        <input type="email" value={email} onChange={ev => setEmail(ev.target.value)} placeholder="yourname@gamil.com" />

                            <label >Phone Number </label>
                            <input type="tel" value={phone} onChange={ev => setPhone(ev.target.value)} placeholder="155688417" />
                        </div>

          
)}
            </div>




            <button onClick={bookThisPlace}className='mt-4 primary'>Book Now
           {numberOfNights>0&&(
                    <span> <Rupee /> {formatPriceInLakhsAndCrores(multiplyWithCommas(place.price, numberOfNights)) }</span>
           )}
            
            </button>
        </div>
        
    )
}