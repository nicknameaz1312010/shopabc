import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">...</span>
        ) : (
          <button key={i} onClick={() => onPageChange(page)} className={`w-8 h-8 rounded-full text-xs font-medium transition-all cursor-pointer ${page === currentPage ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {page}
          </button>
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
