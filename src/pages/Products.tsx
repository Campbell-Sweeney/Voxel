import { useState } from 'react';
import { config } from '../utils/config';
import { CartItem } from '../types';

interface ProductsProps {
  addToCart: (product: CartItem) => void;
}

export const Products = ({ addToCart }: ProductsProps) => {
  const [products, setProducts] = useState(config.products);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const calculateTotalPrice = (price: number, tax: number, tariffs: number) => {
    return price * (1 + tax + tariffs);
  };

  const handleImageUpload = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === productId
              ? { ...product, image: base64String }
              : product
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-darker text-white p-8">
      <div className="container mx-auto">
        {/* Announcement Bar */}
        <div className="bg-accent text-white p-4 rounded-lg mb-8 text-center">
          {config.announcement}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-dark p-6 rounded-lg shadow-lg"
            >
              {/* Image Upload and Display */}
              <div className="mb-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-48 bg-darker rounded-lg flex items-center justify-center mb-2">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => handleImageUpload(product.id, e)}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-blue-600"
                />
              </div>

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
                className="w-full bg-accent text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 