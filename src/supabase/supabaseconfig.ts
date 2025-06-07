import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptmetpkhhsqzeabyzagl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0bWV0cGtoaHNxemVhYnl6YWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDEyMTQsImV4cCI6MjA2MTk3NzIxNH0.MvmNvtt4n4mHw_1VjX4ydrP1NeR3bk5JPodRSY19G2g";

export const supabase = createClient(supabaseUrl, supabaseKey);