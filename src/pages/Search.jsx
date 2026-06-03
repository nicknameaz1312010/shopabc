import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Search as SearchIcon, X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'

export default function Search() {
  const { products } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products.filter(
      p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="relative max-w-xl mx-auto mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              autoFocus
              value={query}
              onChange={e => {
                const params = new URLSearchParams()
                if (e.target.value.trim()) params.set('q', e.target.value)
                setSearchParams(params, { replace: true })
              }}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300"
            />
            {query && (
              <button onClick={() => setSearchParams({}, { replace: true })} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {query && (
            <p className="text-xs text-gray-500 text-center mb-6">
              {results.length} kết quả cho "<span className="text-gray-900">{query}</span>"
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {query && results.length === 0 && (
            <div className="text-center py-16">
              <SearchIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-xs text-gray-400 mt-1">Thử với từ khoá khác</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
