export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getExpiryStatus = (expiryDate: string): 'expired' | 'expiring-soon' | 'fresh' => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 3) return 'expiring-soon';
  return 'fresh';
};

export const sortByExpiry = <T extends { expiryDate: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
};