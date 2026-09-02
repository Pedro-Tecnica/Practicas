import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  'https://jjrenfmwktaeuqyejyrp.supabase.co';
const supabaseKey = 'your_supabase_pUBLISHABLE_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
