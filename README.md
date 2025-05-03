# Voxel - Minimalist Store

A dark, minimalist e-commerce website with password protection and simple product management.

## Features

- Password-protected access
- Dark, minimalist design
- Responsive layout
- Product catalog with tax and tariff calculations
- Shopping cart functionality
- Easy-to-edit configuration

## Customization

### Password
Edit the password in `src/utils/config.ts`:
```typescript
export const config: AppConfig = {
  password: 'your-password-here',
  // ...
};
```

### Products
Edit products in `src/utils/config.ts`:
```typescript
export const config: AppConfig = {
  // ...
  products: [
    {
      id: 1,
      name: 'Product Name',
      price: 99.99,
      tax: 0.08, // 8% tax
      tariffs: 0.05, // 5% tariffs
      description: 'Product description'
    },
    // Add more products...
  ]
};
```

### Announcement
Edit the announcement text in `src/utils/config.ts`:
```typescript
export const config: AppConfig = {
  // ...
  announcement: 'Your announcement text here',
  // ...
};
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- React Router
- Vite 