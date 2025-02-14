'use client'

import { useAuth } from '@/hooks/useAuth'

interface ProtectedComponentProps {
  requiredPermission?: string
  requiredRole?: string
  children: React.ReactNode
}

export function ProtectedComponent({ 
  requiredPermission, 
  requiredRole, 
  children 
}: ProtectedComponentProps) {
  const { hasPermission, hasRole } = useAuth()

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null
  }

  return <>{children}</>
}

