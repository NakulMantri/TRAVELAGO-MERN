import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccounNav from "../AccountNav";

export default function ProfilePage(){
const[redirect,setRedirect]=useState(null);
const{ready,user,setUser}=useContext(UserContext);

    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

async function Logout(){
   await axios.post('/logout');
   
   setRedirect('/');
    setUser(null);

}



if(!ready){
    return 'Loading...'; //to keep the user on the page but say that page is loading because of slow network.//
}

if(ready && !user && !redirect){
    return <Navigate to={'/login'}/>
}







if(redirect){
    return <Navigate to={redirect}/>
}


    return (
        <div>
            <AccounNav/>
            
            {subpage === 'profile'&&(
                <div className='mt-8 text-center font-semibold max-w-lg mx-auto bg-slate-400 rounded-2xl py-8 px-16 shadow-xl'>
                    <div className=" flex gap-2 justify-center mb-2 text-2xl font-bold"> 
                    
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>

                    
                    
                    
                    {user.name} </div>  
                   Guest<br/>
<button onClick={Logout} className="primary max-w-sm mt-4 shadow-xl ">Logout</button>

                </div>
            )}
            {subpage==='places'&&(
                <PlacesPage/>
            )}            </div>
    )
}