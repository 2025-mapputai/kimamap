import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eoinyffmvewmxyzfnkdp.supabase.co' // SupabaseプロジェクトのURL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaW55ZmZtdmV3bXh5emZua2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTc1NjUsImV4cCI6MjA2Mzk3MzU2NX0.BSlCFvViehtUW-I581XITCrNMfuScenMGLTZZryQ2lg' // Supabaseプロジェクトのanonキー

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
