import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PasswordScreen } from './components/PasswordScreen';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { CartItem } from './types';

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  if (!isAuthenticated) {
    return <PasswordScreen onPasswordCorrect={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-darker flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route
              path="/products"
              element={<Products addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              }
            />
            <Route path="/blog" element={<div className="min-h-screen bg-darker text-white p-8">
              <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-4">Blog</h1>
                <p className="text-gray-400">Coming soon...</p>
              </div>
            </div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}; 