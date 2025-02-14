"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { SessionProvider } from 'next-auth/react'

export const Wrapper = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <SessionProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'xl:ml-64' : 'ml-0'} 
                    xl:ml-64`}
                >
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 p-4">
                        
                            {children}
                        
                    </main>
                </div>
            </div>
        </SessionProvider>
    )
}