import { create } from 'zustand'
import { supabase } from '../services/supabase'
import type { Document, SaveStatus } from '../types/document'
import { debounce } from '../utils/debounce'

interface DocumentState {
  currentDocument: Document | null
  documents: Document[]
  saveStatus: SaveStatus
  isNewDocument: boolean  // Track if current document is new/unsaved
  
  loadDocuments: () => Promise<void>
  loadDocument: (id: string) => Promise<void>
  createDocument: () => Promise<void>
  createNewDocument: () => void  // Create document in memory only
  updateDocument: (updates: Partial<Document>) => Promise<void>
  updateDocumentDebounced: (updates: Partial<Document>) => void
  cancelPendingSave: () => void
  deleteDocument: (id: string) => Promise<void>
  cleanupEmptyDocuments: () => Promise<void>
  setSaveStatus: (status: SaveStatus) => void
  hasContentOrTitle: (doc: Document | null) => boolean
}

export const useDocumentStore = create<DocumentState>((set, get) => {
  // Create the debounced version of updateDocument
  const debouncedUpdate = debounce(async (updates: Partial<Document>) => {
    const { updateDocument } = get()
    await updateDocument(updates)
  }, 2000) // 2 second delay

  return {
    currentDocument: null,
    documents: [],
    saveStatus: 'saved',
    isNewDocument: false,
    
    loadDocuments: async () => {
      try {
        console.log('[DocumentStore] Loading documents...')
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')
        
        // Only load the most recent 20 documents to improve performance
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(20)
        
        if (error) throw error
        
        console.log('[DocumentStore] Documents loaded:', data?.length || 0, 'documents')
        if (data && data.length > 0) {
          console.log('[DocumentStore] Most recent document:', data[0].id, data[0].title)
        }
        
        set({ documents: data || [] })
      } catch (error) {
        console.error('[DocumentStore] Failed to load documents:', error)
        set({ documents: [] })
      }
    },
    
    loadDocument: async (id: string) => {
      try {
        console.log('[DocumentStore] loadDocument called with id:', id)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')
        
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()
        
        if (error) throw error
        
        console.log('[DocumentStore] Document loaded successfully:', {
          id: data.id,
          title: data.title,
          contentLength: data.content?.length || 0,
          hasContent: !!data.content
        })
        
        set({ 
          currentDocument: data,
          saveStatus: 'saved'  // Reset save status when loading a document
        })
        
        // Save the last edited document ID to localStorage
        if (data) {
          localStorage.setItem('lastDocumentId', data.id)
        }
      } catch (error) {
        console.error('[DocumentStore] Failed to load document:', error)
        set({ currentDocument: null })
      }
    },
    
    createNewDocument: () => {
      // Create a new document in memory only (not saved to DB)
      const tempDocument: Document = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: 'Untitled Document',
        content: '',
        user_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      set({ 
        currentDocument: tempDocument,
        isNewDocument: true,
        saveStatus: 'saved' 
      })
    },
    
    createDocument: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')
        
        // Don't check for existing empty documents anymore
        // Just create a new document when explicitly requested
        
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
          documents: [data, ...state.documents],
          isNewDocument: false
        }))
        
        // Save the last edited document ID to localStorage
        if (data) {
          localStorage.setItem('lastDocumentId', data.id)
        }
      } catch (error) {
        console.error('Failed to create document:', error)
        set({ saveStatus: 'error' })
      }
    },
    
    updateDocument: async (updates: Partial<Document>) => {
      const { currentDocument, isNewDocument, hasContentOrTitle } = get()
      if (!currentDocument) return
      
      // If this is a new document that now has content or a custom title, save it to DB first
      if (isNewDocument && hasContentOrTitle({ ...currentDocument, ...updates })) {
        console.log('[Auto-save] New document has content, creating in database...')
        
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('User not authenticated')
          
          const newDocument = {
            title: currentDocument.title,
            content: currentDocument.content,
            user_id: user.id,
            ...updates
          }
          
          const { data, error } = await supabase
            .from('documents')
            .insert([newDocument])
            .select()
            .single()
          
          if (error) throw error
          
          // Update local state with the real document
          set((state) => ({
            currentDocument: data,
            documents: [data, ...state.documents],
            isNewDocument: false,
            saveStatus: 'saved'
          }))
          
          // Save to localStorage
          if (data) {
            localStorage.setItem('lastDocumentId', data.id)
          }
          
          return
        } catch (error) {
          console.error('[Auto-save] Failed to create document:', error)
          set({ saveStatus: 'error' })
          return
        }
      }
      
      // Skip saving if it's still a new document without meaningful content
      if (isNewDocument) {
        console.log('[Auto-save] Skipping save for empty new document')
        set((state) => ({
          currentDocument: state.currentDocument ? { ...state.currentDocument, ...updates } : null,
          saveStatus: 'saved'  // Reset status since we're not actually saving
        }))
        return
      }
      
      console.log('[Auto-save] Starting save operation...')
      
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
        
        console.log('[Auto-save] Save completed successfully')
        
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
        console.error('[Auto-save] Save failed:', error)
        
        // Revert optimistic update on error
        set({
          currentDocument: currentDocument,
          saveStatus: 'error'
        })
      }
    },
    
    updateDocumentDebounced: (updates: Partial<Document>) => {
      console.log('[Auto-save] Debounced update triggered, will save in 2 seconds...')
      
      // Immediately set save status to indicate saving is pending
      set({ saveStatus: 'saving' })
      
      debouncedUpdate(updates)
    },
    
    cancelPendingSave: () => {
      console.log('[Auto-save] Cancelling pending save...')
      debouncedUpdate.cancel()
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
    
    cleanupEmptyDocuments: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')
        
        // Find empty documents (no content or just default editor HTML)
        const { data, error } = await supabase
          .from('documents')
          .select('id, title, content')
          .eq('user_id', user.id)
          .or('content.eq.,content.eq.<p></p>')
        
        if (error) throw error
        
        if (data && data.length > 1) {
          // Keep the most recent empty document, delete the rest
          const emptyDocs = data.filter(doc => 
            !doc.content || doc.content === '' || doc.content === '<p></p>'
          )
          
          if (emptyDocs.length > 1) {
            console.log('[DocumentStore] Cleaning up', emptyDocs.length - 1, 'empty documents')
            // Skip the first one (most recent)
            for (let i = 1; i < emptyDocs.length; i++) {
              await supabase
                .from('documents')
                .delete()
                .eq('id', emptyDocs[i].id)
            }
          }
        }
      } catch (error) {
        console.error('[DocumentStore] Failed to clean up empty documents:', error)
      }
    },
    
    setSaveStatus: (status: SaveStatus) => set({ saveStatus: status }),
    
    hasContentOrTitle: (doc: Document | null): boolean => {
      if (!doc) return false
      
      // Check if title is different from default
      if (doc.title && doc.title !== 'Untitled Document') return true
      
      // Check if content has meaningful text
      if (!doc.content) return false
      
      // Remove HTML tags and check for actual text content
      const parser = new DOMParser()
      const htmlDoc = parser.parseFromString(doc.content, 'text/html')
      const textContent = htmlDoc.body.textContent?.trim() || ''
      
      // Has content if text is longer than a few characters
      return textContent.length > 5
    }
  }
}) 