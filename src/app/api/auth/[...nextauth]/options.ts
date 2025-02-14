import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        try {
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.API_KEY as string,
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Authentication failed")
          }

          const response = await res.json()

          if (response.success && response.data) {
            return {
              id: response.data.user._id,
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role.name,
              contact:response.data.user?.contact,
              permissions: response.data.user.role.permissions,
              accessToken: response.data.token,
            }
          }
          throw new Error("Invalid credentials")
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Authentication failed")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,          
          permissions: user.permissions,
          accessToken: user.accessToken,
        }
      }

      // Handle token refresh
      if (Date.now() < ((token.exp as number) ?? 0) * 1000) {
        return token
      }

      try {
        const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        })

        if (!response.ok) throw Error()

        const refreshedTokens = await response.json()

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          exp: refreshedTokens.exp,
        }
      } catch (error) {
        console.log(error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        }
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.permissions = token.permissions
      }
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60, // 24 hours
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
}

