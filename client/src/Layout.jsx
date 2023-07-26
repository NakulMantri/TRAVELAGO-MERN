import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout(){
    return(
        <div className=' py-4 px-8 flex flex-col min-h-screen'>
            <Header/>
            <main className="flex-grow mt-auto">
                <Outlet />
            </main>
            
           <Footer />
           
        </div>
    )
}