import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import { api } from '../api'
import { priceRanges } from '../data/products'

const ProductContext = createContext(null)

function productReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS': return { ...state, products: action.products, loading: false }
    case 'ADD_PRODUCT': return { ...state, adminProducts: [...state.adminProducts, action.product] }
    case 'UPDATE_PRODUCT': return { ...state, adminProducts: state.adminProducts.map(p => p.id === action.product.id ? action.product : p) }
    case 'DELETE_PRODUCT': return { ...state, adminProducts: state.adminProducts.filter(p => p.id !== action.id) }
    case 'SET_LOADING': return { ...state, loading: action.loading }
    default: return state
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, { products: [], adminProducts: [], loading: true })

  useEffect(() => {
    api.getProducts().then(({ products }) => {
      dispatch({ type: 'SET_PRODUCTS', products })
    }).catch(() => {
      dispatch({ type: 'SET_PRODUCTS', products: [] })
    })
  }, [])

  const addProduct = useCallback(async (product) => {
    const newProduct = { ...product, id: Date.now(), rating: 0, reviewCount: 0 }
    try {
      const { product: saved } = await api.createProduct(product)
      dispatch({ type: 'ADD_PRODUCT', product: saved })
      return saved
    } catch {
      dispatch({ type: 'ADD_PRODUCT', product: newProduct })
      return newProduct
    }
  }, [])

  const updateProduct = useCallback(async (product) => {
    try {
      const { product: updated } = await api.updateProduct(product.id, product)
      dispatch({ type: 'UPDATE_PRODUCT', product: updated })
    } catch {
      dispatch({ type: 'UPDATE_PRODUCT', product })
    }
  }, [])

  const deleteProduct = useCallback(async (id) => {
    try { await api.deleteProduct(id) } catch {}
    dispatch({ type: 'DELETE_PRODUCT', id })
  }, [])

  const value = useMemo(() => {
    const allProducts = [...state.products, ...state.adminProducts.filter(ap => !state.products.find(p => p.id === ap.id))]
    const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))]
    return {
      products: allProducts,
      adminProducts: state.adminProducts,
      brands,
      priceRanges,
      loading: state.loading,
      addProduct,
      updateProduct,
      deleteProduct,
    }
  }, [state.products, state.adminProducts, state.loading, addProduct, updateProduct, deleteProduct])

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
