import { create } from 'zustand'
import { supabase } from '../services/supabase'
import type { Document, SaveStatus } from '../types/document'

interface DocumentState {
  currentDocument: Document | null
  documents: Document[]
  saveStatus: SaveStatus
  
  loadDocuments: () => Promise<void>
  loadDocument: (id: string) => Promise<void>
  createDocument: () => Promise<void>
  updateDocument: (updates: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  setSaveStatus: (status: SaveStatus) => void
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  currentDocument: null,
  documents: [],
  saveStatus: 'saved',
  
  loadDocuments: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      
      set({ documents: data || [] })
    } catch (error) {
      console.error('Failed to load documents:', error)
      set({ documents: [] })
    }
  },
  
  loadDocument: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      
      if (error) throw error
      
      set({ currentDocument: data })
    } catch (error) {
      console.error('Failed to load document:', error)
      set({ currentDocument: null })
    }
  },
  
  createDocument: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const newDocument = {
        title: 'Untitled Document',
        content: '',
        user_id: user.id
      }
      
      const { data, error } = await supabase
        .from('documents')
        .insert([newDocument])
        .select()
        .single()
      
      if (error) throw error
      
      // Update local state
      set((state) => ({
        currentDocument: data,
        documents: [data, ...state.documents]
      }))
    } catch (error) {
      console.error('Failed to create document:', error)
      set({ saveStatus: 'error' })
    }
  },
  
  updateDocument: async (updates: Partial<Document>) => {
    const { currentDocument } = get()
    if (!currentDocument) return
    
    // Optimistic update
    set((state) => ({
      currentDocument: state.currentDocument ? { ...state.currentDocument, ...updates } : null,
      saveStatus: 'saving'
    }))
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentDocument.id)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Update documents list
      set((state) => ({
        documents: state.documents.map(doc => 
          doc.id === currentDocument.id 
            ? { ...doc, ...updates, updated_at: new Date().toISOString() }
            : doc
        ),
        saveStatus: 'saved'
      }))
    } catch (error) {
      console.error('Failed to update document:', error)
      
      // Revert optimistic update on error
      set({
        currentDocument: currentDocument,
        saveStatus: 'error'
      })
    }
  },
  
  deleteDocument: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Update local state
      set((state) => ({
        documents: state.documents.filter(doc => doc.id !== id),
        currentDocument: state.currentDocument?.id === id ? null : state.currentDocument
      }))
    } catch (error) {
      console.error('Failed to delete document:', error)
      set({ saveStatus: 'error' })
    }
  },
  
  setSaveStatus: (status: SaveStatus) => set({ saveStatus: status })
})) 