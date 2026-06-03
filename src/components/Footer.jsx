import { Link } from 'react-router-dom'
import { MessageCircle, Music, Camera } from 'lucide-react'

const socials = [
  { icon: MessageCircle, href: '#', label: 'Zalo' },
  { icon: Music, href: '#', label: 'TikTok' },
  { icon: Camera, href: '#', label: 'Instagram' },
]

const columns = [
  {
    title: 'Danh mục',
    links: ['Điện thoại', 'Laptop', 'Phụ kiện', 'Tai nghe', 'Đồng hồ'],
  },
  {
    title: 'Hỗ trợ',
    links: ['Trung tâm bảo hành', 'Chính sách đổi trả', 'Hướng dẫn mua hàng', 'Thanh toán', 'Vận chuyển'],
  },
  {
    title: 'Về Shoabc',
    links: ['Giới thiệu', 'Tuyển dụng', 'Liên hệ', 'Điều khoản', 'Bảo mật'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
              <span className="text-red-600">AS</span>ME
            </Link>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Công ty TNHH Shoabc Việt Nam<br />
              123 Nguyễn Huệ, Q.1, TP.HCM<br />
              Hotline: 1900 1234
            </p>
            <div className="flex items-center gap-2 mt-4">
              {socials.map((s, i) => (
                <a key={i} href={s.href} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 transition-all" aria-label={s.label}>
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-[0.1em] mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-xs text-gray-500 hover:text-red-600 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-gray-400">&copy; 2024 Shoabc. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4 text-[10px] text-gray-400">Chính sách bảo mật · Điều khoản sử dụng</div>
        </div>
      </div>
    </footer>
  )
}
