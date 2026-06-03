import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { MessageProvider } from './context/MessageContext'
import { ProductProvider } from './context/ProductContext'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Admin from './pages/Admin'
import Search from './pages/Search'
import ChatWidget from './components/ChatWidget'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <MessageProvider>
              <ProductProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/search" element={<Search />} />
              </Routes>
              <ChatWidget />
              </ProductProvider>
            </MessageProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
