import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartSummary = () => {
  const { getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-orange-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        disabled={getCartCount() === 0}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
