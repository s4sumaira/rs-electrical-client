import { cn } from "@/lib/utils"

interface AvatarProps {
  name: string
  className?: string
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(part => part.length > 0)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function getRandomColor(name: string) {
  const colors = [
    "bg-red-100 text-red-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-yellow-100 text-yellow-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-indigo-100 text-indigo-600"
  ]
  
  // Use the name to generate a consistent color
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ name, className }: AvatarProps) {
  const initials = getInitials(name)
  const colorClass = getRandomColor(name)
  
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium",
        colorClass,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}