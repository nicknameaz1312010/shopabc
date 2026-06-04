import { Router } from 'express'
import { get, query, run } from '../db.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', (req, res) => {
  const { category, brand, search, featured } = req.query
  let sql = 'SELECT * FROM products WHERE 1=1'
  const params = []
  if (category) { sql += ' AND category = ?'; params.push(category) }
  if (brand) { sql += ' AND brand = ?'; params.push(brand) }
  if (search) { sql += ' AND (name LIKE ? OR brand LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
  if (featured === 'true') sql += ' AND featured = 1'
  sql += ' ORDER BY createdAt DESC'
  const products = query(sql, params).map(p => ({
    ...p, colors: JSON.parse(p.colors || '[]'), specs: JSON.parse(p.specs || '{}')
  }))
  res.json({ products })
})

router.get('/brands', (req, res) => {
  const rows = query('SELECT DISTINCT brand FROM products WHERE brand != "" ORDER BY brand')
  res.json({ brands: rows.map(b => b.brand) })
})

router.get('/:id', (req, res) => {
  const product = get('SELECT * FROM products WHERE id = ?', [req.params.id])
  if (!product) return res.status(404).json({ error: 'Product not found' })
  product.colors = JSON.parse(product.colors || '[]')
  product.specs = JSON.parse(product.specs || '{}')
  res.json({ product })
})

router.post('/', authenticate, adminOnly, (req, res) => {
  const { name, price, originalPrice, brand, category, description, discount, inStock, featured, image, colors, specs } = req.body
  if (!name || !price) return res.status(400).json({ error: 'Name and price required' })
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const result = run(
    `INSERT INTO products (name, slug, price, originalPrice, brand, category, description, discount, inStock, featured, image, colors, specs, rating, reviewCount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
    [name, slug, price, originalPrice || price, brand || '', category || '', description || '', discount || 0, inStock !== false ? 1 : 0, featured ? 1 : 0, image || '', JSON.stringify(colors || []), JSON.stringify(specs || {})]
  )
  const product = get('SELECT * FROM products WHERE id = ?', [result.lastInsertRowid])
  product.colors = JSON.parse(product.colors || '[]')
  product.specs = JSON.parse(product.specs || '{}')
  res.json({ product })
})

router.put('/:id', authenticate, adminOnly, (req, res) => {
  const existing = get('SELECT * FROM products WHERE id = ?', [req.params.id])
  if (!existing) return res.status(404).json({ error: 'Product not found' })
  const { name, price, originalPrice, brand, category, description, discount, inStock, featured, image, colors, specs } = req.body
  run(
    `UPDATE products SET name=?, price=?, originalPrice=?, brand=?, category=?, description=?, discount=?, inStock=?, featured=?, image=?, colors=?, specs=? WHERE id=?`,
    [
      name || existing.name, price ?? existing.price, originalPrice ?? existing.originalPrice,
      brand ?? existing.brand, category ?? existing.category, description ?? existing.description,
      discount ?? existing.discount, inStock !== false ? 1 : 0, featured ? 1 : 0,
      image ?? existing.image, JSON.stringify(colors || JSON.parse(existing.colors || '[]')),
      JSON.stringify(specs || JSON.parse(existing.specs || '{}')),
      req.params.id
    ]
  )
  const product = get('SELECT * FROM products WHERE id = ?', [req.params.id])
  product.colors = JSON.parse(product.colors || '[]')
  product.specs = JSON.parse(product.specs || '{}')
  res.json({ product })
})

router.delete('/:id', authenticate, adminOnly, (req, res) => {
  run('DELETE FROM products WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

export default router
