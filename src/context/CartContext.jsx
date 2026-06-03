import { createContext, useContext, useReducer, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = useCallback((product) => dispatch({ type: 'ADD_ITEM', product }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), [])
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const value = useMemo(() => {
    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    return { items: state.items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart }
  }, [state.items, addItem, removeItem, updateQuantity, clearCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
