import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from './AuthContext'

const OrderContext = createContext(null)
const STORAGE_KEY = 'shopabc_orders'

function loadOrders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function saveOrders(orders) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)) } catch {}
}

function orderReducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER': {
      const newOrders = [action.order, ...state.orders]
      saveOrders(newOrders)
      return { ...state, orders: newOrders }
    }
    case 'UPDATE_STATUS': {
      const newOrders = state.orders.map(o =>
        o.id === action.id ? { ...o, status: action.status } : o
      )
      saveOrders(newOrders)
      return { ...state, orders: newOrders }
    }
    case 'SYNC_ORDERS':
      return { ...state, orders: action.orders }
    default:
      return state
  }
}

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(orderReducer, { orders: loadOrders() })

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === STORAGE_KEY) {
        try { dispatch({ type: 'SYNC_ORDERS', orders: JSON.parse(e.newValue) || [] }) } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addOrder = useCallback((orderData) => {
    const order = {
      id: 'ORD' + String(Date.now()).slice(-6),
      userId: user?.id,
      createdAt: Date.now(),
      status: 'pending',
      ...orderData,
    }
    dispatch({ type: 'ADD_ORDER', order })
    return order
  }, [user])

  const cancelOrder = useCallback((id) => dispatch({ type: 'UPDATE_STATUS', id, status: 'cancelled' }), [])
  const acceptOrder = useCallback((id) => dispatch({ type: 'UPDATE_STATUS', id, status: 'accepted' }), [])
  const deliverOrder = useCallback((id) => dispatch({ type: 'UPDATE_STATUS', id, status: 'delivered' }), [])

  const value = useMemo(() => ({
    orders: state.orders,
    addOrder,
    cancelOrder,
    acceptOrder,
    deliverOrder,
  }), [state.orders, addOrder, cancelOrder, acceptOrder, deliverOrder])

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
