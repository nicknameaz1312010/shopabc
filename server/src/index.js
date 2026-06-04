import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDb } from './db.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import uploadRoutes from './routes/upload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 'dien-thoai', name: 'Điện thoại', icon: '📱', subcategories: ['iPhone', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'] },
    { id: 'laptop', name: 'Laptop', icon: '💻', subcategories: ['MacBook', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'] },
    { id: 'tablet', name: 'Tablet', icon: '📟', subcategories: ['iPad', 'Samsung Tab', 'Xiaomi Pad', 'Lenovo Tab'] },
    { id: 'phu-kien', name: 'Phụ kiện', icon: '🎧', subcategories: ['Tai nghe', 'Sạc dự phòng', 'Ốp lưng', 'Cáp sạc', 'Loa'] },
    { id: 'dong-ho', name: 'Đồng hồ', icon: '⌚', subcategories: ['Apple Watch', 'Samsung Watch', 'Xiaomi Watch', 'Garmin'] },
    { id: 'am-thanh', name: 'Âm thanh', icon: '🔊', subcategories: ['Loa bluetooth', 'Tai nghe', 'Soundbar', 'Micro'] },
  ]
  res.json({ categories })
})

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

async function start() {
  await getDb()
  app.listen(PORT, () => {
    console.log(`ShopABC API running on http://localhost:${PORT}`)
  })
}

start()
