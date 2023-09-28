import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eknshemceaemaiwtjyws.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnNoZW1jZWFlbWFpd3RqeXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTQ4MTcsImV4cCI6MjAxMDUzMDgxN30.4QGN9IS5trGfNWeHD3BzeRLnO3fyO3brz-q7XFI9XeY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
