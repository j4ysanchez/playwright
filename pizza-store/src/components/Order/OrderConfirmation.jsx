import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your order. Your delicious pizzas are being prepared!
        </p>

        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-lg font-mono font-semibold text-orange-600">
            {orderId}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">1.</span>
              <span>We'll send you an email confirmation shortly</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">2.</span>
              <span>Your order is being prepared by our chefs</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">3.</span>
              <span>Estimated delivery time: 30-45 minutes</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">4.</span>
              <span>A delivery driver will bring your order to your door</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Order More Pizzas
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
