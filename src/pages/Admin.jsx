import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Package, Check, X, Truck, Search, Clock, Plus, Edit3, Trash2, XCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { useProducts } from '../context/ProductContext'
import categories from '../data/categories'

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

const emptyForm = {
  name: '', price: '', originalPrice: '', brand: '', category: '',
  description: '', discount: '0', inStock: true, featured: false,
  image: '', colors: [], specs: [{ key: '', value: '' }],
}

export default function Admin() {
  const { user, isAdmin, isAuthenticated } = useAuth()
  const { orders, acceptOrder, cancelOrder, deliverOrder } = useOrders()
  const { products, adminProducts, addProduct, updateProduct, deleteProduct } = useProducts()
  const [tab, setTab] = useState('orders')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyForm, specs: [{ key: '', value: '' }] })
  const [colorInput, setColorInput] = useState('')

  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />

  const filtered = orders.filter(o =>
    !search || o.id.toString().includes(search) || o.shippingInfo?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  function resetForm() {
    setForm({ ...emptyForm, specs: [{ key: '', value: '' }] })
    setEditing(null)
    setColorInput('')
  }

  function openEdit(product) {
    setForm({
      name: product.name,
      price: String(product.price),
      originalPrice: String(product.originalPrice || ''),
      brand: product.brand || '',
      category: product.category || '',
      description: product.description || '',
      discount: String(product.discount || '0'),
      inStock: product.inStock !== false,
      featured: product.featured || false,
      image: product.image || '',
      colors: product.colors || [],
      specs: product.specs ? Object.entries(product.specs).map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }],
    })
    setEditing(product)
    setShowForm(true)
  }

  function handleSave(e) {
    e.preventDefault()
    const data = {
      name: form.name,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : Number(form.price),
      brand: form.brand,
      category: form.category,
      description: form.description,
      discount: Number(form.discount) || 0,
      inStock: form.inStock,
      featured: form.featured,
      image: form.image,
      colors: form.colors,
      specs: form.specs.filter(s => s.key).reduce((acc, s) => { acc[s.key] = s.value; return acc }, {}),
    }
    if (editing) {
      updateProduct({ ...editing, ...data })
    } else {
      addProduct(data)
    }
    resetForm()
    setShowForm(false)
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Quản trị' }]} />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quản trị</h1>
              <p className="text-xs text-gray-400">Xin chào, {user?.username}</p>
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {[{ key: 'orders', label: 'Đơn hàng' }, { key: 'products', label: 'Sản phẩm' }].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setSearch('') }} className={`pb-3 px-4 text-xs font-medium transition-all border-b-2 cursor-pointer ${tab === t.key ? 'text-red-600 border-red-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'orders' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {[
                  { label: 'Tổng đơn', value: counts.total, color: 'text-gray-900', bg: 'bg-gray-50', border: 'border-gray-200' },
                  { label: 'Chờ xác nhận', value: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                  { label: 'Đã xác nhận', value: counts.accepted, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
                  { label: 'Đã huỷ', value: counts.cancelled, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                  { label: 'Đã giao', value: counts.delivered, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`${stat.bg} ${stat.border} border rounded-xl p-4`}>
                    <p className="text-[10px] text-gray-500 mb-1">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm đơn hàng (ID hoặc tên khách hàng)..." className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 transition-colors placeholder:text-gray-300 bg-gray-50" />
              </div>

              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <div className="text-center py-12"><Package className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-gray-400">Không có đơn hàng</p></div>
                ) : (
                  filtered.map(order => (
                    <motion.div key={order.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs font-medium text-gray-900">Đơn hàng #{order.id}</p>
                          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString('vi-VN')} — {order.shippingInfo?.name} — {order.shippingInfo?.phone}
                          </p>
                          <p className="text-[10px] text-gray-400">{order.shippingInfo?.address}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                          <p className="text-xs font-semibold text-gray-900 mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center"><span className="text-[8px] font-bold text-gray-300">{item.name[0]}</span></div><span className="text-[11px] text-gray-600">{item.name} x{item.quantity}</span><span className="text-[11px] text-gray-900 ml-auto">{formatPrice(item.price * item.quantity)}</span></div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <><button onClick={() => acceptOrder(order.id)} className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-green-600 hover:bg-green-700 text-[10px] text-white transition-all cursor-pointer"><Check className="w-3 h-3" /> Xác nhận</button><button onClick={() => cancelOrder(order.id)} className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-red-200 text-[10px] text-red-500 hover:bg-red-50 transition-all cursor-pointer"><X className="w-3 h-3" /> Huỷ</button></>
                        )}
                        {order.status === 'accepted' && (
                          <button onClick={() => deliverOrder(order.id)} className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-[10px] text-white transition-all cursor-pointer"><Truck className="w-3 h-3" /> Đã giao hàng</button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          )}

          {tab === 'products' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-gray-500">{products.length} sản phẩm (admin: {adminProducts.length})</p>
                <button onClick={() => { resetForm(); setShowForm(true) }} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-all cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Thêm sản phẩm
                </button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12"><Package className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-gray-400">Chưa có sản phẩm nào</p></div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Ảnh</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Tên</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Danh mục</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Thương hiệu</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Giá</th>
                        <th className="text-center px-4 py-3 font-medium text-gray-500">Tồn kho</th>
                        <th className="text-center px-4 py-3 font-medium text-gray-500">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr key={p.id} className={`border-b border-gray-100 ${adminProducts.find(a => a.id === p.id) ? 'bg-red-50/30' : ''}`}>
                          <td className="px-4 py-3">
                            {p.image ? (
                              <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-300">?</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400">{typeof p.id === 'number' && p.id > 1000000 ? 'AD' : p.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                          <td className="px-4 py-3 text-gray-500">{p.category}</td>
                          <td className="px-4 py-3 text-gray-500">{p.brand}</td>
                          <td className="px-4 py-3 text-right text-gray-900">{formatPrice(p.price)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] ${p.inStock !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {p.inStock !== false ? 'Còn' : 'Hết'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              {adminProducts.find(a => a.id === p.id) && (
                                <>
                                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
                <button onClick={() => { setShowForm(false); resetForm() }} className="text-gray-400 hover:text-gray-700 cursor-pointer"><XCircle className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Tên sản phẩm</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: iPhone 16 Pro Max" className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Giá bán (₫)</label>
                    <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="29900000" className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Giá gốc (₫)</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="32990000" className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Thương hiệu</label>
                    <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Apple" className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Danh mục</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 cursor-pointer appearance-none">
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Mô tả</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả sản phẩm..." rows={2} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300 resize-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Ảnh sản phẩm</label>
                    <div className="space-y-2">
                      {form.image && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                          <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 cursor-pointer"><X className="w-3 h-3" /></button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="URL ảnh (https://...)" className="flex-1 px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                        <label className="shrink-0 px-3 py-2 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 transition-all cursor-pointer">
                          Tải lên
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            if (file.size > 1024 * 1024) { alert('Ảnh tối đa 1MB'); return }
                            const reader = new FileReader()
                            reader.onload = ev => setForm({ ...form, image: ev.target.result })
                            reader.readAsDataURL(file)
                          }} />
                        </label>
                      </div>
                      <p className="text-[9px] text-gray-400">Dán URL hoặc tải ảnh lên (tối đa 1MB, định dạng JPG/PNG)</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Giảm giá (%)</label>
                    <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="w-full px-3.5 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50" />
                  </div>
                  <div className="flex items-end gap-3 pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="accent-red-600" />
                      <span className="text-xs text-gray-600">Còn hàng</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-red-600" />
                      <span className="text-xs text-gray-600">Nổi bật</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Màu sắc</label>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {form.colors.map((c, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 text-[10px] text-gray-600">
                        <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                        {c}
                        <button type="button" onClick={() => setForm({ ...form, colors: form.colors.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-500 cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={colorInput} onChange={e => setColorInput(e.target.value)} placeholder="#ff0000" className="flex-1 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                    <button type="button" onClick={() => { if (colorInput.trim()) { setForm({ ...form, colors: [...form.colors, colorInput.trim()] }); setColorInput('') } }} className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 transition-all cursor-pointer">Thêm</button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1 block">Thông số kỹ thuật</label>
                  <div className="space-y-2">
                    {form.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input value={spec.key} onChange={e => { const s = [...form.specs]; s[i] = { ...s[i], key: e.target.value }; setForm({ ...form, specs: s }) }} placeholder="Tên (VD: CPU)" className="flex-1 px-3 py-1.5 rounded-full border border-gray-200 text-[10px] text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                        <input value={spec.value} onChange={e => { const s = [...form.specs]; s[i] = { ...s[i], value: e.target.value }; setForm({ ...form, specs: s }) }} placeholder="Giá trị (VD: A18 Pro)" className="flex-[2] px-3 py-1.5 rounded-full border border-gray-200 text-[10px] text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                        {form.specs.length > 1 && (
                          <button type="button" onClick={() => setForm({ ...form, specs: form.specs.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm({ ...form, specs: [...form.specs, { key: '', value: '' }] })} className="text-[10px] text-gray-400 hover:text-red-600 transition-colors cursor-pointer">+ Thêm thông số</button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button type="submit" className="flex-1 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-all cursor-pointer">
                    {editing ? 'Cập nhật' : 'Thêm sản phẩm'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); resetForm() }} className="px-4 py-2 rounded-full border border-gray-200 text-xs text-gray-500 hover:text-gray-700 transition-all cursor-pointer">Huỷ</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
