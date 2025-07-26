import { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish with eggs, cheese, and bacon',
    cookingTime: 20,
    servings: 4,
    difficulty: 'Medium',
    category: 'Pasta',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
    ingredients: [
      { name: 'spaghetti', quantity: 400, unit: 'g' },
      { name: 'eggs', quantity: 4, unit: 'pieces' },
      { name: 'parmesan cheese', quantity: 100, unit: 'g' },
      { name: 'bacon', quantity: 200, unit: 'g' },
      { name: 'black pepper', quantity: 1, unit: 'tsp' },
      { name: 'salt', quantity: 1, unit: 'tsp' }
    ],
    instructions: [
      'Cook spaghetti according to package instructions',
      'Fry bacon until crispy',
      'Beat eggs with grated parmesan',
      'Combine hot pasta with bacon',
      'Add egg mixture and toss quickly',
      'Season with pepper and serve immediately'
    ]
  },
  {
    id: '2',
    name: 'Chicken Stir Fry',
    description: 'Quick and healthy stir-fried chicken with vegetables',
    cookingTime: 15,
    servings: 3,
    difficulty: 'Easy',
    category: 'Asian',
    image: 'https://images.pexels.com/photos/2233351/pexels-photo-2233351.jpeg?auto=compress&cs=tinysrgb&w=300',
    ingredients: [
      { name: 'chicken breast', quantity: 500, unit: 'g' },
      { name: 'bell peppers', quantity: 2, unit: 'pieces' },
      { name: 'onion', quantity: 1, unit: 'pieces' },
      { name: 'soy sauce', quantity: 3, unit: 'tbsp' },
      { name: 'garlic', quantity: 3, unit: 'cloves' },
      { name: 'vegetable oil', quantity: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Heat oil in wok or large pan',
      'Stir-fry chicken until cooked through',
      'Add vegetables and cook until tender-crisp',
      'Add soy sauce and garlic',
      'Serve immediately over rice'
    ]
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with classic Caesar dressing',
    cookingTime: 10,
    servings: 2,
    difficulty: 'Easy',
    category: 'Salad',
    image: 'https://images.pexels.com/photos/2533348/pexels-photo-2533348.jpeg?auto=compress&cs=tinysrgb&w=300',
    ingredients: [
      { name: 'romaine lettuce', quantity: 2, unit: 'heads' },
      { name: 'parmesan cheese', quantity: 50, unit: 'g' },
      { name: 'croutons', quantity: 1, unit: 'cup' },
      { name: 'caesar dressing', quantity: 4, unit: 'tbsp' },
      { name: 'lemon', quantity: 1, unit: 'pieces' }
    ],
    instructions: [
      'Wash and chop romaine lettuce',
      'Toss lettuce with Caesar dressing',
      'Add grated parmesan cheese',
      'Top with croutons',
      'Squeeze fresh lemon juice over salad',
      'Serve immediately'
    ]
  },
  {
    id: '4',
    name: 'Beef Tacos',
    description: 'Spicy ground beef tacos with fresh toppings',
    cookingTime: 25,
    servings: 4,
    difficulty: 'Easy',
    category: 'Mexican',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=300',
    ingredients: [
      { name: 'ground beef', quantity: 500, unit: 'g' },
      { name: 'taco shells', quantity: 8, unit: 'pieces' },
      { name: 'tomatoes', quantity: 2, unit: 'pieces' },
      { name: 'lettuce', quantity: 1, unit: 'head' },
      { name: 'cheese', quantity: 200, unit: 'g' },
      { name: 'onion', quantity: 1, unit: 'pieces' }
    ],
    instructions: [
      'Brown ground beef in large skillet',
      'Season with taco seasoning',
      'Warm taco shells in oven',
      'Prepare fresh toppings',
      'Fill shells with beef and toppings',
      'Serve with salsa and sour cream'
    ]
  },
  {
    id: '5',
    name: 'Vegetable Curry',
    description: 'Aromatic curry with mixed vegetables and coconut milk',
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    category: 'Indian',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
    ingredients: [
      { name: 'coconut milk', quantity: 400, unit: 'ml' },
      { name: 'potatoes', quantity: 3, unit: 'pieces' },
      { name: 'carrots', quantity: 2, unit: 'pieces' },
      { name: 'curry powder', quantity: 2, unit: 'tbsp' },
      { name: 'onion', quantity: 1, unit: 'pieces' },
      { name: 'garlic', quantity: 4, unit: 'cloves' },
      { name: 'ginger', quantity: 1, unit: 'inch' }
    ],
    instructions: [
      'Sauté onion, garlic, and ginger',
      'Add curry powder and cook until fragrant',
      'Add chopped vegetables',
      'Pour in coconut milk',
      'Simmer until vegetables are tender',
      'Serve with rice or naan bread'
    ]
  }
];