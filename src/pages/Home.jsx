import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Zap, Shield, Headphones, Star, Phone, Laptop, Tablet, Headset, Watch, Radio } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'
import categories from '../data/categories'

const categoryIcons = [Phone, Laptop, Tablet, Headset, Watch, Radio]

const promos = [
  { gradient: 'from-red-500 to-rose-700', title: 'iPhone 16 Series', subtitle: 'Trả góp 0% - Giảm đến 3 triệu', badge: 'Mới' },
  { gradient: 'from-red-600 to-red-800', title: 'Phụ kiện chính hãng', subtitle: 'Giảm đến 30% + quà tặng', badge: 'Sale' },
  { gradient: 'from-rose-500 to-pink-700', title: 'Thu cũ lên đời', subtitle: 'Thu cao nhất - Bù chênh đến 5 triệu', badge: 'Hot' },
]

const features = [
  { icon: Zap, title: 'Giao hàng siêu tốc', desc: '2-4 giờ nội thành' },
  { icon: Shield, title: 'Chính hãng 100%', desc: 'Bảo hành 12 tháng' },
  { icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Hotline 1900 1234' },
  { icon: Star, title: 'Thu cũ lên đời', desc: 'Giá thu cao nhất' },
]

export default function Home() {
  const { products, brands } = useProducts()
  const featured = products.filter(p => p.featured)
  const latest = products.slice(0, 8)

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />

      <section className="relative pt-20 overflow-hidden bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Công nghệ đỉnh cao<br />
              <span className="text-red-600">Giá tốt mỗi ngày</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm">
              Sản phẩm chính hãng, giá tốt nhất, giao hàng siêu tốc. Mua sắm thông minh cùng Asme.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {promos.map((promo, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-6 group cursor-pointer min-h-[140px] shadow-md`}
              >
                <span className="relative z-10 text-[10px] font-semibold text-white/80 bg-white/15 px-2.5 py-0.5 rounded-full inline-block mb-2">{promo.badge}</span>
                <h3 className="relative z-10 text-white font-semibold text-lg leading-tight">{promo.title}</h3>
                <p className="relative z-10 text-white/70 text-xs mt-1">{promo.subtitle}</p>
                <ArrowRight className="absolute bottom-5 right-5 w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">{f.title}</p>
                  <p className="text-[10px] text-gray-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Danh mục</h2>
            <Link to="/products" className="text-xs text-gray-400 hover:text-red-600 transition-colors">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[i] || categoryIcons[0]
              return (
                <Link key={cat.id} to={`/products?category=${cat.id}`}
                  className="flex flex-col items-center gap-2 p-4 md:p-5 rounded-2xl bg-white border border-gray-200 hover:border-red-200 hover:shadow-sm hover:-translate-y-0.5 transition-all group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                  <span className="text-[11px] md:text-xs text-gray-600 group-hover:text-red-600 transition-colors">{cat.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-14 border-t border-gray-100 bg-gradient-to-b from-white to-red-50/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Sản phẩm nổi bật</h2>
                <p className="text-xs text-gray-400 mt-1">Công nghệ mới nhất, giá ưu đãi nhất</p>
              </div>
              <Link to="/products" className="text-xs text-gray-400 hover:text-red-600 transition-colors">Xem tất cả</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.slice(0, 8).map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Sản phẩm mới</h2>
              <p className="text-xs text-gray-400 mt-1">Vừa cập bến Asme</p>
            </div>
            <Link to="/products" className="text-xs text-gray-400 hover:text-red-600 transition-colors">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {latest.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="py-12 border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Thương hiệu đối tác</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {brands.map(brand => (
                <Link key={brand} to={`/products?brand=${brand}`}
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-xs text-gray-600 hover:text-red-600 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
