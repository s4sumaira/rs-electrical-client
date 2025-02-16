import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Define role-based access permissions and default redirects
const roleConfig = {
  ADMIN: {
    allowedRoutes: ["/contacts", "/inductions", "/projects", "/timesheet" ,"/profile"],
    defaultRedirect: "/contacts",
  },
 
  MANAGER: {
    allowedRoutes: ["/contacts", "/projects", "/timesheet","/profile"],
    defaultRedirect: "/projects",
  },
  USER: {
    allowedRoutes: ["/inductions","/profile"],
    defaultRedirect: "/inductions",
  },
  // Add more roles as needed
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Get user's role from token
    const userRole = token.role as keyof typeof roleConfig

    // Check if role exists and has defined permissions
    if (!userRole || !roleConfig[userRole]) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    const { allowedRoutes, defaultRedirect } = roleConfig[userRole]

    // If user is accessing the root path ("/"), redirect to their default page
    if (path === "/") {
      return NextResponse.redirect(new URL(defaultRedirect, req.url))
    }

    // Check if user has permission to access the requested path
    const hasPermission = allowedRoutes.some((route) => path.startsWith(route))

    // If user doesn't have permission, redirect to their default page
    if (!hasPermission) {
      // Only redirect if they're not already on their default page
      if (path !== defaultRedirect) {
        return NextResponse.redirect(new URL(defaultRedirect, req.url))
      }
    }

    // Allow access if all checks pass
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

// Update the matcher configuration to include all protected routes and the root path
export const config = {
  matcher: ["/", "/contacts/:path*", "/inductions/:path*", "/projects/:path*", "/profile/:path*","/timesheet/:path*"],
}

