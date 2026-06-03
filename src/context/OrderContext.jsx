import { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'

const OrderContext = createContext(null)

function orderReducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER':
      return { ...state, orders: [action.order, ...state.orders] }
    case 'UPDATE_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.id ? { ...o, status: action.status } : o
        ),
      }
    default:
      return state
  }
}

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(orderReducer, { orders: [] })

  const addOrder = useCallback((orderData) => {
    const order = {
      id: 'ASM' + String(Date.now()).slice(-6),
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
