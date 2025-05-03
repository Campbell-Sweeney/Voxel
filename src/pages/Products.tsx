import { useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface ProductsProps {
  addToCart: (product: CartItem) => void;
  isAdmin?: boolean;
}

const ADMIN_PASSWORD = 'Voxelpagel';

export const Products = ({ addToCart, isAdmin }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', price: 0, tax: 0, tariffs: 0, description: '', image: ''
  });
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const calculateTotalPrice = (price: number, tax: number, tariffs: number) => {
    return price * (1 + tax + tariffs);
  };

  // Helper: Upload image and return URL
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.imageUrl;
  };

  // Admin: Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';
    try {
      if (addImageFile) {
        imageUrl = await uploadImage(addImageFile);
      }
      await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: { ...newProduct, image: imageUrl }, adminPassword: ADMIN_PASSWORD })
      });
      setShowAdd(false);
      setNewProduct({ name: '', price: 0, tax: 0, tariffs: 0, description: '', image: '' });
      setAddImageFile(null);
      setAddImagePreview(null);
      setNotification('Product added successfully!');
      setError(null);
      fetchProducts();
    } catch (err) {
      setError('Failed to add product.');
      setNotification(null);
    }
  };

  // Admin: Edit Product
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = editProduct.image || '';
    try {
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }
      await fetch(`http://localhost:4000/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: { ...editProduct, image: imageUrl }, adminPassword: ADMIN_PASSWORD })
      });
      setEditingId(null);
      setEditProduct({});
      setEditImageFile(null);
      setEditImagePreview(null);
      setNotification('Product updated successfully!');
      setError(null);
      fetchProducts();
    } catch (err) {
      setError('Failed to update product.');
      setNotification(null);
    }
  };

  // Admin: Delete Product
  const handleDeleteProduct = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: ADMIN_PASSWORD })
      });
      setNotification('Product deleted.');
      setError(null);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product.');
      setNotification(null);
    }
  };

  // Image preview handlers
  const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAddImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAddImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAddImagePreview(null);
    }
  };
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setEditImagePreview(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-darker text-white p-8 flex items-center justify-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-darker text-white p-8">
      <div className="container mx-auto">
        {/* Admin Dashboard Header */}
        {isAdmin && (
          <div className="mb-8 p-6 rounded-xl bg-dark/80 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-1 flex items-center gap-2">
                <span>🛠️</span> Admin Dashboard
              </h2>
              <p className="text-gray-400">Manage your products below.</p>
            </div>
            <div className="text-lg text-accent font-semibold">{products.length} Products</div>
          </div>
        )}

        {/* Notifications */}
        {notification && <div className="mb-4 p-3 bg-green-700/80 text-white rounded shadow">{notification}</div>}
        {error && <div className="mb-4 p-3 bg-red-700/80 text-white rounded shadow">{error}</div>}

        {/* Announcement Bar */}
        <div className="bg-gradient-to-r from-accent to-blue-600 text-white p-6 rounded-xl mb-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Group Discounts Available!</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-lg">
            <div className="flex items-center">
              <span className="font-bold">$115</span>
              <span className="mx-2">for</span>
              <span>2-4 people</span>
            </div>
            <div className="hidden md:block text-white/50">•</div>
            <div className="flex items-center">
              <span className="font-bold">$100</span>
              <span className="mx-2">for</span>
              <span>4-7 people</span>
            </div>
            <div className="hidden md:block text-white/50">•</div>
            <div className="flex items-center">
              <span className="font-bold">$80</span>
              <span className="mx-2">for</span>
              <span>8+ people</span>
            </div>
          </div>
        </div>

        {/* Admin Add Product */}
        {isAdmin && (
          <div className="mb-8">
            {!showAdd ? (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => setShowAdd(true)}
              >
                Add Product
              </button>
            ) : (
              <form onSubmit={handleAddProduct} className="flex flex-wrap gap-4 items-center bg-dark p-6 rounded-lg mt-4 shadow-lg">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Name</label>
                  <input required placeholder="Name" className="px-2 py-1 rounded bg-darker text-white" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Price</label>
                  <input required type="number" step="0.01" placeholder="Price" className="px-2 py-1 rounded bg-darker text-white" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: parseFloat(e.target.value) }))} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Tax</label>
                  <input required type="number" step="0.01" placeholder="Tax" className="px-2 py-1 rounded bg-darker text-white" value={newProduct.tax} onChange={e => setNewProduct(p => ({ ...p, tax: parseFloat(e.target.value) }))} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Tariffs</label>
                  <input required type="number" step="0.01" placeholder="Tariffs" className="px-2 py-1 rounded bg-darker text-white" value={newProduct.tariffs} onChange={e => setNewProduct(p => ({ ...p, tariffs: parseFloat(e.target.value) }))} />
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="font-semibold">Description</label>
                  <input required placeholder="Description" className="px-2 py-1 rounded bg-darker text-white" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="font-semibold">Product Image</label>
                  <label className="flex flex-col items-center justify-center px-4 py-2 bg-accent text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                    <span className="material-icons">cloud_upload</span>
                    <span>{addImageFile ? addImageFile.name : 'Choose Image'}</span>
                    <input type="file" accept="image/*" onChange={handleAddImageChange} className="hidden" />
                  </label>
                  {addImagePreview && <img src={addImagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border-2 border-accent" />}
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white font-semibold">Save</button>
                  <button type="button" className="bg-gray-600 px-4 py-2 rounded text-white font-semibold mt-2" onClick={() => { setShowAdd(false); setAddImageFile(null); setAddImagePreview(null); }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-dark p-6 rounded-lg shadow-lg"
            >
              {/* Image Display */}
              <div className="mb-4 flex flex-col items-center">
                {product.image ? (
                  <img
                    src={`http://localhost:4000${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-2 border-2 border-accent"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : (
                  <img
                    src={`/images/${product.id}.png`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-2 border-2 border-gray-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                )}
                <div
                  className="w-full h-48 bg-darker rounded-lg flex items-center justify-center mb-2"
                  style={{ display: 'none' }}
                >
                  <span className="text-gray-500">No image</span>
                </div>
              </div>

              {isAdmin && editingId === product.id ? (
                <form onSubmit={handleEditProduct} className="flex flex-col gap-2 mb-2">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Name</label>
                    <input required className="px-2 py-1 rounded bg-darker text-white" value={editProduct.name ?? ''} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Price</label>
                    <input required type="number" step="0.01" className="px-2 py-1 rounded bg-darker text-white" value={editProduct.price ?? 0} onChange={e => setEditProduct(p => ({ ...p, price: parseFloat(e.target.value) }))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Tax</label>
                    <input required type="number" step="0.01" className="px-2 py-1 rounded bg-darker text-white" value={editProduct.tax ?? 0} onChange={e => setEditProduct(p => ({ ...p, tax: parseFloat(e.target.value) }))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Tariffs</label>
                    <input required type="number" step="0.01" className="px-2 py-1 rounded bg-darker text-white" value={editProduct.tariffs ?? 0} onChange={e => setEditProduct(p => ({ ...p, tariffs: parseFloat(e.target.value) }))} />
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <label className="font-semibold">Description</label>
                    <input required className="px-2 py-1 rounded bg-darker text-white" value={editProduct.description ?? ''} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <label className="font-semibold">Product Image</label>
                    <label className="flex flex-col items-center justify-center px-4 py-2 bg-accent text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <span className="material-icons">cloud_upload</span>
                      <span>{editImageFile ? editImageFile.name : 'Choose New Image'}</span>
                      <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                    </label>
                    {/* Show preview if new image selected, else show current image */}
                    {editImagePreview ? (
                      <img src={editImagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border-2 border-accent" />
                    ) : (editProduct.image ? (
                      <img src={`http://localhost:4000${editProduct.image}`} alt="Current" className="mt-2 w-32 h-32 object-cover rounded-lg border-2 border-accent" />
                    ) : null)}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white font-semibold">Save</button>
                    <button type="button" className="bg-gray-600 px-4 py-2 rounded text-white font-semibold" onClick={() => { setEditingId(null); setEditProduct({}); setEditImageFile(null); setEditImagePreview(null); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="mb-4">
                    <p className="text-gray-400">Base Price: ${product.price.toFixed(2)}</p>
                    <p className="text-gray-400">Tax: {(product.tax * 100).toFixed(0)}%</p>
                    <p className="text-gray-400">Tariffs: {(product.tariffs * 100).toFixed(0)}%</p>
                    <p className="text-white font-bold mt-2">
                      Total: ${calculateTotalPrice(product.price, product.tax, product.tariffs).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart({ ...product, quantity: 1 })}
                    className="w-full bg-accent text-white py-2 rounded-md hover:bg-blue-600 transition-colors mb-2"
                  >
                    <span className="material-icons">add_shopping_cart</span> Add to Cart
                  </button>
                  {isAdmin && (
                    <div className="flex gap-2 mt-2">
                      <button className="bg-yellow-600 px-3 py-1 rounded text-white flex items-center gap-1" onClick={() => { setEditingId(product.id); setEditProduct(product); setEditImageFile(null); setEditImagePreview(null); }}><span className="material-icons">edit</span>Edit</button>
                      <button className="bg-red-600 px-3 py-1 rounded text-white flex items-center gap-1" onClick={() => handleDeleteProduct(product.id)}><span className="material-icons">delete</span>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 