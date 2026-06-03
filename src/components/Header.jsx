import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ShoppingCart, User, ChevronDown, LogOut, Package, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import categories from '../data/categories'

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megamenu, setMegamenu] = useState(null)
  const searchRef = useRef(null)
  const megaRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegamenu(null)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight shrink-0">
          ShopABC
        </Link>

        <nav ref={megaRef} className="hidden lg:flex items-center gap-1">
          <Link to="/" className="px-3 py-1.5 rounded-full text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">Trang chủ</Link>
          <Link to="/products" className="px-3 py-1.5 rounded-full text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">Sản phẩm</Link>
          {categories.slice(0, 4).map(cat => (
            <div key={cat.id} className="relative" onMouseEnter={() => setMegamenu(cat.id)} onMouseLeave={() => setMegamenu(null)}>
              <Link to={`/products?category=${cat.id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">
                {cat.name} <ChevronDown className="w-3 h-3" />
              </Link>
              {megamenu === cat.id && cat.subcategories && (
                <div className="absolute top-full left-0 mt-1 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg min-w-[200px] z-50">
                  <div className="grid gap-1">
                    {cat.subcategories.map(sub => (
                      <Link key={sub} to={`/products?category=${cat.id}&brand=${sub}`} className="block px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all">{sub}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative">
            <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {searchOpen && (
                <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} onSubmit={handleSearch} className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2 border border-gray-200 focus-within:border-red-400 transition-colors">
                    <Search className="w-4 h-4 text-gray-300 shrink-0" />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm..." className="flex-1 text-xs text-gray-700 bg-transparent outline-none placeholder:text-gray-300" />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
            <ShoppingCart className="w-4 h-4" />
            {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-[8px] font-bold text-white flex items-center justify-center">{totalItems > 9 ? '9+' : totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer">
                <User className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100"><p className="text-xs font-medium text-gray-900">{user?.username}</p></div>
                    <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"><Package className="w-3.5 h-3.5" /> Đơn hàng</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"><LayoutDashboard className="w-3.5 h-3.5" /> Quản trị</Link>}
                    <button onClick={() => { logout(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"><LogOut className="w-3.5 h-3.5" /> Đăng xuất</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-xs font-medium text-white">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  )
}
