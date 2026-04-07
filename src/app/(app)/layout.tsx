

import Navbar from "@/components/Navbar";
import  Provider  from "@/app/Provider";

interface RootLayoutProps{
    children : React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Provider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </Provider>
  );
}
