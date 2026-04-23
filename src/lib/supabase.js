// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      if (import.meta.env.DEV) {
        console.warn('Supabase credentials missing')
      }
      return null
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// For backward compatibility
export const supabase = new Proxy({}, {
  get: (target, prop) => {
    const client = getSupabase()
    if (!client) {
      console.warn(`Supabase not initialized - cannot access ${String(prop)}`)
      return () => Promise.reject(new Error('Supabase not configured'))
    }
    const value = client[prop]
    return typeof value === 'function' ? value.bind(client) : value
  }
})