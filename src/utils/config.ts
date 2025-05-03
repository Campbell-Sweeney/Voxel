import { AppConfig } from '../types';

// EDIT THESE VALUES TO CUSTOMIZE YOUR STORE
export const config: AppConfig = {
  // Change this password to your desired access code
  password: 'DontOD',
  
  // Edit this announcement text
  announcement: 'Welcome to Voxel - Special offers this week!',
  
  // Edit your products here
  products: [
    {
      id: 1,
      name: 'Product 1',
      price: 99.99,
      tax: 0.08, // 8% tax
      tariffs: 0.05, // 5% tariffs
      description: 'Description for Product 1'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 149.99,
      tax: 0.08,
      tariffs: 0.05,
      description: 'Description for Product 2'
    },
    {
      id: 3,
      name: 'Product 3',
      price: 199.99,
      tax: 0.08,
      tariffs: 0.05,
      description: 'Description for Product 3'
    },
    {
      id: 4,
      name: 'Product 4',
      price: 249.99,
      tax: 0.08,
      tariffs: 0.05,
      description: 'Description for Product 4'
    }
  ]
}; 