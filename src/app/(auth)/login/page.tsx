'use client'
import { LoginForm } from "./form"
import { SessionProvider } from 'next-auth/react'

export default function LoginPage() {

return (
 <SessionProvider>
     <LoginForm />
</SessionProvider>
)

}