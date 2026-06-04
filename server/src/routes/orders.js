import { Router } from 'express'
import { get, query, run } from '../db.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, (req, res) => {
  let orders
  if (req.user.role === 'admin') {
    orders = query('SELECT * FROM orders ORDER BY createdAt DESC')
  } else {
    orders = query('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [req.user.id])
  }
  orders = orders.map(o => ({
    ...o, items: JSON.parse(o.items || '[]'), shippingInfo: JSON.parse(o.shippingInfo || '{}')
  }))
  res.json({ orders })
})

router.post('/', authenticate, (req, res) => {
  const { items, subtotal, shipping, total, payment, shippingInfo } = req.body
  if (!items || !items.length) return res.status(400).json({ error: 'Cart is empty' })
  const id = 'ORD' + String(Date.now()).slice(-8)
  run(
    `INSERT INTO orders (id, userId, items, subtotal, shipping, total, payment, status, shippingInfo) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [id, req.user.id, JSON.stringify(items), subtotal || 0, shipping || 0, total || 0, payment || 'cod', JSON.stringify(shippingInfo || {})]
  )
  const order = get('SELECT * FROM orders WHERE id = ?', [id])
  order.items = JSON.parse(order.items || '[]')
  order.shippingInfo = JSON.parse(order.shippingInfo || '{}')
  res.json({ order })
})

router.put('/:id/status', authenticate, adminOnly, (req, res) => {
  const { status } = req.body
  const valid = ['pending', 'accepted', 'cancelled', 'delivered']
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
  const order = get('SELECT * FROM orders WHERE id = ?', [req.params.id])
  order.items = JSON.parse(order.items || '[]')
  order.shippingInfo = JSON.parse(order.shippingInfo || '{}')
  res.json({ order })
})

router.delete('/:id', authenticate, (req, res) => {
  const order = get('SELECT * FROM orders WHERE id = ?', [req.params.id])
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (order.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  if (order.status !== 'pending') return res.status(400).json({ error: 'Can only cancel pending orders' })
  run('UPDATE orders SET status = "cancelled" WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

export default router
