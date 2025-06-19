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
        // Try to fetch user data from our users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        // If user record doesn't exist, create it
        if (error && error.code === 'PGRST116') {
          console.log('Creating new user record for:', user.email)
          const { data: newUserData, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email || '',
                brand_tone: 'friendly',
                reading_level: 8,
                banned_words: []
              }
            ])
            .select()
            .single()
          
          if (insertError) {
            console.error('Error creating user record:', insertError)
            set({ user, loading: false })
          } else {
            set({ 
              user: { ...user, ...newUserData }, 
              loading: false 
            })
          }
        } else if (error) {
          console.error('Error fetching user data:', error)
          set({ user, loading: false })
        } else {
          // User record exists, merge the data
          set({ 
            user: { ...user, ...userData }, 
            loading: false 
          })
        }
      } else {
        set({ user: null, loading: false })
      }
    } catch (error) {
      console.error('Error checking user:', error)
      set({ user: null, loading: false })
    }
  },
})) 