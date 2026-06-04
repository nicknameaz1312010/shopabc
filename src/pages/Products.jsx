import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { SlidersHorizontal, X, Grid3X3, List, ChevronDown, Search, Star } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import Breadcrumb from '../components/Breadcrumb'
import PromoBanner from '../components/PromoBanner'
import CompareBar from '../components/CompareBar'
import { useProducts } from '../context/ProductContext'
import categories from '../data/categories'

const ITEMS_PER_PAGE = 12

const sortOptions = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp→Cao' },
  { value: 'price-desc', label: 'Giá: Cao→Thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'name', label: 'Tên A→Z' },
]

const starOptions = [5, 4, 3, 2, 1]

export default function Products() {
  const { products, brands, priceRanges } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [showSort, setShowSort] = useState(false)

  const activeCategory = searchParams.get('category') || 'all'
  const activeBrand = searchParams.get('brand') || 'all'
  const activePrice = searchParams.get('price') || 'all'
  const activeRating = searchParams.get('rating') || 'all'
  const activeSearch = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page')) || 1

  const uniqueSpecKeys = useMemo(() => {
    const keys = new Set()
    products.forEach(p => {
      if (p.specs) Object.keys(p.specs).forEach(k => keys.add(k))
    })
    return ['CPU', 'RAM', 'Chip', ...Array.from(keys)].filter((v, i, a) => a.indexOf(v) === i)
  }, [products])

  const filtered = useMemo(() => {
    let result = [...products]

    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory)
    if (activeBrand !== 'all') result = result.filter(p => p.brand === activeBrand)
    if (activePrice !== 'all') {
      const range = priceRanges[parseInt(activePrice)]
      if (range) result = result.filter(p => p.price >= range.min && p.price < range.max)
    }
    if (activeRating !== 'all') {
      const minRating = parseInt(activeRating)
      result = result.filter(p => p.rating >= minRating)
    }
    if (activeSearch) {
      const q = activeSearch.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
      case 'newest': result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    }
    return result
  }, [activeCategory, activeBrand, activePrice, activeRating, activeSearch, sortBy, products, priceRanges])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all' || !value) params.delete(key)
    else params.set(key, value)
    if (key !== 'page') params.delete('page')
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})
  const activeFilters = []
  if (activeCategory !== 'all') activeFilters.push({ key: 'category', label: categories.find(c => c.slug === activeCategory)?.name || activeCategory })
  if (activeBrand !== 'all') activeFilters.push({ key: 'brand', label: activeBrand })
  if (activePrice !== 'all') activeFilters.push({ key: 'price', label: priceRanges[parseInt(activePrice)]?.label })
  if (activeRating !== 'all') activeFilters.push({ key: 'rating', label: `≥ ${activeRating} sao` })
  const currentCatName = activeCategory !== 'all' ? categories.find(c => c.slug === activeCategory)?.name : null

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <PromoBanner />
      <main className="flex-1 pt-28">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[
            { label: 'Sản phẩm', to: '/products' },
            ...(currentCatName ? [{ label: currentCatName }] : []),
          ]} />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{currentCatName || 'Tất cả sản phẩm'}</h1>
              <p className="text-xs text-gray-500 mt-1">{filtered.length} sản phẩm</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs text-gray-600 hover:text-red-600 hover:border-red-200 transition-all md:hidden cursor-pointer">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Bộ lọc{activeFilters.length > 0 && <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[8px] flex items-center justify-center">{activeFilters.length}</span>}
              </button>
              <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-full p-1">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative">
                <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-xs text-gray-600 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer">
                  {sortOptions.find(o => o.value === sortBy)?.label} <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showSort && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30">
                      {sortOptions.map(opt => (
                        <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSort(false) }} className={`w-full text-left px-4 py-2 text-xs transition-all cursor-pointer ${sortBy === opt.value ? 'text-red-600 bg-red-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/40 flex' : 'hidden'} md:flex md:relative md:w-64 shrink-0`}>
              <div className={`${showFilters ? 'w-80 m-auto max-h-[85vh] overflow-y-auto' : 'w-full'} bg-white md:bg-transparent border border-gray-200 md:border-0 rounded-2xl p-5 md:p-0 shadow-lg md:shadow-none`}>
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
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Tìm kiếm</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                    <input value={activeSearch} onChange={e => setFilter('q', e.target.value)} placeholder="Tìm trong danh mục..." className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-200 text-xs text-gray-700 outline-none focus:border-red-400 transition-colors bg-gray-50 placeholder:text-gray-300" />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Thương hiệu</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {brands.map(b => (
                      <button key={b} onClick={() => setFilter('brand', activeBrand === b ? 'all' : b)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all cursor-pointer ${activeBrand === b ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-500 border-gray-200 hover:border-red-200 hover:text-red-600'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Khoảng giá</h4>
                  <div className="space-y-1">
                    {[{ label: 'Tất cả', min: 0, max: Infinity }, ...priceRanges].map((r, i) => {
                      const isActive = (i === 0 && activePrice === 'all') || (i > 0 && activePrice === String(i - 1))
                      return (
                        <button key={i} onClick={() => setFilter('price', i === 0 ? 'all' : String(i - 1))} className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${isActive ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                          {r.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em] mb-3">Đánh giá</h4>
                  <div className="space-y-1">
                    <button onClick={() => setFilter('rating', 'all')} className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${activeRating === 'all' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                      Tất cả
                    </button>
                    {starOptions.map(s => (
                      <button key={s} onClick={() => setFilter('rating', String(s))} className={`flex items-center gap-1.5 w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${activeRating === String(s) ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < s ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                        <span className="text-gray-400 ml-1">trở lên</span>
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilters.length > 0 && (
                  <button onClick={clearFilters} className="w-full px-4 py-2 rounded-full border border-gray-200 text-xs text-gray-500 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer">
                    Xoá tất cả ({activeFilters.length})
                  </button>
                )}
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {activeFilters.map(f => (
                    <span key={f.key} className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] text-red-600">
                      {f.label}
                      <button onClick={() => setFilter(f.key, 'all')}><X className="w-3 h-3 ml-1 hover:text-red-800 cursor-pointer" /></button>
                    </span>
                  ))}
                  <button onClick={clearFilters} className="text-[10px] text-gray-400 hover:text-red-600 transition-colors cursor-pointer">Xoá tất cả</button>
                </div>
              )}

              {paginated.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-sm">Không tìm thấy sản phẩm phù hợp</p>
                  <button onClick={clearFilters} className="mt-3 text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer">Xoá bộ lọc</button>
                </div>
              ) : (
                <>
                  {viewMode === 'list' ? (
                    <div className="space-y-3">
                      {paginated.map(product => (
                        <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <ProductCard product={product} viewMode="list" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      <AnimatePresence mode="popLayout">
                        {paginated.map(product => (
                          <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <ProductCard product={product} viewMode="grid" />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => setFilter('page', String(p))} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <CompareBar />
      <Footer />
    </div>
  )
}
