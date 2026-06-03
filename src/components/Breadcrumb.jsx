import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-6 overflow-x-auto">
      <Link to="/" className="hover:text-red-600 transition-colors shrink-0">Trang chủ</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-2.5 h-2.5 shrink-0" />
          {item.to ? (
            <Link to={item.to} className="hover:text-red-600 transition-colors shrink-0">{item.label}</Link>
          ) : (
            <span className="text-gray-900 shrink-0">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
