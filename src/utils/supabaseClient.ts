import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxqjorucrqeunnhxjavl.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cWpvcnVjcnFldW5uaHhqYXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNzY3MTQsImV4cCI6MjA0Njg1MjcxNH0.dOyajCHTtIer10BqJn3TiMKK_iUvDNerduvb4lo3JDg'; 

export const supabase = createClient(supabaseUrl, supabaseKey);