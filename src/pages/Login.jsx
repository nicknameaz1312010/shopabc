import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    const success = login(username, password)
    if (success) navigate(username === 'admin1122' ? '/admin' : '/')
    else setError('Tên đăng nhập hoặc mật khẩu không đúng')
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Đăng nhập</h1>
            <p className="text-xs text-gray-500 mt-1">Chào mừng trở lại</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Tên đăng nhập" className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 transition-colors placeholder:text-gray-300 bg-gray-50" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 transition-colors placeholder:text-gray-300 bg-gray-50" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <button type="submit" className="w-full px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 transition-all text-sm font-medium text-white cursor-pointer">Đăng nhập</button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Chưa có tài khoản? <Link to="/register" className="text-red-600 hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
