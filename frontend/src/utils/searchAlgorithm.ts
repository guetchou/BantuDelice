import { MenuItem } from '@/components/menu/types';

interface SearchWeights {
  name: number;
  description: number;
  category: number;
  tags: number;
}

const DEFAULT_WEIGHTS: SearchWeights = {
  name: 1.0,
  description: 0.7,
  category: 0.5,
  tags: 0.3
};

export const calculateSearchScore = (
  item: MenuItem,
  searchQuery: string,
  weights: SearchWeights = DEFAULT_WEIGHTS
): number => {
  const query = searchQuery.toLowerCase();
  let score = 0;

  // Name matching
  if (item.name.toLowerCase().includes(query)) {
    score += weights.name;
  }

  // Description matching
  if (item.description?.toLowerCase().includes(query)) {
    score += weights.description;
  }

  // Category matching
  if (item.category?.toLowerCase().includes(query)) {
    score += weights.category;
  }

  // Tags matching (if available)
  if (item.dietary_preferences) {
    const matchingTags = item.dietary_preferences.filter(tag => 
      tag.toLowerCase().includes(query)
    ).length;
    score += matchingTags * weights.tags;
  }

  return score;
};

export const intelligentSearch = (
  items: MenuItem[],
  searchQuery: string,
  weights?: SearchWeights
): MenuItem[] => {
  if (!searchQuery.trim()) return items;

  const scoredItems = items.map(item => ({
    item,
    score: calculateSearchScore(item, searchQuery, weights)
  }));

  return scoredItems
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
};