
import { Database } from "@/integrations/supabase/database.types";

export type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
export type SupportTicketInsert = Database['public']['Tables']['support_tickets']['Insert'];
export type SupportTicketUpdate = Database['public']['Tables']['support_tickets']['Update'];

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
