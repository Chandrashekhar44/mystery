

import Navbar from "@/components/Navbar";
import  Provider  from "@/app/Provider";

interface RootLayoutProps{
    children : React.ReactNode
}


export default  function RootLayout({children} :RootLayoutProps){
   return(
   
     <div className="flex flex-col min-h-screen">
        <Provider>
        <Navbar />
        {children}
        </Provider>
    </div>
  

   )
}