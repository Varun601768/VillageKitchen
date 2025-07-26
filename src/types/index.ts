export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
  addedDate: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: RecipeIngredient[];
  instructions: string[];
  image: string;
  category: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeMatch {
  recipe: Recipe;
  matchedIngredients: number;
  totalIngredients: number;
  missingIngredients: RecipeIngredient[];
  matchPercentage: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
  recipeId?: string;
  recipeName?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}