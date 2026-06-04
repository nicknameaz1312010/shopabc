import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCompare } from '../context/CompareContext'

export default function CompareBar() {
  const { items, clear, remove, count } = useCompare()
  if (count === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-900">
            So sánh ({count}/3)
          </span>
          <div className="flex items-center gap-2">
            {items.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700 truncate max-w-[80px]">{p.name}</span>
                <button onClick={() => remove(p.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clear} className="px-3 py-1.5 rounded-full text-[10px] text-gray-500 border border-gray-200 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer">
            Xoá tất cả
          </button>
          {count >= 2 && (
            <Link to="/compare" className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-[10px] font-medium text-white transition-all">
              So sánh ngay
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
