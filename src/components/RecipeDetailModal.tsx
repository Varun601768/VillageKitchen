import React, { useState, useMemo } from 'react';
import { Clock, Users, ChefHat, ShoppingCart, Package, Search, Filter, Star, AlertTriangle } from 'lucide-react';

// Types
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
}

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
}

interface RecipeMatch {
  recipe: Recipe;
  matchedIngredients: number;
  totalIngredients: number;
  matchPercentage: number;
  missingIngredients: Ingredient[];
  availableIngredients: string[];
  canCook: boolean;
}

// Mock data
const mockRecipes: Recipe[] = [
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

const mockPantryItems: PantryItem[] = [
  { id: '1', name: 'eggs', quantity: 6, unit: 'pieces', category: 'Dairy', expiryDate: '2025-08-01' },
  { id: '2', name: 'spaghetti', quantity: 500, unit: 'g', category: 'Pasta', expiryDate: '2025-12-01' },
  { id: '3', name: 'parmesan cheese', quantity: 150, unit: 'g', category: 'Dairy', expiryDate: '2025-08-15' },
  { id: '4', name: 'chicken breast', quantity: 800, unit: 'g', category: 'Meat', expiryDate: '2025-07-26' },
  { id: '5', name: 'onion', quantity: 3, unit: 'pieces', category: 'Vegetables', expiryDate: '2025-08-10' },
  { id: '6', name: 'bell peppers', quantity: 4, unit: 'pieces', category: 'Vegetables', expiryDate: '2025-07-28' },
  { id: '7', name: 'tomatoes', quantity: 5, unit: 'pieces', category: 'Vegetables', expiryDate: '2025-07-30' },
  { id: '8', name: 'lettuce', quantity: 2, unit: 'head', category: 'Vegetables', expiryDate: '2025-07-27' },
  { id: '9', name: 'garlic', quantity: 1, unit: 'bulb', category: 'Vegetables', expiryDate: '2025-08-20' }
];

// Utility functions
const normalizeIngredientName = (name: string): string => {
  return name.toLowerCase().trim()
    .replace(/s$/, '') // Remove plural 's'
    .replace(/\b(fresh|dried|ground|chopped|sliced)\b/g, '') // Remove common modifiers
    .trim();
};

const findMatchingPantryItem = (ingredient: Ingredient, pantryItems: PantryItem[]): PantryItem | null => {
  const normalizedIngredient = normalizeIngredientName(ingredient.name);
  
  return pantryItems.find(item => {
    const normalizedPantryItem = normalizeIngredientName(item.name);
    return normalizedPantryItem.includes(normalizedIngredient) || 
           normalizedIngredient.includes(normalizedPantryItem);
  }) || null;
};

const calculateRecipeMatches = (recipes: Recipe[], pantryItems: PantryItem[]): RecipeMatch[] => {
  return recipes.map(recipe => {
    const availableIngredients: string[] = [];
    const missingIngredients: Ingredient[] = [];
    
    recipe.ingredients.forEach(ingredient => {
      const matchingPantryItem = findMatchingPantryItem(ingredient, pantryItems);
      if (matchingPantryItem && matchingPantryItem.quantity >= ingredient.quantity) {
        availableIngredients.push(ingredient.name);
      } else {
        missingIngredients.push(ingredient);
      }
    });
    
    const matchedIngredients = availableIngredients.length;
    const totalIngredients = recipe.ingredients.length;
    const matchPercentage = Math.round((matchedIngredients / totalIngredients) * 100);
    const canCook = matchPercentage === 100;
    
    return {
      recipe,
      matchedIngredients,
      totalIngredients,
      matchPercentage,
      missingIngredients,
      availableIngredients,
      canCook
    };
  });
};

const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Components
const RecipeCard: React.FC<{
  recipeMatch: RecipeMatch;
  onCook: (recipeId: string) => void;
  onAddToShoppingList: (recipeId: string) => void;
}> = ({ recipeMatch, onCook, onAddToShoppingList }) => {
  const { recipe, matchedIngredients, totalIngredients, matchPercentage, missingIngredients, canCook } = recipeMatch;
  
  const getMatchColor = () => {
    if (matchPercentage >= 80) return 'text-green-600 bg-green-100';
    if (matchPercentage >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getDifficultyColor = () => {
    switch (recipe.difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor()}`}>
            {matchedIngredients}/{totalIngredients} ingredients
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
        
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {recipe.cookingTime} min
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {recipe.servings} servings
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
            {recipe.difficulty}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                matchPercentage >= 80 ? 'bg-green-500' :
                matchPercentage >= 60 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">{matchPercentage}% ingredients available</p>
        </div>
        
        {missingIngredients.length > 0 && (
          <div className="mb-3 p-2 bg-red-50 rounded-md">
            <p className="text-xs font-medium text-red-700 mb-1">Missing ingredients:</p>
            <p className="text-xs text-red-600">
              {missingIngredients.map(ing => `${ing.name} (${ing.quantity} ${ing.unit})`).join(', ')}
            </p>
          </div>
        )}
        
        <div className="flex space-x-2">
          {canCook ? (
            <button
              onClick={() => onCook(recipe.id)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <ChefHat className="w-4 h-4 mr-2" />
              Cook This
            </button>
          ) : (
            <button
              onClick={() => onAddToShoppingList(recipe.id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PantryItemCard: React.FC<{ item: PantryItem }> = ({ item }) => {
  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
  const isExpiringSoon = daysUntilExpiry <= 3;
  const isExpired = daysUntilExpiry < 0;
  
  return (
    <div className={`p-3 rounded-lg border ${
      isExpired ? 'border-red-200 bg-red-50' : 
      isExpiringSoon ? 'border-amber-200 bg-amber-50' : 
      'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-600" />
          <span className="font-medium capitalize">{item.name}</span>
        </div>
        {(isExpired || isExpiringSoon) && (
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        )}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>{item.quantity} {item.unit}</p>
        <p className={`text-xs ${
          isExpired ? 'text-red-600' : 
          isExpiringSoon ? 'text-amber-600' : 
          'text-gray-500'
        }`}>
          {isExpired ? `Expired ${Math.abs(daysUntilExpiry)} days ago` :
           daysUntilExpiry === 0 ? 'Expires today' :
           daysUntilExpiry === 1 ? 'Expires tomorrow' :
           `Expires in ${daysUntilExpiry} days`}
        </p>
      </div>
    </div>
  );
};

// Main Component
const RecipeFilterSystem: React.FC = () => {
  const [pantryItems] = useState<PantryItem[]>(mockPantryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterByCookable, setFilterByCookable] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'time' | 'difficulty'>('match');
  
  const recipeMatches = useMemo(() => {
    return calculateRecipeMatches(mockRecipes, pantryItems);
  }, [pantryItems]);
  
  const filteredRecipes = useMemo(() => {
    let filtered = recipeMatches.filter(match => {
      const matchesSearch = match.recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           match.recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || match.recipe.category === selectedCategory;
      const matchesCookable = !filterByCookable || match.canCook;
      
      return matchesSearch && matchesCategory && matchesCookable;
    });
    
    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchPercentage - a.matchPercentage;
        case 'time':
          return a.recipe.cookingTime - b.recipe.cookingTime;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.recipe.difficulty] - difficultyOrder[b.recipe.difficulty];
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [recipeMatches, searchTerm, selectedCategory, filterByCookable, sortBy]);
  
  const categories = [...new Set(mockRecipes.map(recipe => recipe.category))];
  const cookableRecipes = recipeMatches.filter(match => match.canCook).length;
  const expiringSoonItems = pantryItems.filter(item => getDaysUntilExpiry(item.expiryDate) <= 3).length;
  
  const handleCook = (recipeId: string) => {
    alert(`Cooking recipe ${recipeId}! Check the instructions.`);
  };
  
  const handleAddToShoppingList = (recipeId: string) => {
    const recipe = mockRecipes.find(r => r.id === recipeId);
    if (recipe) {
      const match = recipeMatches.find(m => m.recipe.id === recipeId);
      if (match) {
        alert(`Added missing ingredients to shopping list:\n${match.missingIngredients.map(ing => `• ${ing.name} (${ing.quantity} ${ing.unit})`).join('\n')}`);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Recommendations</h1>
          <p className="text-gray-600">Find recipes based on your pantry items</p>
        </header>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{pantryItems.length}</p>
                <p className="text-sm text-gray-600">Pantry Items</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <ChefHat className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{cookableRecipes}</p>
                <p className="text-sm text-gray-600">Ready to Cook</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-amber-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiringSoonItems}</p>
                <p className="text-sm text-gray-600">Expiring Soon</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredRecipes.length}</p>
                <p className="text-sm text-gray-600">Recipes Found</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Recipes</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Cookable Filter */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterByCookable}
                    onChange={(e) => setFilterByCookable(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show only cookable recipes</span>
                </label>
              </div>
              
              {/* Sort By */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'match' | 'time' | 'difficulty')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="match">Best Match</option>
                  <option value="time">Cooking Time</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>
            
            {/* Pantry Items */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Your Pantry</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pantryItems.map(item => (
                  <PantryItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recommended Recipes ({filteredRecipes.length})
              </h2>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your filters or add more items to your pantry.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map(recipeMatch => (
                  <RecipeCard
                    key={recipeMatch.recipe.id}
                    recipeMatch={recipeMatch}
                    onCook={handleCook}
                    onAddToShoppingList={handleAddToShoppingList}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeFilterSystem;