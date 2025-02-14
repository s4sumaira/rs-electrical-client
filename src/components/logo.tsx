import type React from "react"

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ width = 200, height = 200, className = "" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
     
      <text x="85" y="185" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="32" fill="#000000">
        R.S
      </text>
    </svg>
  )
}


