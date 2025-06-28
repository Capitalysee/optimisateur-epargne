import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnyrdawjpnamgcqziazw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueXJkYXdqcG5hbWdjcXppYXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTk4MDksImV4cCI6MjA2NjM3NTgwOX0.yVqA7cVYPefJgZeaUB0PIxytpJTyqj0P7KZrue-h0KM';

// Debug: vérifier les variables d'environnement
console.log('=== DEBUG SUPABASE ===')
console.log('supabaseUrl:', supabaseUrl)
console.log('supabaseUrl existe:', !!supabaseUrl)
console.log('supabaseAnonKey existe:', !!supabaseAnonKey)
console.log('supabaseAnonKey début:', supabaseAnonKey?.substring(0, 20) + '...')

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 