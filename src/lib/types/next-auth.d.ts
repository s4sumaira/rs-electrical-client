// types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: string
    permissions: string[]
    accessToken: string
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      permissions: string[]
    }
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    role: string
    permissions: string[]
    accessToken: string
  }
}