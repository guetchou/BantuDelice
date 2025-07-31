
export interface RestaurantAnalytics {
  revenue: RevenueAnalytics;
  orders: OrderAnalytics;
  customers: CustomerAnalytics;
  menu: MenuAnalytics;
  operations: OperationsAnalytics;
}

export interface RevenueAnalytics {
  total: number;
  previousPeriod: number;
  changePercentage: number;
  byDay: DailyRevenue[];
  byCategory: CategoryRevenue[];
  byPaymentMethod: PaymentMethodRevenue[];
  averageOrderValue: number;
  forecastNextWeek?: number;
  revenuePerTable?: number;
  revenuePerHour?: Record<string, number>;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
  previousPeriod: number;
  changePercentage: number;
}

export interface PaymentMethodRevenue {
  method: string;
  revenue: number;
  percentage: number;
}

export interface OrderAnalytics {
  total: number;
  completed: number;
  cancelled: number;
  inProgress: number;
  averagePreparationTime: number;
  byHour: HourlyOrders[];
  byDay: DailyOrders[];
  popularItems: PopularItem[];
  deliveryPercentage: number;
  pickupPercentage: number;
  dineInPercentage: number;
}

export interface HourlyOrders {
  hour: number;
  count: number;
  revenue: number;
}

export interface DailyOrders {
  date: string;
  count: number;
  revenue: number;
}

export interface PopularItem {
  id: string;
  name: string;
  orderCount: number;
  percentage: number;
  revenue: number;
}

export interface CustomerAnalytics {
  total: number;
  new: number;
  returning: number;
  retentionRate: number;
  averageVisitsPerMonth: number;
  segments: CustomerSegment[];
  topCustomers: TopCustomer[];
  demographicData?: DemographicData;
}

export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  averageOrderValue: number;
  visitFrequency: number;
  favoriteItems: string[];
}

export interface TopCustomer {
  id: string;
  name: string;
  totalSpent: number;
  visitCount: number;
  lastVisit: string;
  favoriteItems: string[];
}

export interface DemographicData {
  ageGroups: AgeGroupData[];
  genderDistribution: GenderData[];
  locationHeatmap?: LocationData[];
}

export interface AgeGroupData {
  group: string;
  count: number;
  percentage: number;
}

export interface GenderData {
  gender: string;
  count: number;
  percentage: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  customerCount: number;
}

export interface MenuAnalytics {
  itemPerformance: ItemPerformance[];
  categoryPerformance: CategoryPerformance[];
  menuEngineering: MenuEngineering;
  priceAnalysis: PriceAnalysis[];
}

export interface ItemPerformance {
  id: string;
  name: string;
  orderCount: number;
  revenue: number;
  profit: number;
  costPercentage: number;
  wastePercentage: number;
  category: string;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface CategoryPerformance {
  category: string;
  itemCount: number;
  orderCount: number;
  revenue: number;
  profit: number;
  averagePreparationTime: number;
}

export interface MenuEngineering {
  stars: string[]; // High profit, high popularity
  plowhorses: string[]; // Low profit, high popularity
  puzzles: string[]; // High profit, low popularity
  dogs: string[]; // Low profit, low popularity
}

export interface PriceAnalysis {
  id: string;
  name: string;
  currentPrice: number;
  recommendedPrice: number;
  elasticity: number; // Price elasticity of demand
  competitiveIndex: number; // Price compared to competitors
  lastPriceChange: string;
  priceChangeImpact: number;
}

export interface OperationsAnalytics {
  staffEfficiency: StaffEfficiency[];
  tableUtilization: TableUtilization[];
  peakHours: PeakHour[];
  inventoryAnalysis: InventoryAnalysis[];
  wastageReport: WastageReport;
}

export interface StaffEfficiency {
  role: string;
  employeeCount: number;
  ordersPerHour: number;
  revenuePerEmployee: number;
  laborCostPercentage: number;
}

export interface TableUtilization {
  tableId: string;
  tableName: string;
  capacity: number;
  turnoverRate: number;
  utilizationPercentage: number;
  averageSeatingDuration: number;
  revenueGenerated: number;
}

export interface PeakHour {
  dayOfWeek: string;
  hour: number;
  customerCount: number;
  orderCount: number;
  revenue: number;
  staffLevel: number;
  recommendedStaffLevel: number;
}

export interface InventoryAnalysis {
  itemId: string;
  name: string;
  currentStock: number;
  averageUsagePerDay: number;
  daysUntilReorder: number;
  turnoverRate: number;
  wastagePercentage: number;
  costPerUnit: number;
  totalValue: number;
}

export interface WastageReport {
  totalValue: number;
  percentageOfCost: number;
  byIngredient: IngredientWastage[];
  byReason: ReasonWastage[];
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  recommendedActions: string[];
}

export interface IngredientWastage {
  ingredient: string;
  quantity: number;
  value: number;
  percentage: number;
}

export interface ReasonWastage {
  reason: string;
  value: number;
  percentage: number;
}

export interface AnalyticsPeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export type AnalyticsComparisonPeriod = 'previous_period' | 'previous_year' | 'custom';

export interface AnalyticsRequest {
  restaurantId: string;
  period: AnalyticsPeriod;
  comparisonPeriod?: AnalyticsComparisonPeriod;
  customComparisonPeriod?: AnalyticsPeriod;
  metrics?: string[];
  segments?: string[];
  filters?: Record<string, any>;
}
