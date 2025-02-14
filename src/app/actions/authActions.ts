'use server'
import { signIn, signOut } from 'next-auth/react';
import type { AuthActionState } from "@/lib/types/auth"

export async function login(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: "Email and password are required", success: false }
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      return { success: true, error: null }
    } catch (error) {
      // Check if the error message indicates authentication failure
      if (error instanceof Error && error.message.includes('CredentialsSignin')) {
        return { error: "Invalid credentials", success: false }
      }
      throw error
    }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred", success: false }
  }
}

export async function logout(): Promise<AuthActionState> {
  try {
    await signOut()
    return { success: true, error: null }
  } catch (error) {
    console.error("Logout error:", error)
    return { error: "Failed to logout", success: false }
  }
}

