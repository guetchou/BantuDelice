import { supabase } from "@/integrations/supabase/client";

export interface OrderMetrics {
  totalOrders: number;
  averageOrderValue: number;
  completionRate: number;
  cancelationRate: number;
}

export interface ServiceMetrics {
  totalBookings: number;
  popularTimeSlots: { hour: number; count: number }[];
  averageRating: number;
}

export const getOrderMetrics = async (
  startDate: Date,
  endDate: Date
): Promise<OrderMetrics> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const canceledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalValue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    return {
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalValue / totalOrders : 0,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      cancelationRate: totalOrders > 0 ? (canceledOrders / totalOrders) * 100 : 0
    };
  } catch (error) {
    console.error('Error fetching order metrics:', error);
    throw error;
  }
};

export const getServiceMetrics = async (
  serviceId: string,
  period: 'day' | 'week' | 'month'
): Promise<ServiceMetrics> => {
  try {
    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else startDate.setDate(startDate.getDate() - 1);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        ratings (
          rating
        )
      `)
      .eq('service_provider_id', serviceId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Calculate popular time slots
    const timeSlots = bookings.reduce((acc: Record<number, number>, booking) => {
      const hour = new Date(booking.start_time).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const popularTimeSlots = Object.entries(timeSlots)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count);

    // Calculate average rating
    const ratings = bookings
      .map(b => b.ratings)
      .flat()
      .filter(r => r)
      .map(r => r.rating);
    
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    return {
      totalBookings: bookings.length,
      popularTimeSlots,
      averageRating
    };
  } catch (error) {
    console.error('Error fetching service metrics:', error);
    throw error;
  }
};

// Monitor system health
export const monitorSystemHealth = async () => {
  try {
    const start = Date.now();
    
    // Test database connection
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1);
      
    const latency = Date.now() - start;

    if (error) throw error;

    console.log('System Health Check:', {
      status: 'healthy',
      latency: `${latency}ms`,
      timestamp: new Date().toISOString()
    });

    return {
      healthy: true,
      latency
    };
  } catch (error) {
    console.error('System health check failed:', error);
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};