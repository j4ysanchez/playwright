import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ensure orders directory exists
const ordersDir = join(__dirname, 'orders');
await fs.mkdir(ordersDir, { recursive: true });

// POST endpoint to save orders
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    const timestamp = new Date().toISOString();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const orderData = {
      id: orderId,
      ...order,
      timestamp,
      status: 'pending'
    };

    const filename = `${orderId}.json`;
    const filepath = join(ordersDir, filename);

    await fs.writeFile(filepath, JSON.stringify(orderData, null, 2));

    console.log(`Order saved: ${filename}`);
    res.json({
      success: true,
      orderId,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save order'
    });
  }
});

// GET endpoint to retrieve all orders
app.get('/api/orders', async (req, res) => {
  try {
    const files = await fs.readdir(ordersDir);
    const orders = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const content = await fs.readFile(join(ordersDir, file), 'utf-8');
          return JSON.parse(content);
        })
    );

    res.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read orders'
    });
  }
});

// GET endpoint to retrieve a specific order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const filepath = join(ordersDir, `${orderId}.json`);
    const content = await fs.readFile(filepath, 'utf-8');
    const order = JSON.parse(content);

    res.json(order);
  } catch (error) {
    console.error('Error reading order:', error);
    res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Pizza Store API server running on http://localhost:${PORT}`);
  console.log(`Orders will be saved to: ${ordersDir}`);
});
