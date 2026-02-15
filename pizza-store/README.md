# Pizza Paradise - Online Pizza Store

A simple React-based online pizza store application with local filesystem storage for orders.

## Features

- 🍕 Browse pizza menu with 8 different pizzas
- 🎨 Customize pizzas with different sizes and toppings
- 🛒 Shopping cart with quantity management
- 💳 Checkout with customer information form
- 📁 Local filesystem storage for orders
- ✅ Order confirmation page

## Tech Stack

- **Frontend**: React 19, React Router, Tailwind CSS
- **Backend**: Express.js
- **Build Tool**: Vite
- **Storage**: Local filesystem (JSON files)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Option 1: Run both frontend and backend together (Recommended)

```bash
npm start
```

This will start:
- Frontend dev server on http://localhost:5173
- Backend API server on http://localhost:3001

### Option 2: Run separately

In one terminal, start the backend:
```bash
npm run server
```

In another terminal, start the frontend:
```bash
npm run dev
```

## How to Use

1. **Browse Menu**: View all available pizzas on the home page
2. **Customize Pizza**: Click "Customize & Add to Cart" on any pizza
   - Select size (Small, Medium, Large, Extra Large)
   - Add extra toppings
   - Choose quantity
   - Click "Add to Cart"
3. **View Cart**: Click the cart icon in the header to see your items
4. **Checkout**: Click "Proceed to Checkout" from the cart
5. **Complete Order**: Fill in delivery information and submit
6. **Confirmation**: View your order confirmation with order ID

## Order Storage

Orders are saved as JSON files in the `server/orders/` directory. Each order file contains:
- Order ID
- Customer information
- Order items with customizations
- Pricing breakdown (subtotal, tax, delivery fee)
- Timestamp
- Order status

Example order file: `order_1707924567890_abc123def.json`

## API Endpoints

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get a specific order by ID

## Project Structure

```
pizza-store/
├── server/
│   ├── index.js          # Express server
│   └── orders/           # Stored order files
├── src/
│   ├── components/
│   │   ├── Cart/         # Cart components
│   │   ├── Layout/       # Header & Footer
│   │   ├── Menu/         # Pizza menu components
│   │   └── Order/        # Order & checkout components
│   ├── context/
│   │   └── CartContext.jsx  # Global cart state
│   ├── data/
│   │   └── pizzas.js     # Pizza menu data
│   ├── App.jsx           # Main app with routing
│   └── main.jsx          # App entry point
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Run both frontend and backend concurrently
- `npm run dev` - Run frontend only
- `npm run server` - Run backend only
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Pizza Menu

1. **Margherita** - Classic tomato sauce, fresh mozzarella, and basil
2. **Pepperoni** - Tomato sauce, mozzarella, and pepperoni slices
3. **Vegetarian** - Tomato sauce, mozzarella, bell peppers, mushrooms, and olives
4. **Hawaiian** - Tomato sauce, mozzarella, ham, and pineapple
5. **BBQ Chicken** - BBQ sauce, mozzarella, grilled chicken, and red onions
6. **Four Cheese** - Mozzarella, parmesan, gorgonzola, and ricotta
7. **Meat Lovers** - Pepperoni, sausage, bacon, and ham
8. **Mediterranean** - Feta cheese, olives, tomatoes, and spinach

## Pricing

- Base prices: $10 - $14 per pizza
- Size multipliers:
  - Small (10"): 0.8x base price
  - Medium (12"): 1.0x base price
  - Large (14"): 1.3x base price
  - Extra Large (16"): 1.6x base price
- Extra toppings: $0.75 - $2.00 each
- Tax: 8%
- Delivery fee: $3.99

## License

MIT
