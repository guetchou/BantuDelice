
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const priceChangeStats = (oldPrice: number, newPrice: number) => {
  const absoluteDifference = newPrice - oldPrice;
  const percentageDifference = (absoluteDifference / oldPrice) * 100;
  
  return {
    absoluteDifference,
    percentageDifference: Math.round(percentageDifference * 10) / 10,
    isIncrease: newPrice > oldPrice
  };
};
