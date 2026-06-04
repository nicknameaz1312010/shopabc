import { Link } from 'react-router-dom'
import { Star, X, ShoppingCart, Minus } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useCompare } from '../context/CompareContext'
import { useCart } from '../context/CartContext'

function formatPrice(vnd) {
  return vnd.toLocaleString('vi-VN') + '₫'
}

export default function Compare() {
  const { items, remove, clear } = useCompare()
  const { addItem } = useCart()

  if (items.length < 2) {
    return (
      <div className="bg-white min-h-screen w-full flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">Cần ít nhất 2 sản phẩm để so sánh</p>
            <Link to="/products" className="inline-block px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-all">Chọn sản phẩm</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const allKeys = [...new Set(items.flatMap(p => Object.keys(p.specs || {})))]

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'So sánh sản phẩm' }]} />

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">So sánh sản phẩm</h1>
            <button onClick={clear} className="text-xs text-gray-400 hover:text-red-600 transition-all cursor-pointer">Xoá tất cả</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="w-32 text-left text-[10px] text-gray-400 uppercase tracking-[0.1em] pb-3 pr-4">Sản phẩm</th>
                  {items.map(p => (
                    <th key={p.id} className="text-center pb-3 px-4 min-w-[180px] relative">
                      <button onClick={() => remove(p.id)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                      <div className="w-24 h-24 mx-auto bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 mb-2">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" /> : <span className="text-2xl font-bold text-gray-200">{p.name[0]}</span>}
                      </div>
                      <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(p.price)}</p>
                      {p.originalPrice > p.price && <p className="text-[10px] text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>}
                      <button onClick={() => { for (let i = 0; i < 1; i++) addItem(p) }} className="mt-2 px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-[10px] text-white font-medium transition-all cursor-pointer flex items-center gap-1 mx-auto">
                        <ShoppingCart className="w-3 h-3" /> Thêm
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-[10px] text-gray-400 uppercase tracking-[0.1em] py-3 pr-4 font-medium">Đánh giá</td>
                  {items.map(p => (
                    <td key={p.id} className="text-center py-3 px-4 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-700">{p.rating}</span>
                        <span className="text-[10px] text-gray-400">({p.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="text-[10px] text-gray-400 uppercase tracking-[0.1em] py-3 pr-4 font-medium">Thương hiệu</td>
                  {items.map(p => (
                    <td key={p.id} className="text-center py-3 px-4 border-t border-gray-100 text-xs text-gray-700">{p.brand}</td>
                  ))}
                </tr>
                <tr>
                  <td className="text-[10px] text-gray-400 uppercase tracking-[0.1em] py-3 pr-4 font-medium">Trạng thái</td>
                  {items.map(p => (
                    <td key={p.id} className="text-center py-3 px-4 border-t border-gray-100">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {p.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                  ))}
                </tr>
                {allKeys.map(key => (
                  <tr key={key}>
                    <td className="text-[10px] text-gray-400 uppercase tracking-[0.1em] py-3 pr-4 font-medium">{key}</td>
                    {items.map(p => (
                      <td key={p.id} className="text-center py-3 px-4 border-t border-gray-100 text-xs text-gray-700">
                        {p.specs?.[key] || <span className="text-gray-300">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
