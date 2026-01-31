import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gmguyrspjgsrehjqduxa.supabase.co';
const supabaseAnonKey = 'sb_publishable___ICsPoCrYuxaTXSsfgljw_10FCBzoH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
