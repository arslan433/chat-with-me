export interface Conversation {
  id: string;

  visitor_name: string;

  visitor_email: string;

  last_message: string;

  status: string;

  unread_count: number;

  updated_at: string;
}