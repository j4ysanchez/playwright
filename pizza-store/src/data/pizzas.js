export const pizzas = [
  {
    id: 1,
    name: "Margherita",
    description: "Classic tomato sauce, fresh mozzarella, and basil",
    basePrice: 10,
    image: "🍕",
    category: "Classic"
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Tomato sauce, mozzarella, and pepperoni slices",
    basePrice: 12,
    image: "🍕",
    category: "Meat"
  },
  {
    id: 3,
    name: "Vegetarian",
    description: "Tomato sauce, mozzarella, bell peppers, mushrooms, and olives",
    basePrice: 11,
    image: "🍕",
    category: "Vegetarian"
  },
  {
    id: 4,
    name: "Hawaiian",
    description: "Tomato sauce, mozzarella, ham, and pineapple",
    basePrice: 12,
    image: "🍕",
    category: "Specialty"
  },
  {
    id: 5,
    name: "BBQ Chicken",
    description: "BBQ sauce, mozzarella, grilled chicken, and red onions",
    basePrice: 13,
    image: "🍕",
    category: "Specialty"
  },
  {
    id: 6,
    name: "Four Cheese",
    description: "Mozzarella, parmesan, gorgonzola, and ricotta",
    basePrice: 13,
    image: "🍕",
    category: "Classic"
  },
  {
    id: 7,
    name: "Meat Lovers",
    description: "Pepperoni, sausage, bacon, and ham",
    basePrice: 14,
    image: "🍕",
    category: "Meat"
  },
  {
    id: 8,
    name: "Mediterranean",
    description: "Feta cheese, olives, tomatoes, and spinach",
    basePrice: 12,
    image: "🍕",
    category: "Vegetarian"
  }
];

export const sizes = [
  { name: "Small", multiplier: 0.8, inches: 10 },
  { name: "Medium", multiplier: 1.0, inches: 12 },
  { name: "Large", multiplier: 1.3, inches: 14 },
  { name: "Extra Large", multiplier: 1.6, inches: 16 }
];

export const extraToppings = [
  { name: "Extra Cheese", price: 1.5 },
  { name: "Mushrooms", price: 1.0 },
  { name: "Olives", price: 1.0 },
  { name: "Bell Peppers", price: 1.0 },
  { name: "Onions", price: 0.75 },
  { name: "Pepperoni", price: 1.5 },
  { name: "Sausage", price: 1.5 },
  { name: "Bacon", price: 2.0 },
  { name: "Chicken", price: 2.0 },
  { name: "Jalapeños", price: 0.75 },
  { name: "Pineapple", price: 1.0 },
  { name: "Spinach", price: 1.0 }
];

export const calculatePrice = (basePrice, size, toppings) => {
  const sizeObj = sizes.find(s => s.name === size) || sizes[1]; // Default to Medium
  const toppingsCost = toppings.reduce((sum, toppingName) => {
    const topping = extraToppings.find(t => t.name === toppingName);
    return sum + (topping ? topping.price : 0);
  }, 0);

  return (basePrice * sizeObj.multiplier) + toppingsCost;
};
