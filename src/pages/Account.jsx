import { useState, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Package, User, MapPin, Clock, XCircle, ShoppingBag, Search, CreditCard, Save } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'

function formatPrice(vnd) {
  return vnd.toLocaleString('vi-VN') + '₫'
}

const statusColors = {
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  accepted: 'bg-blue-50 text-blue-600 border-blue-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  delivered: 'bg-green-50 text-green-600 border-green-200',
}
const statusLabels = {
  pending: 'Chờ xác nhận',
  accepted: 'Đã xác nhận',
  cancelled: 'Đã huỷ',
  delivered: 'Đã giao',
}

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'accepted', label: 'Đã xác nhận' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã huỷ' },
]

export default function Account() {
  const { user, isAuthenticated } = useAuth()
  const { orders, cancelOrder } = useOrders()
  const [tab, setTab] = useState('orders')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editInfo, setEditInfo] = useState(false)
  const [info, setInfo] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: '' })

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const userOrders = orders.filter(o => o.userId === user?.id)

  const filtered = useMemo(() => {
    let result = [...userOrders]
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(o => o.id.toString().includes(q) || o.shippingInfo?.name?.toLowerCase().includes(q))
    }
    return result.sort((a, b) => b.createdAt - a.createdAt)
  }, [userOrders, statusFilter, search])

  const stats = {
    total: userOrders.length,
    pending: userOrders.filter(o => o.status === 'pending').length,
    delivered: userOrders.filter(o => o.status === 'delivered').length,
    spent: userOrders.reduce((s, o) => s + (o.total || 0), 0),
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Tài khoản' }]} />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{user?.username}</h1>
              <p className="text-xs text-gray-400">{user?.email || 'Chưa có email'}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Tổng đơn hàng', value: stats.total, icon: Package },
              { label: 'Chờ xác nhận', value: stats.pending, icon: Clock },
              { label: 'Đã nhận', value: stats.delivered, icon: ShoppingBag },
              { label: 'Đã chi', value: formatPrice(stats.spent), icon: CreditCard },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }} className="p-3 md:p-4 rounded-xl border border-gray-200 bg-gray-50">
                <s.icon className="w-4 h-4 text-gray-400 mb-1" />
                <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{s.value}</p>
                <p className="text-[9px] md:text-[10px] text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {[{ key: 'orders', label: 'Đơn hàng của tôi' }, { key: 'info', label: 'Thông tin tài khoản' }].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`pb-3 px-4 text-xs font-medium transition-all border-b-2 cursor-pointer ${tab === t.key ? 'text-red-600 border-red-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'orders' && (
            <>
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setStatusFilter(t.key)} className={`shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-medium border transition-all cursor-pointer ${statusFilter === t.key ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                    {t.label}
                    {t.key !== 'all' && userOrders.filter(o => o.status === t.key).length > 0 && <span className="ml-1 text-[9px] opacity-60">({userOrders.filter(o => o.status === t.key).length})</span>}
                  </button>
                ))}
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm đơn hàng..." className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
              </div>

              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                      {search ? 'Không tìm thấy đơn hàng phù hợp' : statusFilter !== 'all' ? 'Chưa có đơn hàng ở trạng thái này' : 'Bạn chưa có đơn hàng nào'}
                    </p>
                    <Link to="/products" className="inline-block mt-4 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-all">Mua sắm ngay</Link>
                  </motion.div>
                ) : (
                  filtered.map(order => (
                    <motion.div key={order.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 md:p-5 rounded-2xl border border-gray-200 mb-3 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs font-medium text-gray-900">Đơn hàng #{order.id}</p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                      </div>
                      <div className="space-y-1.5 mb-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span className="text-[10px] font-bold text-gray-300">{item.name[0]}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-700 truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-400">x{item.quantity} · {formatPrice(item.price)}</p>
                            </div>
                            <p className="text-xs text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[180px]">{order.shippingInfo?.address}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      </div>
                      {order.status === 'pending' && (
                        <button onClick={() => cancelOrder(order.id)} className="mt-3 flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-red-200 text-[10px] text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                          <XCircle className="w-3 h-3" /> Huỷ đơn hàng
                        </button>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </>
          )}

          {tab === 'info' && (
            <div className="max-w-lg">
              <div className="p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-medium text-gray-900">Thông tin cá nhân</h3>
                  <button onClick={() => setEditInfo(!editInfo)} className="text-[10px] text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                    {editInfo ? 'Huỷ' : 'Chỉnh sửa'}
                  </button>
                </div>
                <div className="space-y-4 text-sm">
                  {editInfo ? (
                    <>
                      <div><label className="text-[10px] text-gray-400 mb-1 block">Họ và tên</label><input value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50" /></div>
                      <div><label className="text-[10px] text-gray-400 mb-1 block">Email</label><input type="email" value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50" /></div>
                      <div><label className="text-[10px] text-gray-400 mb-1 block">Số điện thoại</label><input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} placeholder="090..." className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50" /></div>
                      <div><label className="text-[10px] text-gray-400 mb-1 block">Địa chỉ</label><input value={info.address} onChange={e => setInfo({ ...info, address: e.target.value })} placeholder="Số nhà, đường, quận..." className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50" /></div>
                      <button onClick={() => setEditInfo(false)} className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-all cursor-pointer">
                        <Save className="w-3.5 h-3.5" /> Lưu thay đổi
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs text-gray-400">Họ và tên</span><span className="text-xs text-gray-900">{user?.name || user?.username}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs text-gray-400">Tên đăng nhập</span><span className="text-xs text-gray-900">{user?.username}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs text-gray-400">Email</span><span className="text-xs text-gray-900">{user?.email || 'Chưa có'}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-xs text-gray-400">Số điện thoại</span><span className="text-xs text-gray-500">{user?.phone || 'Chưa cập nhật'}</span></div>
                      <div className="flex justify-between py-2"><span className="text-xs text-gray-400">Vai trò</span><span className="text-xs text-gray-900">{user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
