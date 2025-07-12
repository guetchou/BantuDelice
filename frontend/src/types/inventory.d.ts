
export interface InventoryLevel {
  id: string;
  menu_item_id: string;
  current_stock: number;
  reserved_stock: number;
  min_stock_level: number;
  last_restock_date?: string;
  next_restock_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryTransaction {
  id: string;
  inventory_id: string;
  quantity_change: number;
  performed_by?: string;
  created_at?: string;
  reason?: string;
  transaction_type: 'restock' | 'reserve' | 'release' | 'sold' | 'adjustment';
}
