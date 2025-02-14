import { useSession, signIn, signOut } from "next-auth/react"
//import { useRouter } from "next/router"

export const useAuth = ()=> {
  const { data: session, status } = useSession()
 // const router = useRouter()


  const login = async (email: string, password: string) => {
   
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    

    if (result?.error) {
      //throw new Error(result.error)
      
     return {false:false, error:result.error}
    }

    if (result?.ok) {
     // router.push('/contacts')

     return {success:true}
    }
    
  }

  const logout = () => {
    signOut({ redirect: false })
    //router.push('/login')
  }

  const hasPermission = (permission: string) => {
    return session?.user?.permissions.includes(permission) ?? false
  }

  const hasRole = (role: string) => {
    return session?.user?.role === role
  }

  return {
    user: session?.user,
    accessToken: session?.accessToken as string | undefined,
    loading: status === "loading",
    login,
    logout,
    hasPermission,
    hasRole
  }
}

