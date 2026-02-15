import { pizzas } from '../../data/pizzas';
import PizzaCard from './PizzaCard';

const PizzaList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Pizzas</h1>
        <p className="text-gray-600">Choose your favorite and customize it to your taste!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pizzas.map(pizza => (
          <PizzaCard key={pizza.id} pizza={pizza} />
        ))}
      </div>
    </div>
  );
};

export default PizzaList;
