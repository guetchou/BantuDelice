
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('fr-FR')} XAF`;
};

export const calculatePriceChange = (oldPrice: number, newPrice: number) => {
  const absoluteDifference = Math.abs(newPrice - oldPrice);
  const percentageDifference = ((newPrice - oldPrice) / oldPrice) * 100;
  const isIncrease = newPrice > oldPrice;
  const changeType = isIncrease ? 'increase' : 'decrease';
  
  const potentialRevenueIncrease = isIncrease ? absoluteDifference : -absoluteDifference;
  
  return {
    formattedOldPrice: formatPrice(oldPrice),
    formattedNewPrice: formatPrice(newPrice),
    formattedDifference: formatPrice(absoluteDifference),
    changeType,
    potentialRevenueIncrease,
    absoluteDifference,
    percentageDifference,
    isIncrease
  };
};
