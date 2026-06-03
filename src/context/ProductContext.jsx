import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import staticProducts, { priceRanges } from '../data/products'

const ProductContext = createContext(null)
const STORAGE_KEY = 'asme_admin_products'

function loadAdminProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function saveAdminProducts(adminProducts) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts)) } catch {} 
}

function productReducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const newAdmin = [...state.adminProducts, action.product]
      saveAdminProducts(newAdmin)
      return { ...state, adminProducts: newAdmin }
    }
    case 'UPDATE_PRODUCT': {
      const newAdmin = state.adminProducts.map(p =>
        p.id === action.product.id ? action.product : p
      )
      saveAdminProducts(newAdmin)
      return { ...state, adminProducts: newAdmin }
    }
    case 'DELETE_PRODUCT': {
      const newAdmin = state.adminProducts.filter(p => p.id !== action.id)
      saveAdminProducts(newAdmin)
      return { ...state, adminProducts: newAdmin }
    }
    case 'SYNC_PRODUCTS':
      return { ...state, adminProducts: action.adminProducts }
    default:
      return state
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, { adminProducts: loadAdminProducts() })

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === STORAGE_KEY) {
        try { dispatch({ type: 'SYNC_PRODUCTS', adminProducts: JSON.parse(e.newValue) || [] }) } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 0,
      reviewCount: 0,
    }
    dispatch({ type: 'ADD_PRODUCT', product: newProduct })
    return newProduct
  }, [])

  const updateProduct = useCallback((product) => {
    dispatch({ type: 'UPDATE_PRODUCT', product })
  }, [])

  const deleteProduct = useCallback((id) => {
    dispatch({ type: 'DELETE_PRODUCT', id })
  }, [])

  const value = useMemo(() => {
    const allProducts = [...staticProducts, ...state.adminProducts]
    const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))]
    return {
      products: allProducts,
      adminProducts: state.adminProducts,
      brands,
      priceRanges,
      addProduct,
      updateProduct,
      deleteProduct,
    }
  }, [state.adminProducts, addProduct, updateProduct, deleteProduct])

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
