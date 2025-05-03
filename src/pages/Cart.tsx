import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

export const Cart = ({ cartItems, removeFromCart, updateQuantity }: CartProps) => {
  const calculateItemTotal = (item: CartItem) => {
    return item.price * (1 + item.tax + item.tariffs) * item.quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleSendOrder = () => {
    // In a real application, this would send the order to a backend
    alert('Order sent to admin!');
  };

  return (
    <div className="min-h-screen bg-darker text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <p className="text-gray-400">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark p-4 rounded-lg flex items-center space-x-4"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-darker rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-gray-400">
                      ${calculateItemTotal(item).toFixed(2)} (${item.price.toFixed(2)} × {item.quantity})
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 bg-darker border border-gray-700 rounded-md text-white px-2 py-1"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-dark p-4 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total:</span>
                <span className="text-2xl font-bold">${calculateCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSendOrder}
              className="w-full bg-accent text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Send Order to Admin
            </button>
          </>
        )}
      </div>
    </div>
  );
}; 