
export function estimateTime(
  distance: number, 
  isRushHour = false, 
  timeOfDay: 'day' | 'night' = 'day', 
  useExpressLane = false
): number {
  // Vitesse moyenne en ville: ~30 km/h (0.5 km/min)
  let baseTime = Math.ceil(distance / 0.5);
  
  // Ajustements pour les conditions
  if (isRushHour) {
    baseTime = Math.ceil(baseTime * 1.4); // 40% plus lent pendant les heures de pointe
  }
  
  if (timeOfDay === 'night') {
    baseTime = Math.ceil(baseTime * 0.8); // 20% plus rapide la nuit (moins de trafic)
  }
  
  if (useExpressLane) {
    baseTime = Math.ceil(baseTime * 0.75); // 25% plus rapide en utilisant les voies express
  }
  
  if (distance > 20) {
    // Pour les longues distances, la vitesse moyenne augmente
    baseTime = Math.ceil(baseTime * 0.9); // 10% plus rapide sur les longues distances
  }
  
  return baseTime;
}
