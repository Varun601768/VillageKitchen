import React, { useState, useMemo } from 'react';
import { Package, ChefHat, ShoppingCart, Plus, Search, Filter, Calendar, BarChart3, LogOut, User } from 'lucide-react';
import { PantryItem, Recipe, ShoppingListItem, RecipeMatch } from './types';
import { useAuth } from './contexts/AuthContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockRecipes } from './data/mockRecipes';
import { findRecipeMatches, canCookRecipe, updatePantryAfterCooking } from './utils/recipeUtils';
import { sortByExpiry, getExpiryStatus } from './utils/dateUtils';
import { PantryItemCard } from './components/PantryItemCard';
import { AddPantryItemForm } from './components/AddPantryItemForm';
import { RecipeCard } from './components/RecipeCard';
import { ShoppingListModal } from './components/ShoppingListModal';
import { ExpiryAlerts } from './components/ExpiryAlerts';
import { AuthPage } from './components/AuthPage';

type Tab = 'pantry' | 'recipes' | 'shopping';
type SortOption = 'expiry' | 'name' | 'category' | 'quantity';
type FilterOption = 'all' | 'expiring-soon' | 'expired' | 'fresh';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('pantry');
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>(`pantryItems_${user?.id || 'guest'}`, []);
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingListItem[]>(`shoppingList_${user?.id || 'guest'}`, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('expiry');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modals
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);

  // Recipe filtering
  const [recipeSearchTerm, setRecipeSearchTerm] = useState('');
  const [recipeCategory, setRecipeCategory] = useState<string>('all');

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const categories = Array.from(new Set(pantryItems.map(item => item.category)));
  const recipeCategories = Array.from(new Set(mockRecipes.map(recipe => recipe.category)));

  // Filtered and sorted pantry items
  const filteredPantryItems = useMemo(() => {
    let filtered = pantryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesFilter = filterBy === 'all' || getExpiryStatus(item.expiryDate) === filterBy;
      return matchesSearch && matchesCategory && matchesFilter;
    });

    switch (sortBy) {
      case 'expiry':
        return sortByExpiry(filtered);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category));
      case 'quantity':
        return filtered.sort((a, b) => b.quantity - a.quantity);
      default:
        return filtered;
    }
  }, [pantryItems, searchTerm, selectedCategory, filterBy, sortBy]);

  // Recipe matches
  const recipeMatches: RecipeMatch[] = useMemo(() => {
    let filtered = mockRecipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(recipeSearchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(recipeSearchTerm.toLowerCase());
      const matchesCategory = recipeCategory === 'all' || recipe.category === recipeCategory;
      return matchesSearch && matchesCategory;
    });

    return findRecipeMatches(pantryItems, filtered);
  }, [pantryItems, recipeSearchTerm, recipeCategory]);

  const handleAddPantryItem = (itemData: Omit<PantryItem, 'id' | 'addedDate'>) => {
    const newItem: PantryItem = {
      ...itemData,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0]
    };
    setPantryItems([...pantryItems, newItem]);
  };

  const handleUpdatePantryItem = (updatedItem: PantryItem) => {
    setPantryItems(pantryItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleDeletePantryItem = (id: string) => {
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };

  const handleCookRecipe = (recipeId: string) => {
    const recipe = mockRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const updatedPantry = updatePantryAfterCooking(pantryItems, recipe);
    setPantryItems(updatedPantry);
    
    // Show success message or handle post-cooking actions
    alert(`Successfully cooked ${recipe.name}! Pantry updated.`);
  };

  const handleAddToShoppingList = (recipeId: string) => {
    const recipeMatch = recipeMatches.find(rm => rm.recipe.id === recipeId);
    if (!recipeMatch) return;

    const newItems: ShoppingListItem[] = recipeMatch.missingIngredients.map(ingredient => ({
      id: `${recipeId}-${ingredient.name}-${Date.now()}`,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      category: 'Other',
      purchased: false,
      recipeId: recipeId,
      recipeName: recipeMatch.recipe.name
    }));

    // Filter out items that are already in the shopping list
    const existingItems = new Set(shoppingList.map(item => `${item.name}-${item.recipeId}`));
    const uniqueNewItems = newItems.filter(item => 
      !existingItems.has(`${item.name}-${item.recipeId}`)
    );

    if (uniqueNewItems.length > 0) {
      setShoppingList([...shoppingList, ...uniqueNewItems]);
      alert(`Added ${uniqueNewItems.length} ingredients to shopping list!`);
    } else {
      alert('All ingredients are already in your shopping list!');
    }
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingList(shoppingList.map(item =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const handleClearCompletedShopping = () => {
    setShoppingList(shoppingList.filter(item => !item.purchased));
  };

  const openRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  // Statistics
  const expiredCount = pantryItems.filter(item => getExpiryStatus(item.expiryDate) === 'expired').length;
  const expiringSoonCount = pantryItems.filter(item => getExpiryStatus(item.expiryDate) === 'expiring-soon').length;
  const totalRecipes = mockRecipes.length;
  const cookableRecipes = recipeMatches.filter(rm => canCookRecipe(pantryItems, rm.recipe)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Pantry</h1>
                <p className="text-sm text-gray-600">Reduce waste, cook smarter</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Welcome, {user?.name}</span>
              </div>
              
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-red-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>{expiredCount} expired</span>
                </div>
                <div className="flex items-center space-x-1 text-amber-600">
                  <Calendar className="w-4 h-4" />
                  <span>{expiringSoonCount} expiring</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsShoppingModalOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {shoppingList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {shoppingList.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'pantry', label: 'Pantry', icon: Package, count: pantryItems.length },
              { id: 'recipes', label: 'Recipes', icon: ChefHat, count: cookableRecipes },
              { id: 'shopping', label: 'Shopping', icon: ShoppingCart, count: shoppingList.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Expiry Alerts */}
        <ExpiryAlerts pantryItems={pantryItems} />

        {/* Pantry Tab */}
        {activeTab === 'pantry' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search pantry items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="expiry">Sort by Expiry</option>
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                  <option value="quantity">Sort by Quantity</option>
                </select>

                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Items</option>
                  <option value="fresh">Fresh</option>
                  <option value="expiring-soon">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <button
                  onClick={() => setIsAddFormOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {filteredPantryItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pantry items found</h3>
                <p className="text-gray-600 mb-4">
                  {pantryItems.length === 0 
                    ? "Start by adding some items to your pantry"
                    : "Try adjusting your search or filters"
                  }
                </p>
                <button
                  onClick={() => setIsAddFormOpen(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPantryItems.map(item => (
                  <PantryItemCard
                    key={item.id}
                    item={item}
                    onEdit={setEditingItem}
                    onDelete={handleDeletePantryItem}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={recipeSearchTerm}
                    onChange={(e) => setRecipeSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={recipeCategory}
                onChange={(e) => setRecipeCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Categories</option>
                {recipeCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              Found {recipeMatches.length} recipes • {cookableRecipes} can be cooked with current pantry
            </div>

            {recipeMatches.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your search or add more items to your pantry</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipeMatches.map(recipeMatch => (
                  <div key={recipeMatch.recipe.id} onClick={() => openRecipeDetail(recipeMatch.recipe)}>
                    <RecipeCard
                      recipeMatch={recipeMatch}
                      onCook={handleCookRecipe}
                      onAddToShoppingList={handleAddToShoppingList}
                      canCook={canCookRecipe(pantryItems, recipeMatch.recipe)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shopping Tab */}
        {activeTab === 'shopping' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Shopping List</h2>
              <p className="text-gray-600">
                Missing ingredients from recipes you want to cook
              </p>
            </div>

            {shoppingList.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your shopping list is empty</h3>
                <p className="text-gray-600 mb-4">
                  Browse recipes and add ingredients you're missing to build your shopping list
                </p>
                <button
                  onClick={() => setActiveTab('recipes')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Recipes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {shoppingList.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      item.purchased ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleShoppingItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.purchased
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {item.purchased && <Check className="w-4 h-4" />}
                      </button>
                      <div className={item.purchased ? 'line-through text-gray-500' : ''}>
                        <div className="font-medium capitalize">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity} {item.unit}
                          {item.recipeName && (
                            <span className="ml-2 text-blue-600">
                              for {item.recipeName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveShoppingItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {shoppingList.length} items • {shoppingList.filter(item => item.purchased).length} completed
                  </div>
                  {shoppingList.some(item => item.purchased) && (
                    <button
                      onClick={handleClearCompletedShopping}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Clear Completed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPantryItemForm
        isOpen={isAddFormOpen || !!editingItem}
        onClose={() => {
          setIsAddFormOpen(false);
          setEditingItem(null);
        }}
        onAdd={handleAddPantryItem}
        editItem={editingItem}
        onUpdate={handleUpdatePantryItem}
      />

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isRecipeModalOpen}
        onClose={() => {
          setIsRecipeModalOpen(false);
          setSelectedRecipe(null);
        }}
      />

      <ShoppingListModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
        shoppingList={shoppingList}
        onTogglePurchased={handleToggleShoppingItem}
        onRemoveItem={handleRemoveShoppingItem}
        onClearCompleted={handleClearCompletedShopping}
      />
    </div>
  );
}

export default App;