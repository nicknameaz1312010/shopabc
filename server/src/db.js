import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'shopabc.db')

let db = null

export async function getDb() {
  if (db) return db
  const SQL = await initSqlJs()
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  db.run('PRAGMA foreign_keys = ON')
  initSchema()
  saveDb()
  return db
}

function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'user',
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT,
      icon TEXT DEFAULT '📦',
      subcategories TEXT DEFAULT '[]'
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT,
      price REAL NOT NULL,
      originalPrice REAL,
      brand TEXT DEFAULT '',
      category TEXT DEFAULT '',
      description TEXT DEFAULT '',
      discount INTEGER DEFAULT 0,
      inStock INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      image TEXT DEFAULT '',
      colors TEXT DEFAULT '[]',
      specs TEXT DEFAULT '{}',
      rating REAL DEFAULT 0,
      reviewCount INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId INTEGER,
      items TEXT DEFAULT '[]',
      subtotal REAL DEFAULT 0,
      shipping REAL DEFAULT 0,
      total REAL DEFAULT 0,
      payment TEXT DEFAULT 'cod',
      status TEXT DEFAULT 'pending',
      shippingInfo TEXT DEFAULT '{}',
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `)
}

function saveDb() {
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(DB_PATH, buffer)
}

export function query(sql, params = []) {
  const stmt = db.prepare(sql)
  if (params.length > 0) stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

export function get(sql, params = []) {
  const rows = query(sql, params)
  return rows.length > 0 ? rows[0] : null
}

export function run(sql, params = []) {
  db.run(sql, params)
  saveDb()
  return { changes: db.getRowsModified(), lastInsertRowid: query('SELECT last_insert_rowid() as id')[0]?.id }
}

export default { getDb, query, get, run }
