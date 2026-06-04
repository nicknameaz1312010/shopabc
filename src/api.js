const BASE = import.meta.env.DEV ? '/api' : (localStorage.getItem('shopabc_api_url') || 'http://localhost:4000/api')

function getToken() {
  try { return localStorage.getItem('shopabc_token') } catch { return null }
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  getMe: () => request('/auth/me'),
  updateMe: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/products${q ? '?' + q : ''}`)
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getBrands: () => request('/products/brands'),

  getOrders: () => request('/orders'),
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  cancelOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  getCategories: () => request('/categories'),

  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    const token = getToken()
    return fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(r => r.json())
  },
}
