
// Types de compatibilité pour la migration Supabase -> PocketBase

export type TaxiRideStatus = 
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type TaxiVehicleType = 
  | 'standard'
  | 'comfort'
  | 'van'
  | 'electric'
  | 'bike';

export type UserStatus = 
  | 'active'
  | 'inactive'
  | 'suspended';

export type RealtimePostgresChangesPayload = any;

export interface TableExistenceOptions {
  schema?: string;
  // Autres options si nécessaires
}
