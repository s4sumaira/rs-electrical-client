import { useState } from 'react'

export const useModal = <T>() => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<T | null>(null)

  const openModal = (record: T | null = null) => {
    setCurrentRecord(record)
    setIsOpen(true)
  }

  const closeModal = () => {
    setCurrentRecord(null)
    setIsOpen(false)
  }

  return { isOpen, currentRecord, openModal, closeModal }
}

