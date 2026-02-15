import { useState } from 'react';
import PizzaCustomizer from './PizzaCustomizer';

const PizzaCard = ({ pizza }) => {
  const [showCustomizer, setShowCustomizer] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
          <div className="text-6xl text-center mb-4">{pizza.image}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{pizza.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{pizza.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-orange-600">
              ${pizza.basePrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {pizza.category}
            </span>
          </div>
          <button
            onClick={() => setShowCustomizer(true)}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Customize & Add to Cart
          </button>
        </div>
      </div>

      {showCustomizer && (
        <PizzaCustomizer
          pizza={pizza}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </>
  );
};

export default PizzaCard;
