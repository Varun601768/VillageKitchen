import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { PantryItem } from '../types';
import { getExpiryStatus, getDaysUntilExpiry } from '../utils/dateUtils';

interface ExpiryAlertsProps {
  pantryItems: PantryItem[];
  onDismiss?: () => void;
}

export const ExpiryAlerts: React.FC<ExpiryAlertsProps> = ({ pantryItems, onDismiss }) => {
  const expiredItems = pantryItems.filter(item => getExpiryStatus(item.expiryDate) === 'expired');
  const expiringSoonItems = pantryItems.filter(item => getExpiryStatus(item.expiryDate) === 'expiring-soon');

  if (expiredItems.length === 0 && expiringSoonItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      {expiredItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Expired Items ({expiredItems.length})
              </h3>
              <div className="text-sm text-red-700">
                {expiredItems.map((item, index) => (
                  <span key={item.id}>
                    <span className="capitalize font-medium">{item.name}</span>
                    {index < expiredItems.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {expiringSoonItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 mb-2">
                Expiring Soon ({expiringSoonItems.length})
              </h3>
              <div className="text-sm text-amber-700 space-y-1">
                {expiringSoonItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="capitalize font-medium">{item.name}</span>
                    <span>
                      {getDaysUntilExpiry(item.expiryDate) === 0 ? 'Today' :
                       getDaysUntilExpiry(item.expiryDate) === 1 ? 'Tomorrow' :
                       `${getDaysUntilExpiry(item.expiryDate)} days`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-amber-400 hover:text-amber-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};