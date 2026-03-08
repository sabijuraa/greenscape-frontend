import React from 'react';
import { useAuthStore } from '../../context/authStore';
import { canSeePricing } from '../../types';

interface PricingDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({ 
  amount, 
  currency = '£', 
  className = '' 
}) => {
  const user = useAuthStore((state) => state.user);
  
  if (!user || !canSeePricing(user.role)) {
    return (
      <span className={`text-gray-400 italic ${className}`}>
        Hidden
      </span>
    );
  }
  
  return (
    <span className={className}>
      {currency}{amount.toFixed(2)}
    </span>
  );
};

export default PricingDisplay;
