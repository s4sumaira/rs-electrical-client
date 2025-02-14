'use client'

import { useSession } from "next-auth/react"

export default function ClientComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please sign in</div>
  }

  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
      <div>Role: {session.accessToken}</div>
      <div>
        Permissions: 
        {session.user?.permissions?.map(perm => (
          <span key={perm} className="mr-2">{perm}</span>
        ))}
      </div>
    </div>
  )
}