import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { SlidersHorizontal, X, Grid3X3, List } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import Breadcrumb from '../components/Breadcrumb'
import { useProducts } from '../context/ProductContext'
import categories from '../data/categories'

const ITEMS_PER_PAGE = 12

export default function Products() {
  const { products, brands, priceRanges } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')

  const activeCategory = searchParams.get('category') || 'all'
  const activeBrand = searchParams.get('brand') || 'all'
  const activePrice = searchParams.get('price') || 'all'
  const page = parseInt(searchParams.get('page')) || 1

  const filtered = useMemo(() => {
    let result = [...products]
    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory)
    if (activeBrand !== 'all') result = result.filter(p => p.brand === activeBrand)
    if (activePrice !== 'all') {
      const range = priceRanges[parseInt(activePrice)]
      if (range) result = result.filter(p => p.price >= range.min && p.price < range.max)
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    }
    return result
  }, [activeCategory, activeBrand, activePrice, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') params.delete(key)
    else params.set(key, value)
    if (key !== 'page') params.delete('page')
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})
  const hasFilters = activeCategory !== 'all' || activeBrand !== 'all' || activePrice !== 'all'
  const currentCatName = activeCategory !== 'all' ? categories.find(c => c.slug === activeCategory)?.name : null

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Sản phẩm' }, ...(currentCatName ? [{ label: currentCatName }] : [])]} />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{currentCatName || 'Tất cả sản phẩm'}</h1>
              <p className="text-xs text-gray-500 mt-1">{filtered.length} sản phẩm</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs text-gray-600 hover:text-red-600 hover:border-red-200 transition-all md:hidden cursor-pointer">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Bộ lọc
              </button>
              <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-full p-1">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors cursor-pointer appearance-none">
                <option value="featured">Nổi bật</option>
                <option value="price-asc">Giá: Thấp→Cao</option>
                <option value="price-desc">Giá: Cao→Thấp</option>
                <option value="rating">Đánh giá</option>
                <option value="name">Tên A→Z</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/40 flex' : 'hidden'} md:flex md:relative md:w-56 shrink-0`}>
              <div className={`${showFilters ? 'w-72 m-auto max-h-[80vh] overflow-y-auto' : 'w-full'} bg-white md:bg-transparent border border-gray-200 md:border-0 rounded-2xl p-5 md:p-0 shadow-lg md:shadow-none`}>
                <div className="flex items-center justify-between mb-4 md:hidden">
                  <span className="text-sm font-medium text-gray-900">Bộ lọc</span>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-900 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Danh mục</h4>
                  <div className="space-y-1">
                    {[{ id: 'all', name: 'Tất cả', icon: '📦' }, ...categories].map(cat => (
                      <button key={cat.id} onClick={() => { setFilter('category', cat.id); setShowFilters(false) }} className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${activeCategory === cat.id ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                        {cat.icon && <span className="mr-1.5">{cat.icon}</span>}{cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Thương hiệu</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {['all', ...brands].map(b => (
                      <button key={b} onClick={() => setFilter('brand', b)} className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${activeBrand === b ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                        {b === 'all' ? 'Tất cả' : b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Khoảng giá</h4>
                  <div className="space-y-1">
                    {['all', ...priceRanges].map((r, i) => (
                      <button key={i} onClick={() => setFilter('price', i === 0 ? 'all' : String(i - 1))} className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${(i === 0 && activePrice === 'all') || (i > 0 && activePrice === String(i - 1)) ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                        {r === 'all' ? 'Tất cả' : r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {hasFilters && (
                  <button onClick={clearFilters} className="w-full px-4 py-2 rounded-full border border-gray-200 text-xs text-gray-500 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer">Xoá tất cả bộ lọc</button>
                )}
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {hasFilters && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {activeCategory !== 'all' && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] text-red-600">
                      {categories.find(c => c.slug === activeCategory)?.name}
                      <button onClick={() => setFilter('category', 'all')}><X className="w-3 h-3 ml-1 hover:text-red-800 cursor-pointer" /></button>
                    </span>
                  )}
                  {activeBrand !== 'all' && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] text-red-600">
                      {activeBrand}
                      <button onClick={() => setFilter('brand', 'all')}><X className="w-3 h-3 ml-1 hover:text-red-800 cursor-pointer" /></button>
                    </span>
                  )}
                  {activePrice !== 'all' && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] text-red-600">
                      {priceRanges[parseInt(activePrice)]?.label}
                      <button onClick={() => setFilter('price', 'all')}><X className="w-3 h-3 ml-1 hover:text-red-800 cursor-pointer" /></button>
                    </span>
                  )}
                </div>
              )}

              {paginated.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-sm">Không tìm thấy sản phẩm phù hợp</p>
                  <button onClick={clearFilters} className="mt-3 text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer">Xoá bộ lọc</button>
                </div>
              ) : (
                <>
                  <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                    <AnimatePresence mode="popLayout">
                      {paginated.map(product => (
                        <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => setFilter('page', String(p))} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
