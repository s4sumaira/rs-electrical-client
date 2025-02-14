
import { Wrapper } from './wrapper'
//import { Toaster } from 'sonner'
import { Toaster } from "react-hot-toast";
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
          <Wrapper>          
            <Toaster position="top-center" />
            {children}
          </Wrapper>
  )
}

