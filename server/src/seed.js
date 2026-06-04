import { getDb, run, get } from './db.js'
import bcrypt from 'bcryptjs'

async function seed() {
  await getDb()

  const hash = bcrypt.hashSync('admin1122', 10)
  const existing = get('SELECT id FROM users WHERE username = ?', ['admin1122'])
  if (!existing) {
    run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['admin1122', 'admin@shopabc.com', hash, 'admin'])
  }
  const u2 = get('SELECT id FROM users WHERE username = ?', ['user1'])
  if (!u2) {
    run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['user1', 'user1@shopabc.com', bcrypt.hashSync('123456', 10), 'user'])
  }

  const categories = [
    { id: 'dien-thoai', name: 'Dien thoai', icon: 'phone', subcategories: ['iPhone', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'] },
    { id: 'laptop', name: 'Laptop', icon: 'laptop', subcategories: ['MacBook', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'] },
    { id: 'tablet', name: 'Tablet', icon: 'tablet', subcategories: ['iPad', 'Samsung Tab', 'Xiaomi Pad', 'Lenovo Tab'] },
    { id: 'phu-kien', name: 'Phu kien', icon: 'headphones', subcategories: ['Tai nghe', 'Sac du phong', 'Op lung', 'Cap sac', 'Loa'] },
    { id: 'dong-ho', name: 'Dong ho', icon: 'clock', subcategories: ['Apple Watch', 'Samsung Watch', 'Xiaomi Watch', 'Garmin'] },
    { id: 'am-thanh', name: 'Am thanh', icon: 'speaker', subcategories: ['Loa bluetooth', 'Tai nghe', 'Soundbar', 'Micro'] },
  ]

  for (const c of categories) {
    const exists = get('SELECT id FROM categories WHERE id = ?', [c.id])
    if (!exists) {
      run('INSERT INTO categories (id, name, slug, icon, subcategories) VALUES (?, ?, ?, ?, ?)',
        [c.id, c.name, c.id, c.icon, JSON.stringify(c.subcategories)])
    }
  }

  const products = [
    { name: 'iPhone 16 Pro Max 256GB', price: 34990000, originalPrice: 37990000, brand: 'Apple', category: 'dien-thoai', discount: 8, image: 'https://cdn.tgdd.vn/Products/Images/42/329163/iphone-16-pro-max-256gb-titan-sa-mac-1.jpg', rating: 5, reviewCount: 128, specs: { Chip: 'A18 Pro', RAM: '8GB', Battery: '4685mAh' } },
    { name: 'Samsung Galaxy S25 Ultra', price: 29990000, originalPrice: 32990000, brand: 'Samsung', category: 'dien-thoai', discount: 9, image: 'https://cdn.tgdd.vn/Products/Images/42/335177/samsung-galaxy-s25-ultra-1.jpg', rating: 5, reviewCount: 95, specs: { Chip: 'Snapdragon 8 Gen 4', RAM: '12GB', Battery: '5000mAh' } },
    { name: 'MacBook Pro 14" M4 Pro', price: 45990000, originalPrice: 49990000, brand: 'Apple', category: 'laptop', discount: 8, image: 'https://cdn.tgdd.vn/Products/Images/44/309549/macbook-pro-14-m4-pro-1.jpg', rating: 5, reviewCount: 67, specs: { CPU: 'M4 Pro', RAM: '18GB', SSD: '512GB' } },
    { name: 'Dell XPS 15', price: 32990000, originalPrice: 35990000, brand: 'Dell', category: 'laptop', discount: 8, image: 'https://cdn.tgdd.vn/Products/Images/44/319612/dell-xps-15-9530-1.jpg', rating: 4, reviewCount: 34, specs: { CPU: 'Core i7-13700H', RAM: '16GB', SSD: '512GB' } },
    { name: 'iPad Pro M4 11"', price: 24990000, originalPrice: 26990000, brand: 'Apple', category: 'tablet', discount: 7, image: 'https://cdn.tgdd.vn/Products/Images/522/302663/ipad-pro-m4-11-inch-1.jpg', rating: 5, reviewCount: 52, specs: { Chip: 'M4', RAM: '8GB', Battery: '7500mAh' } },
    { name: 'Samsung Galaxy Tab S10 Ultra', price: 22990000, originalPrice: 24990000, brand: 'Samsung', category: 'tablet', discount: 8, image: 'https://cdn.tgdd.vn/Products/Images/522/315895/samsung-galaxy-tab-s10-ultra-1.jpg', rating: 4, reviewCount: 28, specs: { Chip: 'Dimensity 9300+', RAM: '12GB', Battery: '11200mAh' } },
    { name: 'AirPods Pro 2 USB-C', price: 6490000, originalPrice: 6990000, brand: 'Apple', category: 'am-thanh', discount: 7, image: 'https://cdn.tgdd.vn/Products/Images/54/309113/airpods-pro-2-usb-c-1.jpg', rating: 5, reviewCount: 203, specs: { ANC: 'Yes', Battery: '6h' } },
    { name: 'Apple Watch Ultra 2', price: 21990000, originalPrice: 23990000, brand: 'Apple', category: 'dong-ho', discount: 8, image: 'https://cdn.tgdd.vn/Products/Images/707/310154/apple-watch-ultra-2-1.jpg', rating: 5, reviewCount: 41, specs: { Display: '49mm', Chip: 'S9', Battery: '36h' } },
    { name: 'Samsung Galaxy Watch 7', price: 8990000, originalPrice: 9990000, brand: 'Samsung', category: 'dong-ho', discount: 10, image: 'https://cdn.tgdd.vn/Products/Images/707/332441/samsung-galaxy-watch7-1.jpg', rating: 4, reviewCount: 56, specs: { Display: '44mm', Chip: 'Exynos W1000', Battery: '2 days' } },
    { name: 'JBL Flip 6', price: 3290000, originalPrice: 3690000, brand: 'JBL', category: 'am-thanh', discount: 11, image: 'https://cdn.tgdd.vn/Products/Images/2162/252447/jbl-flip-6-1.jpg', rating: 4, reviewCount: 178, specs: { Power: '30W', Battery: '12h', Waterproof: 'IP67' } },
    { name: 'Xiaomi 14T Pro', price: 14990000, originalPrice: 16990000, brand: 'Xiaomi', category: 'dien-thoai', discount: 12, image: 'https://cdn.tgdd.vn/Products/Images/42/329158/xiaomi-14t-pro-1.jpg', rating: 4, reviewCount: 73, specs: { Chip: 'Dimensity 9300+', RAM: '12GB', Battery: '5000mAh' } },
    { name: 'OPPO Find N5 Fold', price: 39990000, originalPrice: 42990000, brand: 'OPPO', category: 'dien-thoai', discount: 7, image: 'https://cdn.tgdd.vn/Products/Images/42/331712/oppo-find-n5-1.jpg', rating: 4, reviewCount: 19, specs: { Chip: 'Snapdragon 8 Gen 4', RAM: '16GB', Battery: '5600mAh' } },
  ]

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const exists = get('SELECT id FROM products WHERE slug = ?', [slug])
    if (!exists) {
      run(`INSERT INTO products (name, slug, price, originalPrice, brand, category, discount, image, rating, reviewCount, specs, colors)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, slug, p.price, p.originalPrice || p.price, p.brand, p.category, p.discount || 0, p.image, p.rating || 0, p.reviewCount || 0, JSON.stringify(p.specs || {}), JSON.stringify(p.colors || [])])
    }
  }

  console.log('Seed data inserted successfully!')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
