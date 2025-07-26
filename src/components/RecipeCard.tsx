import React from 'react';
import { Clock, Users, ChefHat, Check, ShoppingCart } from 'lucide-react';
import { RecipeMatch } from '../types';

interface RecipeCardProps {
  recipeMatch: RecipeMatch;
  onCook: (recipeId: string) => void;
  onAddToShoppingList: (recipeId: string) => void;
  canCook: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipeMatch,
  onCook,
  onAddToShoppingList,
  canCook
}) => {
  const { recipe, matchedIngredients, totalIngredients, matchPercentage } = recipeMatch;

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

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

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