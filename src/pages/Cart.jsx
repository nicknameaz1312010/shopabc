import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Trash2, ShoppingBag, ChevronRight, Minus, Plus, ArrowLeft, Package, Shield, Truck } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useCart } from '../context/CartContext'

function formatPrice(vnd) {
  return vnd.toLocaleString('vi-VN') + '₫'
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, subtotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const shipping = items.length > 0 ? (subtotal >= 5000000 ? 0 : 30000) : 0
  const discount = promoApplied ? subtotal * 0.05 : 0
  const total = subtotal + shipping - discount

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Giỏ hàng của bạn</h1>
            {items.length > 0 && (
              <button onClick={clearCart} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" /> Xoá tất cả
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm mb-2">Giỏ hàng đang trống</p>
              <p className="text-xs text-gray-400 mb-6">Hãy thêm sản phẩm để bắt đầu mua sắm</p>
              <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-sm font-medium text-white">
                <ShoppingBag className="w-4 h-4" /> Mua sắm ngay
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-gray-300">{item.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors truncate block">{item.name}</Link>
                        <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2.5 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"><Minus className="w-3 h-3" /></button>
                        <span className="text-gray-900 text-xs w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        <button onClick={() => removeItem(item.id)} className="text-[10px] text-gray-400 hover:text-red-600 transition-colors cursor-pointer">Xoá</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <aside className="space-y-4">
                <div className="p-5 rounded-2xl border border-gray-200 bg-white">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600"><span>Tạm tính</span><span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span></div>
                    {shipping > 0 ? <div className="flex justify-between text-gray-600"><span>Phí vận chuyển</span><span className="text-gray-900 font-medium">{formatPrice(shipping)}</span></div> : <div className="flex justify-between text-green-600"><span>Phí vận chuyển</span><span>Miễn phí</span></div>}
                    {discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá (5%)</span><span>-{formatPrice(discount)}</span></div>}
                    <div className="border-t border-gray-200 pt-2" />
                    <div className="flex justify-between text-gray-900 font-semibold"><span>Tổng cộng</span><span>{formatPrice(total)}</span></div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5">
                    <input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Mã giảm giá" className="flex-1 text-xs outline-none bg-transparent text-gray-700 placeholder:text-gray-300" />
                    <button onClick={() => { if (promoCode.trim()) setPromoApplied(!promoApplied) }} className={`text-xs font-medium transition-colors cursor-pointer ${promoApplied ? 'text-green-600' : 'text-gray-500 hover:text-red-600'}`}>
                      {promoApplied ? 'Đã áp dụng' : 'Áp dụng'}
                    </button>
                  </div>

                  <Link to="/checkout" className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-sm font-medium text-white">
                    Thanh toán <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                  {[{ icon: Truck, text: 'Miễn phí giao hàng cho đơn trên 5.000.000₫' }, { icon: Shield, text: 'Đổi trả miễn phí trong 30 ngày' }, { icon: Package, text: 'Bảo hành chính hãng 12 tháng' }].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5"><item.icon className="w-4 h-4 text-gray-400" /><span className="text-[11px] text-gray-500">{item.text}</span></div>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
