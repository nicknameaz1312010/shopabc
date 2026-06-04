import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { api } from '../api'

const OrderContext = createContext(null)

function orderReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS': return { ...state, orders: action.orders, loading: false }
    case 'ADD_ORDER': return { ...state, orders: [action.order, ...state.orders] }
    case 'UPDATE_STATUS': return { ...state, orders: state.orders.map(o => o.id === action.id ? { ...o, status: action.status } : o) }
    default: return state
  }
}

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(orderReducer, { orders: [], loading: true })

  useEffect(() => {
    if (!user) { dispatch({ type: 'SET_ORDERS', orders: [] }); return }
    api.getOrders().then(({ orders }) => {
      dispatch({ type: 'SET_ORDERS', orders })
    }).catch(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('shopabc_orders') || '[]')
        dispatch({ type: 'SET_ORDERS', orders: stored })
      } catch { dispatch({ type: 'SET_ORDERS', orders: [] }) }
    })
  }, [user])

  const addOrder = useCallback(async (orderData) => {
    const order = { id: 'ORD' + String(Date.now()).slice(-6), userId: user?.id, createdAt: Date.now(), status: 'pending', ...orderData }
    try {
      const { order: saved } = await api.createOrder(orderData)
      dispatch({ type: 'ADD_ORDER', order: saved })
      return saved
    } catch {
      dispatch({ type: 'ADD_ORDER', order })
      return order
    }
  }, [user])

  const cancelOrder = useCallback((id) => {
    api.cancelOrder(id).catch(() => {})
    dispatch({ type: 'UPDATE_STATUS', id, status: 'cancelled' })
  }, [])

  const acceptOrder = useCallback((id) => {
    api.updateOrderStatus(id, 'accepted').catch(() => {})
    dispatch({ type: 'UPDATE_STATUS', id, status: 'accepted' })
  }, [])

  const deliverOrder = useCallback((id) => {
    api.updateOrderStatus(id, 'delivered').catch(() => {})
    dispatch({ type: 'UPDATE_STATUS', id, status: 'delivered' })
  }, [])

  const value = useMemo(() => ({
    orders: state.orders,
    loading: state.loading,
    addOrder,
    cancelOrder,
    acceptOrder,
    deliverOrder,
  }), [state.orders, state.loading, addOrder, cancelOrder, acceptOrder, deliverOrder])

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
