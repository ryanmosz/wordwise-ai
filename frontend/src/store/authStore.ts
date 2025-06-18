import { create } from 'zustand'
import { supabase } from '../services/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      throw error
    }
    
    set({ user: data.user })
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      throw error
    }
    
    set({ user: data.user })
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    set({ user: null })
  },

  checkUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Fetch full user data including settings from our users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        set({ 
          user: userData ? { ...user, ...userData } : user, 
          loading: false 
        })
      } else {
        set({ user: null, loading: false })
      }
    } catch (error) {
      console.error('Error checking user:', error)
      set({ user: null, loading: false })
    }
  },
})) 