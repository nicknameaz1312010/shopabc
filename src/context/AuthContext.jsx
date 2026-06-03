import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const ADMIN_USER = { id: 0, name: 'Admin', email: 'admin@shoabc.com', username: 'admin1122', phone: '0900000000', role: 'admin' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shoabc_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((username, password) => {
    if (username === 'admin1122' && password === 'admin1122') {
      setUser(ADMIN_USER)
      localStorage.setItem('shoabc_user', JSON.stringify(ADMIN_USER))
      return true
    }
    const userData = { id: Date.now(), name: username, email: username + '@shoabc.com', username, phone: '', role: 'user' }
    setUser(userData)
    localStorage.setItem('shoabc_user', JSON.stringify(userData))
    return true
  }, [])

  const register = useCallback((name, password, email) => {
    const userData = { id: Date.now(), name, email, username: name, phone: '', role: 'user' }
    setUser(userData)
    localStorage.setItem('shoabc_user', JSON.stringify(userData))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('shoabc_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
