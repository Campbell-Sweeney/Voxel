const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ADMIN_PASSWORD = 'Voxelpagel';

app.use(cors());
app.use(bodyParser.json());

// Helper to read products
function readProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper to write products
function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Get all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Admin authentication middleware
function requireAdmin(req, res, next) {
  const { adminPassword } = req.body;
  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}

// Create product
app.post('/api/products', requireAdmin, (req, res) => {
  const products = readProducts();
  const newProduct = req.body.product;
  products.push(newProduct);
  writeProducts(products);
  res.json({ success: true, products });
});

// Edit product
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const updatedProduct = req.body.product;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  products[idx] = updatedProduct;
  writeProducts(products);
  res.json({ success: true, products });
});

// Delete product
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  let products = readProducts();
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  writeProducts(products);
  res.json({ success: true, products });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 