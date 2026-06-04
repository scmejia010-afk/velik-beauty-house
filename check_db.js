import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y3JiY29jY2lzb3RhbmNpeHRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5NTM3OSwiZXhwIjoyMDk2MDcxMzc5fQ.HSf3zcKHbZesq5SEq66hOr1vpzPZ95xSes3Ci_5lHbg";
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function check() {
  const { data, error } = await supabase.from('inventario').select('*');
  console.log("Data in inventario:", data ? data.length : 0);
  if (error) console.error(error);
}
check();
