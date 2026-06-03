import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Check, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

function formatPrice(vnd) {
  return vnd.toLocaleString('vi-VN') + '₫'
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = e => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all">
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative p-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:shadow-md transition-all overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-4xl md:text-5xl font-bold text-gray-200">{product.name[0]}</span>
          )}
        </div>
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-red-50 text-[9px] font-semibold text-red-600 border border-red-200">-{product.discount}%</span>
        )}
        <button onClick={handleAdd} className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-red-600 hover:border-red-600 hover:text-white transition-all cursor-pointer">
          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="p-3 md:p-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] text-gray-500">{product.rating}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm md:text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
