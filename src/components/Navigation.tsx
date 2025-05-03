import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav className="bg-dark p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/products" className="text-white text-xl font-bold">
          Voxel
        </Link>
        <div className="space-x-4">
          <Link
            to="/products"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Products
          </Link>
          <Link
            to="/blog"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/cart"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}; 