
import { any } from "@/integrations/supabase/database.types";

export type SupportTicket = any['public']['Tables']['support_tickets']['Row'];
export type SupportTicketInsert = any['public']['Tables']['support_tickets']['Insert'];
export type SupportTicketUpdate = any['public']['Tables']['support_tickets']['Update'];

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
