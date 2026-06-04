import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const CompareContext = createContext(null)

const MAX_COMPARE = 3

export function CompareProvider({ children }) {
  const [items, setItems] = useState([])

  const toggle = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev.filter(p => p.id !== product.id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, product]
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(p => p.id !== id))
  }, [])

  const value = useMemo(() => ({
    items, toggle, clear, remove,
    count: items.length,
    max: MAX_COMPARE,
    has: (id) => items.some(p => p.id === id),
  }), [items, toggle, clear, remove])

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
