import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PizzaList from './components/Menu/PizzaList';
import Cart from './components/Cart/Cart';
import OrderForm from './components/Order/OrderForm';
import OrderConfirmation from './components/Order/OrderConfirmation';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<PizzaList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<OrderForm />} />
              <Route path="/confirmation" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
