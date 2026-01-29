import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Types for our app
export interface Profile {
  id: string;
  user_id: string;
  username: string;
  created_at: string;
}

export interface Paste {
  id: string;
  user_id: string;
  title: string;
  content: string;
  slug: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  paste_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Like {
  id: string;
  paste_id: string;
  user_id: string;
  created_at: string;
}
