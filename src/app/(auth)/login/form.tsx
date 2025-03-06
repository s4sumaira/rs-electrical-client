'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  })

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {

    try {
      setIsLoading(true)
     
      const result = await login(data.email, data.password)
   

      if (!result?.success) {
        toast.error(result?.error as string || "Failed to login")
        setIsLoading(false)
        return
      }

      if (result?.success) {

        //console.log('user',user);

        //if (user?.role==='USER')
        //router.push('/inductions')
        

        router.push('/contacts')

        router.refresh()
        setIsLoading(false)

      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)

    } finally {
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  via-gray-100 to-gray-200">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-600">Username</Label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="pl-10 py-3 focus:ring-offset-0 outline-none w-full bg-transparent border-b-2 border-gray-300 focus:border-orange-500 focus:ring-0
                           placeholder:text-gray-400 text-gray-800"
                  placeholder="Type your username"
                  disabled={isLoading}
                />
                <User className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-600">Password</Label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="pl-10 py-3 w-full focus:ring-offset-0 outline-none bg-transparent border-b-2 border-gray-300 focus:border-orange-500 focus:ring-0
                           placeholder:text-gray-400 text-gray-800"
                  placeholder="Type your password"
                  disabled={isLoading}
                />
                <Lock className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-gray-500 hover:text-orange-500">
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-btn-add hover:bg-btn-add-hover text-btn-add-fg
                       text-white font-medium transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </Button>

            {/* <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or Sign Up Using</span>
              </div>
            </div> */}

            {/* <div className="flex justify-center space-x-4">
              <button className="p-2 rounded-full bg-[#3b5998] text-white hover:bg-opacity-90 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-[#1da1f2] text-white hover:bg-opacity-90 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-[#db4437] text-white hover:bg-opacity-90 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
                </svg>
              </button>
            </div> */}

           
          </form>
        </div>
      </div>
    </div>
  )
}