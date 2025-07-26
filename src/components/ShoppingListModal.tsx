import React from 'react';
import { X, ShoppingCart, Check, Trash2 } from 'lucide-react';
import { ShoppingListItem } from '../types';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList: ShoppingListItem[];
  onTogglePurchased: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  shoppingList,
  onTogglePurchased,
  onRemoveItem,
  onClearCompleted
}) => {
  if (!isOpen) return null;

  const totalItems = shoppingList.length;
  const purchasedItems = shoppingList.filter(item => item.purchased).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Shopping List
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {purchasedItems} of {totalItems} items purchased
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {shoppingList.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your shopping list is empty</p>
              <p className="text-sm text-gray-400 mt-2">
                Add recipes that need ingredients to populate your list
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {shoppingList.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    item.purchased ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onTogglePurchased(item.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.purchased
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {item.purchased && <Check className="w-3 h-3" />}
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
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {shoppingList.length > 0 && (
          <div className="flex justify-between items-center p-6 border-t">
            <div className="text-sm text-gray-600">
              {totalItems} items • {purchasedItems} completed
            </div>
            {purchasedItems > 0 && (
              <button
                onClick={onClearCompleted}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Clear Completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};