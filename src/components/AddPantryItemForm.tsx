import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { PantryItem } from '../types';

interface AddPantryItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<PantryItem, 'id' | 'addedDate'>) => void;
  editItem?: PantryItem | null;
  onUpdate?: (item: PantryItem) => void;
}

interface FormItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  expiryDate: string;
  expiryTime: string;
}

const categories = [
  'Fruits & Vegetables',
  'Meat & Poultry',
  'Dairy & Eggs',
  'Pantry Staples',
  'Frozen Foods',
  'Snacks',
  'Beverages',
  'Condiments & Sauces',
  'Other'
];

const units = ['pieces', 'kg', 'g', 'l', 'ml', 'cups', 'tbsp', 'tsp', 'cans', 'boxes'];

const defaultFormItem: FormItem = {
  name: '',
  quantity: '',
  unit: 'pieces',
  category: 'Other',
  expiryDate: '',
  expiryTime: '23:59'
};

export const AddPantryItemForm: React.FC<AddPantryItemFormProps> = ({
  isOpen,
  onClose,
  onAdd,
  editItem,
  onUpdate
}) => {
  const [formItems, setFormItems] = useState<FormItem[]>([{ ...defaultFormItem }]);

  useEffect(() => {
    if (editItem) {
      // Extract date and time from existing expiryDate if it contains time
      const existingExpiry = editItem.expiryDate;
      let dateOnly = existingExpiry;
      let timeOnly = '23:59';
      
      // Check if expiryDate contains time information
      if (existingExpiry.includes('T')) {
        const [datePart, timePart] = existingExpiry.split('T');
        dateOnly = datePart;
        timeOnly = timePart.slice(0, 5); // Extract HH:MM format
      }
      
      setFormItems([{
        name: editItem.name,
        quantity: editItem.quantity.toString(),
        unit: editItem.unit,
        category: editItem.category,
        expiryDate: dateOnly,
        expiryTime: timeOnly
      }]);
    } else {
      // For adding new items, start with one empty form
      setFormItems([{ ...defaultFormItem }]);
    }
  }, [editItem, isOpen]);

  const updateFormItem = (index: number, field: keyof FormItem, value: string) => {
    const updatedItems = [...formItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormItems(updatedItems);
  };

  const addNewItem = () => {
    setFormItems([...formItems, { ...defaultFormItem }]);
  };

  const removeItem = (index: number) => {
    if (formItems.length > 1) {
      const updatedItems = formItems.filter((_, i) => i !== index);
      setFormItems(updatedItems);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all items
    const validItems = formItems.filter(item => 
      item.name.trim() && item.quantity && item.expiryDate && item.expiryTime
    );

    if (validItems.length === 0) {
      return;
    }

    if (editItem && onUpdate) {
      // For editing, update the single item (original behavior)
      const combinedExpiry = `${validItems[0].expiryDate}T${validItems[0].expiryTime}:00`;
      const itemData = {
        name: validItems[0].name.toLowerCase().trim(),
        quantity: parseFloat(validItems[0].quantity),
        unit: validItems[0].unit,
        category: validItems[0].category,
        expiryDate: combinedExpiry
      };
      
      onUpdate({
        ...editItem,
        ...itemData
      });
    } else {
      // For adding multiple items, add each valid item
      validItems.forEach(item => {
        const combinedExpiry = `${item.expiryDate}T${item.expiryTime}:00`;
        const itemData = {
          name: item.name.toLowerCase().trim(),
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          category: item.category,
          expiryDate: combinedExpiry
        };
        onAdd(itemData);
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {editItem ? 'Edit Pantry Item' : 'Add Pantry Items'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {formItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                {!editItem && formItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                {formItems.length > 1 && (
                  <h3 className="text-sm font-medium text-gray-600 mb-3">
                    Item {index + 1}
                  </h3>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateFormItem(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., tomatoes, chicken breast"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={item.quantity}
                        onChange={(e) => updateFormItem(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <select
                        value={item.unit}
                        onChange={(e) => updateFormItem(index, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => updateFormItem(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) => updateFormItem(index, 'expiryDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Time
                      </label>
                      <input
                        type="time"
                        value={item.expiryTime}
                        onChange={(e) => updateFormItem(index, 'expiryTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!editItem && (
            <div className="mt-4">
              <button
                type="button"
                onClick={addNewItem}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Item
              </button>
            </div>
          )}

          <div className="flex space-x-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editItem ? 'Update Item' : `Add ${formItems.length} Item${formItems.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};