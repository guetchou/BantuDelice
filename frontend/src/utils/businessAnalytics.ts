import apiService from '@/services/api';

interface AnalyticsMetrics {
  totalRevenue: number;
  averageOrderValue: number;
  orderCount: number;
  popularItems: Array<{
    id: string;
    name: string;
    orderCount: number;
    revenue: number;
  }>;
  customerRetentionRate: number;
  deliveryPerformance: {
    averageTime: number;
    onTimeDeliveryRate: number;
  };
}

export const generateBusinessAnalytics = async (
  startDate: Date,
  endDate: Date
): Promise<AnalyticsMetrics> => {
  // Fetch orders within date range
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        item_name,
        quantity,
        price
      ),
      rating
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (ordersError) throw ordersError;

  // Calculate basic metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const orderCount = orders.length;
  const averageOrderValue = totalRevenue / orderCount;

  // Calculate popular items
  const itemStats = new Map<string, { count: number; revenue: number; name: string }>();
  orders.forEach(order => {
    order.order_items.forEach((item: unknown) => {
      const existing = itemStats.get(item.id) || { count: 0, revenue: 0, name: item.item_name };
      itemStats.set(item.id, {
        count: existing.count + item.quantity,
        revenue: existing.revenue + (item.price * item.quantity),
        name: item.item_name
      });
    });
  });

  const popularItems = Array.from(itemStats.entries())
    .map(([id, stats]) => ({
      id,
      name: stats.name,
      orderCount: stats.count,
      revenue: stats.revenue
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 10);

  // Calculate customer retention
  const { data: customerOrders } = await supabase
    .from('orders')
    .select('user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const repeatCustomers = new Set();
  const uniqueCustomers = new Set();
  
  customerOrders?.forEach(order => {
    if (uniqueCustomers.has(order.user_id)) {
      repeatCustomers.add(order.user_id);
    }
    uniqueCustomers.add(order.user_id);
  });

  const customerRetentionRate = (repeatCustomers.size / uniqueCustomers.size) * 100;

  // Calculate delivery performance
  const deliveryTimes = orders
    .filter(order => order.actual_delivery_time && order.created_at)
    .map(order => {
      const deliveryTime = new Date(order.actual_delivery_time).getTime() - 
                          new Date(order.created_at).getTime();
      return deliveryTime / (1000 * 60); // Convert to minutes
    });

  const averageDeliveryTime = deliveryTimes.reduce((sum, time) => sum + time, 0) / 
                             deliveryTimes.length;

  const onTimeDeliveries = orders.filter(order => 
    order.actual_delivery_time && order.estimated_delivery_time &&
    new Date(order.actual_delivery_time) <= new Date(order.estimated_delivery_time)
  ).length;

  const onTimeDeliveryRate = (onTimeDeliveries / orderCount) * 100;

  return {
    totalRevenue,
    averageOrderValue,
    orderCount,
    popularItems,
    customerRetentionRate,
    deliveryPerformance: {
      averageTime: averageDeliveryTime,
      onTimeDeliveryRate
    }
  };
};