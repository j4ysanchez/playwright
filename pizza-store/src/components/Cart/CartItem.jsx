import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-600">Size: {item.size}</p>
        {item.toppings.length > 0 && (
          <p className="text-sm text-gray-600">
            Toppings: {item.toppings.join(', ')}
          </p>
        )}
        <p className="text-sm font-semibold text-orange-600 mt-1">
          ${item.price.toFixed(2)} each
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 font-bold text-sm"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 font-bold text-sm"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-xs text-red-500 hover:text-red-700 mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
