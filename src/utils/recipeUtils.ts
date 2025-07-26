import { PantryItem, Recipe, RecipeMatch, RecipeIngredient } from '../types';

export const findRecipeMatches = (pantryItems: PantryItem[], recipes: Recipe[]): RecipeMatch[] => {
  return recipes.map(recipe => {
    const matchedIngredients: string[] = [];
    const missingIngredients: RecipeIngredient[] = [];

    recipe.ingredients.forEach(ingredient => {
      const pantryItem = pantryItems.find(item => 
        item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
        ingredient.name.toLowerCase().includes(item.name.toLowerCase())
      );

      if (pantryItem && pantryItem.quantity >= ingredient.quantity) {
        matchedIngredients.push(ingredient.name);
      } else {
        missingIngredients.push(ingredient);
      }
    });

    const matchPercentage = Math.round((matchedIngredients.length / recipe.ingredients.length) * 100);

    return {
      recipe,
      matchedIngredients: matchedIngredients.length,
      totalIngredients: recipe.ingredients.length,
      missingIngredients,
      matchPercentage
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

export const canCookRecipe = (pantryItems: PantryItem[], recipe: Recipe): boolean => {
  return recipe.ingredients.every(ingredient => {
    const pantryItem = pantryItems.find(item => 
      item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
      ingredient.name.toLowerCase().includes(item.name.toLowerCase())
    );
    return pantryItem && pantryItem.quantity >= ingredient.quantity;
  });
};

export const updatePantryAfterCooking = (pantryItems: PantryItem[], recipe: Recipe): PantryItem[] => {
  return pantryItems.map(item => {
    const usedIngredient = recipe.ingredients.find(ingredient =>
      item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
      ingredient.name.toLowerCase().includes(item.name.toLowerCase())
    );

    if (usedIngredient) {
      return {
        ...item,
        quantity: Math.max(0, item.quantity - usedIngredient.quantity)
      };
    }

    return item;
  }).filter(item => item.quantity > 0);
};