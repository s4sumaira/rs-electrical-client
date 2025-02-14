import { motion } from 'framer-motion'
import {  LucideIcon } from 'lucide-react'

interface CardProps {
  title: string
  icon: LucideIcon
  value: string
  change: string
}

export const Card =({ title, icon: Icon, value, change }: CardProps) =>{
  return (
    <motion.div
      className="relative p-6 rounded-lg overflow-hidden bg-white dark:bg-opacity-10"
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{title}</h2>
        <Icon className="text-gray-500 dark:text-gray-400" />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
      <p className="text-sm text-green-600 dark:text-green-400 font-medium">{change}</p>
    </motion.div>
  )
}

