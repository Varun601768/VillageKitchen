import React from 'react';
import { Clock, Edit3, Trash2, Package, AlertTriangle } from 'lucide-react';
import { PantryItem } from '../types';
import { formatDate, getExpiryStatus, getDaysUntilExpiry } from '../utils/dateUtils';

interface PantryItemCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
}

export const PantryItemCard: React.FC<PantryItemCardProps> = ({ item, onEdit, onDelete }) => {
  const expiryStatus = getExpiryStatus(item.expiryDate);
  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);

  const getStatusColor = () => {
    switch (expiryStatus) {
      case 'expired': return 'border-red-500 bg-red-50';
      case 'expiring-soon': return 'border-amber-500 bg-amber-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getStatusIcon = () => {
    if (expiryStatus === 'expired' || expiryStatus === 'expiring-soon') {
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
    return <Package className="w-4 h-4 text-gray-600" />;
  };

  const getExpiryText = () => {
    if (daysUntilExpiry < 0) {
      return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    } else if (daysUntilExpiry === 0) {
      return 'Expires today';
    } else if (daysUntilExpiry === 1) {
      return 'Expires tomorrow';
    } else if (daysUntilExpiry <= 3) {
      return `Expires in ${daysUntilExpiry} days`;
    } else {
      return `Expires ${formatDate(item.expiryDate)}`;
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-gray-900 capitalize">{item.name}</h3>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Quantity:</span>
          <span className="font-medium">
            {item.quantity} {item.unit}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Category:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {item.category}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Expiry:
          </span>
          <span className={`text-xs font-medium ${
            expiryStatus === 'expired' ? 'text-red-600' :
            expiryStatus === 'expiring-soon' ? 'text-amber-600' :
            'text-gray-600'
          }`}>
            {getExpiryText()}
          </span>
        </div>
      </div>
    </div>
  );
};