import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ShoppingCart, Check, Star, Heart, Scale, Eye, X, Clock, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCompare } from '../context/CompareContext'

function formatPrice(vnd) {
  return vnd.toLocaleString('vi-VN') + '₫'
}

function isNew(product) {
  if (!product.createdAt) return false
  const days = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  return days < 7
}

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addItem } = useCart()
  const { has, toggle } = useCompare()
  const [added, setAdded] = useState(false)
  const [favorite, setFavorite] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopabc_fav') || '[]').includes(product.id) } catch { return false }
  })
  const [showQuick, setShowQuick] = useState(false)

  const handleAdd = e => {
    e.preventDefault(); e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const toggleFav = e => {
    e.preventDefault(); e.stopPropagation()
    const newFav = !favorite
    setFavorite(newFav)
    try {
      const saved = JSON.parse(localStorage.getItem('shopabc_fav') || '[]')
      const updated = newFav ? [...saved, product.id] : saved.filter(id => id !== product.id)
      localStorage.setItem('shopabc_fav', JSON.stringify(updated))
    } catch {}
  }

  const handleCompare = e => {
    e.preventDefault(); e.stopPropagation()
    toggle(product)
  }

  const badge = product.discount > 20 ? 'hot' : product.discount > 0 ? 'sale' : isNew(product) ? 'new' : null

  if (viewMode === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all">
        <div className="flex gap-4 p-4">
          <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3" />
            ) : (
              <span className="text-3xl font-bold text-gray-200">{product.name[0]}</span>
            )}
            {badge && (
              <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white ${badge === 'hot' ? 'bg-red-500' : badge === 'new' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                {badge === 'hot' ? 'HOT' : badge === 'new' ? 'MỚI' : `-${product.discount}%`}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{product.brand}</p>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="text-[10px] text-gray-500">{product.rating}</span></div>
                <span className="text-[10px] text-gray-400">({product.reviewCount?.toLocaleString('vi-VN') || 0})</span>
                {!product.inStock && <span className="text-[10px] text-red-500">Hết hàng</span>}
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{product.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && <span className="text-[10px] text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={toggleFav} className={`p-1.5 rounded-full transition-all cursor-pointer ${favorite ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'}`}><Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-red-500' : ''}`} /></button>
                <button onClick={handleCompare} className={`p-1.5 rounded-full transition-all cursor-pointer ${has(product.id) ? 'text-blue-500 bg-blue-50' : 'text-gray-300 hover:text-blue-400 hover:bg-blue-50'}`}><Scale className="w-3.5 h-3.5" /></button>
                <button onClick={handleAdd} disabled={!product.inStock} className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-[10px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {added ? 'Đã thêm' : 'Thêm vào giỏ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all relative">
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative p-6"
        onMouseEnter={() => setShowQuick(true)} onMouseLeave={() => setShowQuick(false)}>
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:shadow-md transition-all overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-4xl md:text-5xl font-bold text-gray-200">{product.name[0]}</span>
          )}
        </div>

        {badge && (
          <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold text-white ${badge === 'hot' ? 'bg-red-500' : badge === 'new' ? 'bg-blue-500' : 'bg-orange-500'}`}>
            {badge === 'hot' ? 'HOT' : badge === 'new' ? 'MỚI' : `-${product.discount}%`}
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-[10px] font-medium">Hết hàng</span>
          </div>
        )}

        {product.inStock && product.originalPrice > product.price && product.originalPrice - product.price > 5000000 && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            <span className="px-1.5 py-0.5 rounded bg-green-500 text-white text-[7px] font-bold">TIẾT KIỆM</span>
          </div>
        )}

        <AnimatePresence>
          {showQuick && product.inStock && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              onClick={e => { e.preventDefault(); e.stopPropagation(); window.location.href = `/product/${product.id}` }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-[10px] text-gray-700 font-medium shadow-lg hover:bg-white hover:text-red-600 transition-all cursor-pointer flex items-center gap-1.5">
              <Eye className="w-3 h-3" /> Xem nhanh
            </motion.button>
          )}
        </AnimatePresence>

        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button onClick={toggleFav} className={`w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm transition-all cursor-pointer ${favorite ? 'text-red-500 border-red-200' : 'text-gray-300 hover:text-red-400 hover:border-red-200'}`}>
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-red-500' : ''}`} />
          </button>
          <button onClick={handleCompare} className={`w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm transition-all cursor-pointer ${has(product.id) ? 'text-blue-500 border-blue-200 bg-blue-50' : 'text-gray-300 hover:text-blue-400 hover:border-blue-200'}`}>
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        <button onClick={handleAdd} disabled={!product.inStock} className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-red-600 hover:border-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="p-3 md:p-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] text-gray-500">{product.rating}</span>
          <span className="text-[9px] text-gray-300">({product.reviewCount?.toLocaleString('vi-VN') || 0})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm md:text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {product.inStock && product.originalPrice > product.price && product.originalPrice - product.price > 5000000 && (
          <p className="text-[9px] text-green-600 mt-1 flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" />Tiết kiệm {formatPrice(product.originalPrice - product.price)}</p>
        )}
        {product.inStock === false && (
          <p className="text-[10px] text-red-500 mt-1">Hết hàng</p>
        )}
      </div>
    </Link>
  )
}
