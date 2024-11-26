import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'sua url aqui'; 
const supabaseKey = 'sua api key aqui'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
