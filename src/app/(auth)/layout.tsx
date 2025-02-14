import { Metadata } from 'next'
import {  Toaster } from 'react-hot-toast'


export const metadata: Metadata = {
  title: 'Login | Your App Name',
  description: 'Login to access your account',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-gray-50 via-slate-100/30 to-zinc-50">
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="w-full"> 
        <Toaster position="top-center" />
          {children}
          
        </div>
      </div>
    </main>
  )
}
