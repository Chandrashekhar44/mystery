import { Inter } from "next/font/google"
import "./globals.css"
import Provider from "./Provider"
import { Toaster } from "../components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
       <head>
        <title>MysteryMessage</title> 
        <link rel="icon" href="/favicon-32x32.png" /> 
        <link rel="apple-touch-icon" href="/favicon.png" /> 
      </head>
      <body className={inter.className}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
