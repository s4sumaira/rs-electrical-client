import type React from "react"

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-8 border-orange-200"></div>
        <div
          className="absolute inset-0 rounded-full border-8 border-transparent animate-spin"
          style={{
            borderTopColor: "#f97316",
            borderRightColor: "#fb923c",
            borderBottomColor: "#fdba74",
          }}
        ></div>
      </div>
    </div>
  )
}

