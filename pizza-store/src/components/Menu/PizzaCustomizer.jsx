import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { sizes, extraToppings, calculatePrice } from '../../data/pizzas';

const PizzaCustomizer = ({ pizza, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const toggleTopping = (toppingName) => {
    setSelectedToppings(prev =>
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const currentPrice = calculatePrice(pizza.basePrice, selectedSize, selectedToppings);
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      pizzaId: pizza.id,
      name: pizza.name,
      size: selectedSize,
      toppings: selectedToppings,
      quantity,
      price: currentPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{pizza.name}</h2>
              <p className="text-gray-600 text-sm">{pizza.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Select Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sizes.map(size => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSize === size.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-semibold">{size.name}</div>
                  <div className="text-xs text-gray-500">{size.inches}"</div>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Extra Toppings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {extraToppings.map(topping => (
                <label
                  key={topping.name}
                  className="flex items-center p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes(topping.name)}
                    onChange={() => toggleTopping(topping.name)}
                    className="mr-2 w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm flex-1">{topping.name}</span>
                  <span className="text-xs text-gray-500">+${topping.price.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary and Add Button */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Price per pizza:</span>
              <span className="text-xl font-bold">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 font-semibold">Total:</span>
              <span className="text-2xl font-bold text-orange-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Add to Cart - ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizer;
