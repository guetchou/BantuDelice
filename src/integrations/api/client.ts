
import { authApi } from './auth';
import { restaurantApi } from './restaurants';
import { orderApi } from './orders';
import { paymentApi } from './payments';
import { cashbackApi } from './cashback';

// Default export for the entire API client
const apiClient = {
  auth: authApi,
  restaurants: restaurantApi,
  orders: orderApi,
  payments: paymentApi,
  cashback: cashbackApi
};

export default apiClient;
export { authApi } from './auth';
export { restaurantApi } from './restaurants';
export { orderApi } from './orders';
export { paymentApi } from './payments';
export { cashbackApi } from './cashback';
