import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, CreditCard, Banknote, MapPin, Phone, User, ChevronRight, ShoppingBag } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'

function formatPrice(vnd) {
  return vnd.toLocaleString('vi-VN') + '₫'
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { addOrder } = useOrders()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [payment, setPayment] = useState('cod')
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const shipping = items.length > 0 ? (subtotal >= 5000000 ? 0 : 30000) : 0
  const total = subtotal + shipping

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) return
    addOrder({
      items: [...items],
      subtotal,
      shipping,
      total,
      payment,
      shippingInfo: { ...form },
    })
    clearCart()
    setSubmitted(true)
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="bg-white min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200"><ShoppingBag className="w-8 h-8 text-gray-300" /></div>
          <p className="text-gray-500 text-sm">Giỏ hàng trống</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-sm font-medium text-white">Mua sắm ngay</Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-white min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Đặt hàng thành công!</h2>
          <p className="text-xs text-gray-500 text-center max-w-xs">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng và liên hệ với bạn sớm nhất.</p>
          <div className="flex gap-3">
            <Link to="/products" className="px-6 py-2.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:text-red-600 hover:border-red-200 transition-all">Tiếp tục mua sắm</Link>
            <Link to="/account" className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-xs font-medium text-white">Xem đơn hàng</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Giỏ hàng', to: '/cart' }, { label: 'Thanh toán' }]} />
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Thanh toán</h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl border border-gray-200">
                <h2 className="text-sm font-medium text-gray-900 mb-5 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> Thông tin giao hàng</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input required placeholder="Họ và tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 transition-colors placeholder:text-gray-300 bg-gray-50" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input required placeholder="Số điện thoại" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 transition-colors placeholder:text-gray-300 bg-gray-50" />
                  </div>
                  <div className="md:col-span-2 relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input required placeholder="Địa chỉ nhận hàng" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 transition-colors placeholder:text-gray-300 bg-gray-50" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200">
                <h2 className="text-sm font-medium text-gray-900 mb-5 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> Phương thức thanh toán</h2>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${payment === 'cod' ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="accent-red-600" />
                    <Banknote className="w-5 h-5 text-gray-400" />
                    <div><p className="text-sm text-gray-900 font-medium">Thanh toán khi nhận hàng</p><p className="text-xs text-gray-400">Trả tiền khi nhận hàng</p></div>
                  </label>
                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${payment === 'bank' ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" checked={payment === 'bank'} onChange={() => setPayment('bank')} className="accent-red-600" />
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div><p className="text-sm text-gray-900 font-medium">Chuyển khoản ngân hàng</p><p className="text-xs text-gray-400">VIB 0123456789 - Shoabc</p></div>
                  </label>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="p-5 rounded-2xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Đơn hàng</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><span className="text-xs font-bold text-gray-300">{item.name[0]}</span></div>
                      <div className="flex-1 min-w-0"><p className="text-xs text-gray-700 truncate">{item.name}</p><p className="text-[10px] text-gray-400">x{item.quantity}</p></div>
                      <p className="text-xs font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-4 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500"><span>Tạm tính</span><span className="text-gray-900">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Phí vận chuyển</span><span className="text-gray-900">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span></div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900"><span>Tổng cộng</span><span>{formatPrice(total)}</span></div>
                </div>
                <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-sm font-medium text-white">
                  Đặt hàng <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </aside>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
