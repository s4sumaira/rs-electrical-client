'use client'
import { CheckInOutForm } from './form' 
import { SessionProvider } from 'next-auth/react'

export default function LoginPage() {

return (
 <SessionProvider>
     <CheckInOutForm />
</SessionProvider>
)

}