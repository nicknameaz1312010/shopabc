import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ShoppingCart, Check, Star, Minus, Plus, ChevronRight, Shield, RotateCcw, Truck } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'

function formatPrice(vnd) {
  return vnd.toLocaleString('vi-VN') + '₫'
}

export default function ProductDetail() {
  const { id } = useParams()
  const { products } = useProducts()
  const product = products.find(p => p.id === Number(id))
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="bg-white min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
          <Link to="/products" className="text-sm text-gray-500 hover:text-red-600 transition-colors">Quay lại</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const cartItem = items.find(i => i.id === product.id)

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Sản phẩm', to: '/products' }, { label: product.name }]} />

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="aspect-square rounded-3xl bg-gray-50 border border-gray-200 flex items-center justify-center relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-8" />
                ) : (
                  <div className="w-40 h-40 rounded-3xl bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                    <span className="text-7xl font-bold text-gray-300">{product.name[0]}</span>
                  </div>
                )}
                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-50 text-xs font-semibold text-red-600 border border-red-200">-{product.discount}% GIẢM</span>
                )}
                {product.colors.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {product.colors.map((color, i) => (
                      <button key={i} onClick={() => setSelectedColor(i)} className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${selectedColor === i ? 'border-red-500 scale-110' : 'border-gray-300'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">
                  <span>{product.brand}</span><ChevronRight className="w-3 h-3" /><span>{product.category}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="text-sm text-gray-700 font-medium">{product.rating}</span></div>
                  <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString('vi-VN')} đánh giá)</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <><span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span><span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Tiết kiệm {formatPrice(product.originalPrice - product.price)}</span></>
                )}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-5">{product.description}</p>

              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2"><span className="text-xs text-gray-400 w-20 shrink-0">{key}:</span><span className="text-xs text-gray-700">{val}</span></div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="text-gray-900 text-sm w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={handleAdd} disabled={!product.inStock} className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {added ? <><Check className="w-4 h-4" /> Đã thêm</> : <><ShoppingCart className="w-4 h-4" /> Thêm vào giỏ</>}
                </button>
              </div>

              {cartItem && <p className="text-xs text-gray-400">Đã có {cartItem.quantity} sản phẩm trong giỏ hàng</p>}

              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
                {[{ icon: Truck, text: 'Giao hàng miễn phí', sub: 'Đơn trên 5 triệu' }, { icon: RotateCcw, text: 'Đổi trả 30 ngày', sub: 'Hoàn tiền 100%' }, { icon: Shield, text: 'Bảo hành 12 tháng', sub: 'Trung tâm toàn quốc' }].map((item, i) => (
                  <div key={i} className="text-center"><item.icon className="w-5 h-5 text-gray-300 mx-auto mb-1" /><p className="text-[10px] text-gray-500 font-medium">{item.text}</p><p className="text-[9px] text-gray-400">{item.sub}</p></div>
                ))}
              </div>
            </motion.div>
          </div>

          {related.length > 0 && (
            <div className="border-t border-gray-100 pt-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
