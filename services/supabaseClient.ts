
import { createClient } from '@supabase/supabase-js';

// NOTE: In a real production app, these should be in a .env file.
// For this demo, we use placeholders. If these are not set, the app will
// fall back to purely offline mode (IndexedDB only).
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
