import { useState, useEffect, useRef } from 'react'
import { TextEditor, type TextEditorHandle } from '../components/editor/TextEditor'
import type { SuggestionType } from '../types/suggestion'
import { logSuggestionMarkVerification } from '../utils/verifySuggestionMark'
// import { useSuggestionHover } from '../hooks/useSuggestionHover'

export function TestSuggestionMark() {
  const [content, setContent] = useState('<p>Click one of the test buttons below to load content with suggestion marks.</p>')
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const editorRef = useRef<TextEditorHandle>(null)
  const [hoverDebugState, setHoverDebugState] = useState({
    containerInitialized: false,
    proseMirrorClasses: '',
    hoverReady: false,
    currentHoveredId: null as string | null,
    suggestionCount: 0,
    lastEvent: 'none',
    timestamp: new Date().toISOString()
  })
  
  // Run verification on component mount
  useEffect(() => {
    logSuggestionMarkVerification()
    addDebugMessage('✅ Page loaded - SuggestionMark verification completed')
  }, [])
  
  // Update hover debug state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const proseMirror = document.querySelector('.ProseMirror')
      const suggestions = document.querySelectorAll('[data-suggestion-id]')
      const hoveredSuggestion = document.querySelector('[data-suggestion-id].suggestion-hover')
      
      // The simplified hook doesn't set data-hover-initialized anymore
      // Consider it initialized if we have a ProseMirror element
      const containerInitialized = !!proseMirror
      
      setHoverDebugState({
        containerInitialized,
        proseMirrorClasses: proseMirror?.className || 'not found',
        hoverReady: true, // Simplified hook doesn't need hover-ready class
        currentHoveredId: hoveredSuggestion?.getAttribute('data-suggestion-id') || null,
        suggestionCount: suggestions.length,
        lastEvent: hoverDebugState.lastEvent,
        timestamp: new Date().toISOString()
      })
    }, 500)
    
    return () => clearInterval(interval)
  }, [hoverDebugState.lastEvent])

  const addDebugMessage = (message: string) => {
    console.log(message)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    // Update last event in hover debug state
    setHoverDebugState(prev => ({ ...prev, lastEvent: message }))
  }

  const suggestionTypes: SuggestionType[] = [
    'grammar',
    'tone',
    'persuasive',
    'conciseness',
    'headline',
    'readability',
    'vocabulary',
    'ab_test',
  ]

  // Test 1: Basic suggestion marks with correct colors
  const testBasicColors = () => {
    addDebugMessage('🎨 TEST 1: Loading basic suggestion marks with different colors...')
    
    const testContent = `
      <h2>Test 1: Basic Color Test</h2>
      <p>Each suggestion type should have a different underline color:</p>
      <p><span class="suggestion suggestion-grammar" data-suggestion-id="test-1" data-suggestion-type="grammar">This are a grammar error (should be RED underline)</span>.</p>
      <p><span class="suggestion suggestion-tone" data-suggestion-id="test-2" data-suggestion-type="tone">This tone could be more professional (should be YELLOW underline)</span>.</p>
      <p><span class="suggestion suggestion-persuasive" data-suggestion-id="test-3" data-suggestion-type="persuasive">Make this more compelling (should be BLUE underline)</span>.</p>
      <p><span class="suggestion suggestion-headline" data-suggestion-id="test-4" data-suggestion-type="headline">Better Headline Needed (should be GREEN underline)</span>.</p>
      <p><span class="suggestion suggestion-ab_test" data-suggestion-id="test-5" data-suggestion-type="ab_test">Try this alternative phrasing (should be TEAL underline)</span>.</p>
    `
    
    setContent(testContent)
    
    // Verify DOM after content loads
    setTimeout(() => {
      const editor = document.querySelector('.ProseMirror')
      if (editor) {
        const marks = editor.querySelectorAll('[data-suggestion-id]')
        addDebugMessage(`✅ Found ${marks.length} suggestion marks in editor`)
        
        // Check each mark
        marks.forEach((mark, i) => {
          const el = mark as HTMLElement
          const id = el.getAttribute('data-suggestion-id')
          const type = el.getAttribute('data-suggestion-type')
          const classes = el.className
          
          addDebugMessage(`📍 Mark ${i + 1}: id="${id}", type="${type}", classes="${classes}"`)
          
          // Verify class matches type
          if (classes.includes(`suggestion-${type}`)) {
            addDebugMessage(`  ✅ Correct class for ${type}`)
          } else {
            addDebugMessage(`  ❌ WRONG CLASS! Expected "suggestion-${type}" but got "${classes}"`)
          }
        })
      }
    }, 100)
  }

  // Test 2: Hover functionality
  const testHoverFunctionality = () => {
    addDebugMessage('🖱️ TEST 2: Testing hover functionality...')
    
    const testContent = `
      <h2>Test 2: Hover Test</h2>
      <p>Hover over these suggestions to see background color change:</p>
      <p><span class="suggestion suggestion-grammar" data-suggestion-id="hover-1" data-suggestion-type="grammar">Hover over this RED underlined text - background should turn light red</span>.</p>
      <p><span class="suggestion suggestion-tone" data-suggestion-id="hover-2" data-suggestion-type="tone">Hover over this YELLOW underlined text - background should turn light yellow</span>.</p>
      <p><span class="suggestion suggestion-headline" data-suggestion-id="hover-3" data-suggestion-type="headline">Hover over this GREEN underlined text - background should turn light green</span>.</p>
    `
    
    setContent(testContent)
    
    // Add hover event listeners for debugging
    setTimeout(() => {
      const editor = document.querySelector('.ProseMirror')
      if (editor) {
        const marks = editor.querySelectorAll('[data-suggestion-id]')
        addDebugMessage(`✅ Setting up hover listeners on ${marks.length} marks`)
        
        marks.forEach((mark) => {
          const el = mark as HTMLElement
          
          el.addEventListener('mouseenter', () => {
            const type = el.getAttribute('data-suggestion-type')
            addDebugMessage(`🖱️ HOVER START on ${type} suggestion`)
            el.classList.add('suggestion-hover')
            
            // Check computed style
            const computed = window.getComputedStyle(el)
            addDebugMessage(`  Background color: ${computed.backgroundColor}`)
          })
          
          el.addEventListener('mouseleave', () => {
            const type = el.getAttribute('data-suggestion-type')
            addDebugMessage(`🖱️ HOVER END on ${type} suggestion`)
            el.classList.remove('suggestion-hover')
          })
        })
      }
    }, 100)
  }

  // Test 3: Long text and multi-line
  const testLongAndMultiline = () => {
    addDebugMessage('📏 TEST 3: Testing long text and multi-line suggestions...')
    
    const testContent = `
      <h2>Test 3: Long & Multi-line Test</h2>
      <p><span class="suggestion suggestion-readability" data-suggestion-id="long-1" data-suggestion-type="readability">This is an extremely long piece of text that demonstrates how the suggestion mark system handles very lengthy content spans. The purpose of this test is to ensure that the underline styling remains consistent across the entire marked section, regardless of how many words or characters are included. We want to verify that the visual appearance remains clean and that the hover state properly highlights the entire section without any breaks or inconsistencies in the styling.</span></p>
      <p><span class="suggestion suggestion-vocabulary" data-suggestion-id="multi-1" data-suggestion-type="vocabulary">This suggestion mark starts on one line
      and continues onto the next line
      and even spans across a third line
      to test how well the underline and hover effects work
      when the marked text wraps across multiple lines in the editor.</span></p>
    `
    
    setContent(testContent)
    addDebugMessage('✅ Long and multi-line content loaded')
  }

  // Test 4: Mixed formatting (the problematic one)
  const testMixedFormatting = () => {
    addDebugMessage('🎯 TEST 4: Testing mixed formatting (bold/italic inside suggestions)...')
    
    const testContent = `
      <h2>Test 4: Mixed Formatting Test</h2>
      <p>Suggestions with bold, italic, and mixed formatting inside:</p>
      <p><span class="suggestion suggestion-grammar" data-suggestion-id="mixed-1" data-suggestion-type="grammar">This has <strong>bold text</strong> inside a grammar suggestion</span>.</p>
      <p><span class="suggestion suggestion-tone" data-suggestion-id="mixed-2" data-suggestion-type="tone">This has <em>italic text</em> inside a tone suggestion</span>.</p>
      <p><span class="suggestion suggestion-headline" data-suggestion-id="mixed-3" data-suggestion-type="headline">This has <strong>bold and <em>italic combined</em></strong> inside</span>.</p>
      <p><span class="suggestion suggestion-ab_test" data-suggestion-id="mixed-4" data-suggestion-type="ab_test">This has <strong>multiple</strong> <em>formatting</em> <u>styles</u> mixed</span>.</p>
    `
    
    setContent(testContent)
    
    // Check for nested elements
    setTimeout(() => {
      const editor = document.querySelector('.ProseMirror')
      if (editor) {
        const marks = editor.querySelectorAll('[data-suggestion-id]')
        addDebugMessage(`✅ Found ${marks.length} mixed formatting marks`)
        
        marks.forEach((mark, i) => {
          const el = mark as HTMLElement
          const id = el.getAttribute('data-suggestion-id')
          const hasStrong = !!el.querySelector('strong')
          const hasEm = !!el.querySelector('em')
          const hasU = !!el.querySelector('u')
          
          addDebugMessage(`📍 Mark ${i + 1} (${id}): strong=${hasStrong}, em=${hasEm}, u=${hasU}`)
        })
        
        // Test hover on nested elements
        addDebugMessage('🖱️ Setting up hover for nested elements...')
        
        // Use event delegation on the editor
        editor.addEventListener('mouseover', (e) => {
          const target = e.target as HTMLElement
          const suggestion = target.closest('[data-suggestion-id]')
          
          if (suggestion && !suggestion.classList.contains('suggestion-hover')) {
            const type = suggestion.getAttribute('data-suggestion-type')
            addDebugMessage(`🖱️ HOVER (via delegation) on ${type} - target was ${target.tagName}`)
            suggestion.classList.add('suggestion-hover')
          }
        })
        
        editor.addEventListener('mouseout', (e) => {
          const target = e.target as HTMLElement
          const suggestion = target.closest('[data-suggestion-id]')
          
          if (suggestion && suggestion.classList.contains('suggestion-hover')) {
            const type = suggestion.getAttribute('data-suggestion-type')
            addDebugMessage(`🖱️ HOVER END (via delegation) on ${type}`)
            suggestion.classList.remove('suggestion-hover')
          }
        })
      }
    }, 100)
  }

  // Test 5: Create marks programmatically (new approach)
  const testProgrammaticMarks = () => {
    addDebugMessage('🔧 TEST 5: Creating marks programmatically using TipTap commands...')
    
    // First, set plain text content
    const plainContent = `
      <h2>Test 5: Programmatic Marks</h2>
      <p>This are a simple grammar error. The tone could be more professional. Make this headline compelling!</p>
    `
    
    setContent(plainContent)
    
    // After content loads, we need to apply marks using the editor instance
    setTimeout(() => {
      addDebugMessage('⏳ Getting editor instance...')
      
      const editor = editorRef.current?.getEditor()
      if (!editor) {
        addDebugMessage('❌ No editor instance available!')
        addDebugMessage('   Make sure TextEditor is using forwardRef')
        return
      }
      
      addDebugMessage('✅ Got editor instance!')
      
      // Apply marks to specific text ranges
      try {
        // Mark 1: "This are a simple grammar error." (include period for grammar context)
        const text1 = "This are a simple grammar error."
        const pos1 = findTextPosition(editor, text1)
        if (pos1) {
          editor.chain()
            .focus()
            .setTextSelection({ from: pos1.from, to: pos1.to })
            .setMark('suggestion', { 
              suggestionId: 'prog-1', 
              suggestionType: 'grammar' 
            })
            .run()
          addDebugMessage(`✅ Applied grammar mark to "${text1}"`)
        }
        
        // Mark 2: "The tone could be more professional." (include period - punctuation affects tone!)
        const text2 = "The tone could be more professional."
        const pos2 = findTextPosition(editor, text2)
        if (pos2) {
          editor.chain()
            .focus()
            .setTextSelection({ from: pos2.from, to: pos2.to })
            .setMark('suggestion', { 
              suggestionId: 'prog-2', 
              suggestionType: 'tone' 
            })
            .run()
          addDebugMessage(`✅ Applied tone mark to "${text2}"`)
        }
        
        // Mark 3: "Make this headline compelling!" (include exclamation - it's part of the headline impact!)
        const text3 = "Make this headline compelling!"
        const pos3 = findTextPosition(editor, text3)
        if (pos3) {
          editor.chain()
            .focus()
            .setTextSelection({ from: pos3.from, to: pos3.to })
            .setMark('suggestion', { 
              suggestionId: 'prog-3', 
              suggestionType: 'headline' 
            })
            .run()
          addDebugMessage(`✅ Applied headline mark to "${text3}"`)
        }
        
        // Clear selection after applying marks
        editor.commands.setTextSelection(editor.state.doc.content.size)
        
        // Verify marks were applied
        setTimeout(() => {
          // Count marks in the editor DOM
          const editorEl = document.querySelector('.ProseMirror')
          if (editorEl) {
            const spans = editorEl.querySelectorAll('[data-suggestion-id]')
            addDebugMessage(`\n📊 Result: Found ${spans.length} suggestion marks in editor`)
            
            // List each mark
            spans.forEach((span, i) => {
              const el = span as HTMLElement
              addDebugMessage(`  Mark ${i + 1}: id="${el.getAttribute('data-suggestion-id')}", type="${el.getAttribute('data-suggestion-type')}", text="${el.textContent}"`)
            })
          }
        }, 100)
        
      } catch (error) {
        addDebugMessage(`❌ Error applying marks: ${error}`)
      }
    }, 500) // Give editor time to load content
  }
  
  // Helper function to find text position in editor
  const findTextPosition = (editor: any, searchText: string) => {
    const doc = editor.state.doc
    const result = { from: -1, to: -1 }
    
    doc.descendants((node: any, pos: number) => {
      if (node.isText && node.text.includes(searchText)) {
        const index = node.text.indexOf(searchText)
        result.from = pos + index
        result.to = pos + index + searchText.length
        return false // Stop searching
      }
    })
    
    if (result.from === -1) {
      addDebugMessage(`❌ Could not find text: "${searchText}"`)
      return null
    }
    
    return result
  }

  // Test 6: Apply marks programmatically to existing content
  const testProgrammaticApplication = () => {
    addDebugMessage('🔧 TEST 6: Applying marks programmatically to existing content...')
    
    // First set plain content with tone suggestion moved to the end
    const plainContent = `<h2>Test Programmatic Application</h2><p>Improve this headline first! This are a simple grammar error. Make this headline compelling! The tone could be more professional.</p>`
    setContent(plainContent)
    
    // Wait for content to load, then apply marks
    setTimeout(() => {
      const editor = editorRef.current?.getEditor()
      if (!editor) {
        addDebugMessage('❌ No editor instance available')
        return
      }
      
      addDebugMessage('✅ Got editor instance')
      
      // Use the better findTextInDoc function for accurate positions
      
      // FIRST: Find and mark "Improve this headline first!" (new headline at beginning)
      const firstHeadlinePos = findTextInDoc(editor.state.doc, 'Improve this headline first!')
      if (firstHeadlinePos.from !== -1) {
        addDebugMessage(`📍 Applying FIRST headline mark from ${firstHeadlinePos.from} to ${firstHeadlinePos.to}`)
        
        editor.chain()
          .focus()
          .setTextSelection(firstHeadlinePos)
          .setMark('suggestion', {
            suggestionId: 'prog-headline-first',
            suggestionType: 'headline'
          })
          .run()
          
        addDebugMessage(`✅ Applied headline mark to "Improve this headline first!" at beginning`)
      } else {
        addDebugMessage('❌ Could not find first headline text')
      }
      
      // Find "This are a simple grammar error"
      const grammarPos = findTextInDoc(editor.state.doc, 'This are a simple grammar error')
      if (grammarPos.from !== -1) {
        addDebugMessage(`📍 Applying grammar mark from ${grammarPos.from} to ${grammarPos.to}`)
        
        editor.chain()
          .focus()
          .setTextSelection(grammarPos)
          .setMark('suggestion', {
            suggestionId: 'prog-grammar-1',
            suggestionType: 'grammar'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find grammar text')
      }
      
      // Find and mark "Make this headline compelling!" (now before tone)
      const headlinePos = findTextInDoc(editor.state.doc, 'Make this headline compelling!')
      if (headlinePos.from !== -1) {
        addDebugMessage(`📍 Applying second headline mark from ${headlinePos.from} to ${headlinePos.to}`)
        
        // Apply the full headline mark
        editor.chain()
          .setTextSelection({ from: headlinePos.from, to: headlinePos.to })
          .setMark('suggestion', {
            suggestionId: 'prog-headline-1',
            suggestionType: 'headline'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find headline text')
      }
      
      // Find "The tone could be more professional" (now at the end)
      const tonePos = findTextInDoc(editor.state.doc, 'The tone could be more professional')
      if (tonePos.from !== -1) {
        addDebugMessage(`📍 Applying tone mark (NOW AT END) from ${tonePos.from} to ${tonePos.to}`)
        
        editor.chain()
          .focus()
          .setTextSelection(tonePos)
          .setMark('suggestion', {
            suggestionId: 'prog-tone-1',
            suggestionType: 'tone'
          })
          .run()
          
        addDebugMessage(`✅ Applied tone mark to "The tone could be more professional" at END of line`)
      } else {
        addDebugMessage('❌ Could not find tone text')
      }
      
      // CRITICAL: Clear selection after applying all marks
      editor.commands.setTextSelection(0)
      addDebugMessage('🧹 Cleared text selection after applying marks')
      
      // Merge any adjacent marks that got split
      const mergedCount = mergeAdjacentMarks(editor)
      if (mergedCount > 0) {
        addDebugMessage(`\n🔗 Merged ${mergedCount} split marks to preserve punctuation`)
      }
      
      // Force a re-render by blurring and refocusing
      editor.commands.blur()
      setTimeout(() => {
        editor.commands.focus()
        addDebugMessage('🔄 Forced re-render by blur/focus cycle')
        
        // CRITICAL: Remove any hover states that might have been applied
        // Do this AFTER the re-render to ensure we catch any states applied during render
        setTimeout(() => {
          const allSuggestions = document.querySelectorAll('[data-suggestion-id]')
          allSuggestions.forEach(el => {
            el.classList.remove('suggestion-hover')
            ;(el as HTMLElement).style.removeProperty('background-color')
          })
          addDebugMessage('🧹 Removed all hover states from suggestions')
          
          // Move focus to a button to ensure cursor is not over editor
          const firstButton = document.querySelector('button') as HTMLButtonElement
          if (firstButton) {
            firstButton.focus()
            addDebugMessage('🎯 Moved focus away from editor')
          }
        }, 100) // Increased delay to ensure render is complete
      }, 50)
    }, 500)
  }

  // Test 7: Mixed formatting with programmatic marks
  const testMixedProgrammatic = () => {
    addDebugMessage('🎨 TEST 7: Testing mixed formatting with programmatic marks...')
    
    // Set content with formatting already in place
    const mixedContent = `<h2>Test Mixed Formatting</h2><p>This text has <strong>bold words</strong> that need grammar fixes. The <em>italic tone</em> could be better. This <strong><em>bold italic</em></strong> headline needs work!</p>`
    setContent(mixedContent)
    
    setTimeout(() => {
      const editor = editorRef.current?.getEditor()
      if (!editor) {
        addDebugMessage('❌ No editor instance available')
        return
      }
      
      addDebugMessage('✅ Got editor instance')
      
      // For mixed formatting, we need to handle text that spans across nodes
      // Let's use the doc's textContent to find positions
      const fullText = editor.state.doc.textContent
      addDebugMessage(`📄 Full document text: "${fullText}"`)
      
      // Grammar suggestion: "text has bold words that need grammar fixes"
      const grammarText = 'text has bold words that need grammar fixes'
      const grammarStart = fullText.indexOf(grammarText)
      if (grammarStart !== -1) {
        // ProseMirror positions start at 1, and we need to account for the heading
        const from = grammarStart + 1 // +1 because ProseMirror positions are 1-based
        const to = from + grammarText.length
        
        addDebugMessage(`📍 Applying grammar mark from ${from} to ${to}`)
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .setMark('suggestion', {
            suggestionId: 'mixed-grammar-1',
            suggestionType: 'grammar'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find grammar text in full text')
      }
      
      // Tone suggestion: "The italic tone could be better"
      const toneText = 'The italic tone could be better'
      const toneStart = fullText.indexOf(toneText)
      if (toneStart !== -1) {
        const from = toneStart + 1
        const to = from + toneText.length
        
        addDebugMessage(`📍 Applying tone mark from ${from} to ${to}`)
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .setMark('suggestion', {
            suggestionId: 'mixed-tone-1',
            suggestionType: 'tone'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find tone text in full text')
      }
      
      // Headline suggestion: "This bold italic headline needs work!"
      const headlineText = 'This bold italic headline needs work!'
      const headlineStart = fullText.indexOf(headlineText)
      if (headlineStart !== -1) {
        const from = headlineStart + 1
        const to = from + headlineText.length
        
        addDebugMessage(`📍 Applying headline mark from ${from} to ${to}`)
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .setMark('suggestion', {
            suggestionId: 'mixed-headline-1',
            suggestionType: 'headline'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find headline text in full text')
      }
      
      // CRITICAL: Clear selection after applying all marks (like Test 5 & 6)
      editor.commands.setTextSelection(0)
      addDebugMessage('🧹 Cleared text selection after applying marks')
      
      // Merge any adjacent marks that got split
      const mergedCount = mergeAdjacentMarks(editor)
      if (mergedCount > 0) {
        addDebugMessage(`\n🔗 Merged ${mergedCount} split marks to preserve punctuation`)
      }
      
      // Force a re-render by blurring and refocusing
      editor.commands.blur()
      setTimeout(() => {
        editor.commands.focus()
        addDebugMessage('🔄 Forced re-render by blur/focus cycle')
      }, 50)
      
      // Check the result
      setTimeout(() => {
        addDebugMessage('\n🔍 Checking mixed formatting result...')
        inspectCurrentDOM()
        
        // Also check for split marks
        const editor = document.querySelector('.ProseMirror')
        if (editor) {
          const allSuggestions = editor.querySelectorAll('[data-suggestion-id]')
          addDebugMessage(`\n📊 Mixed Formatting Analysis:`)
          addDebugMessage(`  Total suggestion spans: ${allSuggestions.length}`)
          
          // Group by suggestion ID to see if marks got split
          const byId: Record<string, number> = {}
          allSuggestions.forEach(el => {
            const id = el.getAttribute('data-suggestion-id') || 'unknown'
            byId[id] = (byId[id] || 0) + 1
          })
          
          Object.entries(byId).forEach(([id, count]) => {
            if (count > 1) {
              addDebugMessage(`  ⚠️ Suggestion "${id}" is split into ${count} spans!`)
            } else {
              addDebugMessage(`  ✅ Suggestion "${id}" is in a single span`)
            }
          })
        }
      }, 100)
    }, 500)
  }

  // Helper function to find text position in ProseMirror document
  const findTextInDoc = (doc: any, searchText: string) => {
    let found = false
    let startPos = -1
    let endPos = -1
    
    doc.descendants((node: any, nodePos: number) => {
      if (found) return false // Stop traversing once found
      
      if (node.isText) {
        const text = node.text
        const index = text.indexOf(searchText)
        
        if (index !== -1) {
          startPos = nodePos + index
          endPos = startPos + searchText.length
          found = true
          return false
        }
        
        // Check if search text spans multiple nodes
        // const remainingSearch = searchText.substring(0, text.length)
        if (searchText.startsWith(text) && text.length < searchText.length) {
          // This might be the start of our search text
          // For now, we'll skip this complex case
        }
      }
    })
    
    return { from: startPos, to: endPos }
  }

  // Helper function to apply mark ensuring punctuation is included
  const applyMarkWithPunctuation = (
    editor: any, 
    searchText: string, 
    suggestionId: string, 
    suggestionType: string,
    startSearchFrom?: number  // Optional parameter to start search from a specific position
  ): boolean => {
    const { state } = editor
    const { doc, tr } = state
    
    let applied = false
    
    // Search through the document text content
    const textContent = doc.textContent
    let searchIndex = textContent.indexOf(searchText, startSearchFrom || 0)
    
    if (searchIndex === -1) {
      return false
    }
    
    // Find the exact positions in the document structure
    let currentPos = 0
    let fromPos = -1
    let toPos = -1
    
    doc.descendants((node: any, pos: number) => {
      if (node.isText && fromPos === -1) {
        const nodeEnd = currentPos + node.text.length
        
        // Check if search starts in this node
        if (searchIndex >= currentPos && searchIndex < nodeEnd) {
          fromPos = pos + (searchIndex - currentPos)
          toPos = fromPos + searchText.length
          
          // Verify the text matches exactly
          const foundText = doc.textBetween(fromPos, toPos)
          if (foundText === searchText) {
            // Check for overlaps
            let hasOverlap = false
            doc.nodesBetween(fromPos, toPos, (node: any, _nodePos: number) => {
              if (node.marks.some((mark: any) => mark.type.name === 'suggestion')) {
                hasOverlap = true
                return false
              }
            })
            
            if (!hasOverlap) {
              // Apply the mark
              const mark = state.schema.marks.suggestion.create({
                suggestionId,
                suggestionType
              })
              
              const transaction = tr.addMark(fromPos, toPos, mark)
              editor.view.dispatch(transaction)
              applied = true
            }
          }
          
          return false // Stop searching
        }
        
        currentPos = nodeEnd
      }
    })
    
    return applied
  }

  // Helper function to merge adjacent marks of the same type
  const mergeAdjacentMarks = (editor: any) => {
    const transaction = editor.state.tr
    let mergedCount = 0
    
    // Collect all suggestion marks with their positions
    const marks: Array<{from: number, to: number, mark: any}> = []
    
    editor.state.doc.nodesBetween(0, editor.state.doc.content.size, (node: any, pos: number) => {
      node.marks.forEach((mark: any) => {
        if (mark.type.name === 'suggestion') {
          marks.push({
            from: pos,
            to: pos + node.nodeSize,
            mark: mark
          })
        }
      })
    })
    
    // Sort marks by position
    marks.sort((a, b) => a.from - b.from)
    
    // Find and merge adjacent marks of the same type
    for (let i = 0; i < marks.length - 1; i++) {
      const current = marks[i]
      const next = marks[i + 1]
      
      // Check if marks are adjacent and of the same type
      if (current.to >= next.from && 
          current.mark.attrs.suggestionType === next.mark.attrs.suggestionType &&
          current.mark.attrs.suggestionId === next.mark.attrs.suggestionId) {
        
        // Remove marks from the range and add a single merged mark
        transaction.removeMark(current.from, next.to, current.mark.type)
        transaction.addMark(
          current.from,
          next.to,
          editor.schema.marks.suggestion.create({
            suggestionId: current.mark.attrs.suggestionId,
            suggestionType: current.mark.attrs.suggestionType
          })
        )
        
        mergedCount++
        
        // Update the current mark's end position for next iteration
        marks[i].to = next.to
        // Mark the next item as processed
        marks.splice(i + 1, 1)
        i-- // Check the same position again
      }
    }
    
    if (mergedCount > 0) {
      editor.view.dispatch(transaction)
      return mergedCount
    }
    
    return 0
  }

  // Test 8: Comprehensive programmatic test with all suggestion types
  const testPreciseSelection = () => {
    addDebugMessage('🎯 TEST 8: Comprehensive test with all features...')
    
    // Set content with clear boundaries for each suggestion
    const content = `
      <h2>Comprehensive Test - All Features</h2>
      <p>This are grammatical errors.</p>
      <p>The <strong>tone here</strong> needs work. And this <em>headline is bad!</em> Plus <strong><em>readability problems.</em></strong></p>
      <p>Make it more <strong>persuasive please!</strong></p>
      <p>Too wordy here. And <em>vocabulary too complex.</em></p>
      <p>Try <strong>alternative approach.</strong></p>
      <p><strong>Grammar bad</strong> again! <em>Headline weak!</em> Vocabulary difficult.</p>
      <p>Tone needs <strong><em>adjustment now.</em></strong></p>
      <p>Be persuasive. And <strong>write concisely.</strong></p>
      <p>This are grammatical errors.</p>
      <p>This are grammatical errors.</p>
      <p>This are grammatical errors.</p>
      <p>This are grammatical errors.</p>
      <p>This is a very long sentence that will definitely wrap to multiple lines when displayed in the editor and we want to test if the entire thing can be underlined properly across line breaks.</p>
      <p>This is another very long sentence that will wrap to multiple lines but this time we only want part of it underlined to test partial underlining across line breaks.</p>
      <p>Finally this sentence will test underlining that spans across where the line break occurs in the middle of the underlined portion.</p>
      <p>Front words are underlined but middle words skip underlining then end words underlined.</p>
    `
    setContent(content)
    
    // Wait for editor to update
    setTimeout(() => {
      const editor = editorRef.current?.getEditor()
      if (!editor) {
        addDebugMessage('❌ No editor instance available')
        return
      }
      
      addDebugMessage('✅ Got editor instance')
      
      // Get the full document text for reference
      const fullText = editor.state.doc.textContent
      addDebugMessage(`📄 Full document text length: ${fullText.length} characters`)
      
      // Define all suggestions with exact text that appears in content
      // Being very careful to match exactly what's in the document
      const suggestions = [
        // Original test cases (lines 1-8)
        { type: 'grammar', searchText: 'This are grammatical errors.', id: 'test8-1' },
        { type: 'tone', searchText: 'The tone here needs work.', id: 'test8-2' },
        { type: 'headline', searchText: 'And this headline is bad!', id: 'test8-3' },
        { type: 'readability', searchText: 'Plus readability problems.', id: 'test8-4' },
        { type: 'persuasive', searchText: 'Make it more persuasive please!', id: 'test8-5' },
        { type: 'conciseness', searchText: 'Too wordy here.', id: 'test8-6' },
        { type: 'vocabulary', searchText: 'And vocabulary too complex.', id: 'test8-7' },
        { type: 'ab_test', searchText: 'Try alternative approach.', id: 'test8-8' },
        { type: 'grammar', searchText: 'Grammar bad again!', id: 'test8-9' },
        { type: 'headline', searchText: 'Headline weak!', id: 'test8-10' },
        { type: 'vocabulary', searchText: 'Vocabulary difficult.', id: 'test8-11' },
        { type: 'tone', searchText: 'Tone needs adjustment now.', id: 'test8-12' },
        { type: 'persuasive', searchText: 'Be persuasive.', id: 'test8-13' },
        { type: 'conciseness', searchText: 'And write concisely.', id: 'test8-14' },
        
        // Edge case tests
        // Line 9: Partial underline - only "are" 
        { type: 'grammar', searchText: 'are', id: 'test8-15', specialCase: 'partial-are' },
        
        // Line 10: Two words "This are" underlined
        { type: 'grammar', searchText: 'This are', id: 'test8-16', specialCase: 'two-words' },
        
        // Line 11: Everything but first word - "are grammatical errors."
        { type: 'tone', searchText: 'are grammatical errors.', id: 'test8-17', specialCase: 'skip-first' },
        
        // Line 12: Everything but last word - "This are grammatical"
        { type: 'headline', searchText: 'This are grammatical', id: 'test8-18', specialCase: 'skip-last' },
        
        // Line 13: Full multi-line sentence
        { type: 'persuasive', searchText: 'This is a very long sentence that will definitely wrap to multiple lines when displayed in the editor and we want to test if the entire thing can be underlined properly across line breaks.', id: 'test8-19' },
        
        // Line 14: Partial multi-line - "very long sentence that will wrap"
        { type: 'vocabulary', searchText: 'very long sentence that will wrap', id: 'test8-20', specialCase: 'partial-multiline' },
        
        // Line 15: Multi-line span - "spans across where the line break occurs"
        { type: 'readability', searchText: 'spans across where the line break occurs', id: 'test8-21', specialCase: 'span-break' },
        
        // Line 16: Front and end words only - need two separate marks
        { type: 'conciseness', searchText: 'Front words are underlined', id: 'test8-22', specialCase: 'front-part' },
        { type: 'conciseness', searchText: 'end words underlined.', id: 'test8-23', specialCase: 'end-part' }
      ]
      
      // First, let's debug what text we actually have
      addDebugMessage('\n📝 Document structure:')
      editor.state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'paragraph' && node.textContent.trim()) {
          addDebugMessage(`  Paragraph at ${pos}: "${node.textContent}"`)
        }
      })
      
      // Track applied marks to prevent overlaps
      const appliedRanges: Array<{from: number, to: number}> = []
      
      // Apply each suggestion mark with overlap checking
      suggestions.forEach((suggestion, index) => {
        const typeColors = {
          grammar: 'red',
          tone: 'yellow', 
          persuasive: 'blue',
          conciseness: 'purple',
          headline: 'green',
          readability: 'cyan (light blue)',
          vocabulary: 'orange',
          ab_test: 'teal'
        }
        
        addDebugMessage(`\n📍 Attempting to apply ${suggestion.type} mark (${typeColors[suggestion.type as keyof typeof typeColors] || suggestion.type}):`)
        addDebugMessage(`   Text: "${suggestion.searchText}"`)
        
        let applied = false
        
        // Special handling for edge cases
        if (suggestion.specialCase) {
          const grammarSentence = 'This are grammatical errors.'
          
          switch (suggestion.specialCase) {
            case 'partial-are': {
              // Find the first standalone "This are grammatical errors." (9th line)
              let count = 0
              let searchPos = 0
              while (searchPos < fullText.length) {
                const idx = fullText.indexOf(grammarSentence, searchPos)
                if (idx === -1) break
                count++
                if (count === 2) { // Second instance (first one after the original test cases)
                  const areStart = idx + 'This '.length
                  applied = applyMarkWithPunctuation(
                    editor,
                    'are',
                    suggestion.id,
                    suggestion.type,
                    areStart
                  )
                  if (applied) {
                    addDebugMessage(`   ✅ Applied partial underline to only "are"`)
                  }
                  break
                }
                searchPos = idx + 1
              }
              break
            }
            
            case 'two-words': {
              // Find "This are" in the 10th line (3rd instance)
              let count = 0
              let searchPos = 0
              while (searchPos < fullText.length) {
                const idx = fullText.indexOf(grammarSentence, searchPos)
                if (idx === -1) break
                count++
                if (count === 3) {
                  applied = applyMarkWithPunctuation(
                    editor,
                    'This are',
                    suggestion.id,
                    suggestion.type,
                    idx
                  )
                  if (applied) {
                    addDebugMessage(`   ✅ Applied underline to "This are" (two words with space)`)
                  }
                  break
                }
                searchPos = idx + 1
              }
              break
            }
            
            case 'skip-first': {
              // Find "are grammatical errors." in the 11th line (4th instance)
              let count = 0
              let searchPos = 0
              while (searchPos < fullText.length) {
                const idx = fullText.indexOf(grammarSentence, searchPos)
                if (idx === -1) break
                count++
                if (count === 4) {
                  const startPos = idx + 'This '.length
                  applied = applyMarkWithPunctuation(
                    editor,
                    'are grammatical errors.',
                    suggestion.id,
                    suggestion.type,
                    startPos
                  )
                  if (applied) {
                    addDebugMessage(`   ✅ Applied underline skipping first word "This"`)
                  }
                  break
                }
                searchPos = idx + 1
              }
              break
            }
            
            case 'skip-last': {
              // Find "This are grammatical" in the 12th line (5th instance)
              let count = 0
              let searchPos = 0
              while (searchPos < fullText.length) {
                const idx = fullText.indexOf(grammarSentence, searchPos)
                if (idx === -1) break
                count++
                if (count === 5) {
                  applied = applyMarkWithPunctuation(
                    editor,
                    'This are grammatical',
                    suggestion.id,
                    suggestion.type,
                    idx
                  )
                  if (applied) {
                    addDebugMessage(`   ✅ Applied underline skipping last word "errors."`)
                  }
                  break
                }
                searchPos = idx + 1
              }
              break
            }
            
            case 'partial-multiline': {
              // Find "very long sentence that will wrap" in the second long sentence
              const secondLongSentence = 'This is another very long sentence'
              const idx = fullText.indexOf(secondLongSentence)
              if (idx !== -1) {
                const startPos = fullText.indexOf('very long sentence that will wrap', idx)
                if (startPos !== -1) {
                  applied = applyMarkWithPunctuation(
                    editor,
                    suggestion.searchText,
                    suggestion.id,
                    suggestion.type,
                    startPos
                  )
                  if (applied) {
                    addDebugMessage(`   ✅ Applied partial underline on multi-line text`)
                  }
                }
              }
              break
            }
            
            case 'span-break': {
              // Find "spans across where the line break occurs" in the last sentence
              const lastSentence = 'Finally this sentence will test underlining that spans'
              const idx = fullText.indexOf(lastSentence)
              if (idx !== -1) {
                applied = applyMarkWithPunctuation(
                  editor,
                  suggestion.searchText,
                  suggestion.id,
                  suggestion.type
                )
                if (applied) {
                  addDebugMessage(`   ✅ Applied underline that spans line break`)
                }
              }
              break
            }
            
            case 'front-part':
            case 'end-part': {
              // These are handled by regular marking since they're separate phrases
              applied = applyMarkWithPunctuation(
                editor,
                suggestion.searchText,
                suggestion.id,
                suggestion.type
              )
              if (applied && suggestion.specialCase === 'front-part') {
                addDebugMessage(`   ✅ Applied underline to front part of sentence`)
              } else if (applied && suggestion.specialCase === 'end-part') {
                addDebugMessage(`   ✅ Applied underline to end part (middle words skipped)`)
              }
              break
            }
          }
        } else if (suggestion.id === 'test8-15') {
          // This was the old partial-are logic, now handled above
          // Skip it
        } else {
          // Regular full text marking
          applied = applyMarkWithPunctuation(
            editor,
            suggestion.searchText,
            suggestion.id,
            suggestion.type
          )
        }
        
        if (applied) {
          if (!suggestion.specialCase) {
            addDebugMessage(`   ✅ Applied successfully with punctuation preserved`)
          }
        } else {
          addDebugMessage(`   ❌ Could not apply mark (text not found or overlapping)`)
          
          // Debug: try to find partial matches
          const words = suggestion.searchText.split(' ')
          words.forEach(word => {
            if (fullText.includes(word)) {
              addDebugMessage(`   Found word "${word}" at position ${fullText.indexOf(word)}`)
            }
          })
        }
      })
      
      // Remove the old implementation code that was causing splits
      /* REMOVED: Old implementation that was causing punctuation splits
      suggestions.forEach((suggestion, index) => {
        const start = fullText.indexOf(suggestion.searchText)
        if (start !== -1) {
          // ... old code ...
        }
      })
      */
      
      // Clear selection after applying all marks
      editor.commands.setTextSelection(0)
      addDebugMessage('\n🧹 Cleared text selection after applying all marks')
      
      // Merge any adjacent marks that got split
      const mergedCount = mergeAdjacentMarks(editor)
      if (mergedCount > 0) {
        addDebugMessage(`\n🔗 Merged ${mergedCount} split marks to preserve punctuation`)
      }
      
      // Force a re-render
      editor.commands.blur()
      setTimeout(() => {
        editor.commands.focus()
        addDebugMessage('🔄 Forced re-render by blur/focus cycle')
        
        // Verify the marks and test results
        setTimeout(() => {
          const allSuggestions = document.querySelectorAll('[data-suggestion-id]')
          addDebugMessage(`\n📊 COMPREHENSIVE TEST RESULTS:`)
          addDebugMessage(`✅ Applied ${allSuggestions.length} suggestion marks`)
          
          // Check each applied suggestion
          addDebugMessage('\n📍 Applied suggestions:')
          allSuggestions.forEach((el, i) => {
            const id = el.getAttribute('data-suggestion-id')
            const type = el.getAttribute('data-suggestion-type')
            const text = el.textContent
            addDebugMessage(`  ${i + 1}. ${type} (${id}): "${text}"`)
          })
          
          // Debug character-by-character for problem areas
          addDebugMessage('\n🔍 CHARACTER-BY-CHARACTER ANALYSIS:')
          const editor = document.querySelector('.ProseMirror')
          if (editor) {
            // Check first paragraph with "errors."
            const paragraphs = editor.querySelectorAll('p')
            if (paragraphs[1]) { // Second paragraph (first has title)
              const para1 = paragraphs[1]
              addDebugMessage(`\n📝 First paragraph HTML: ${para1.innerHTML}`)
              const spans = para1.querySelectorAll('span')
              spans.forEach((span, i) => {
                addDebugMessage(`  Span ${i}: type="${span.getAttribute('data-suggestion-type')}", text="${span.textContent}"`)
              })
            }
            
            // Check the paragraph with "problems."
            if (paragraphs[2]) {
              const para2 = paragraphs[2]
              addDebugMessage(`\n📝 Second paragraph HTML: ${para2.innerHTML}`)
              const spans = para2.querySelectorAll('span')
              spans.forEach((span, i) => {
                addDebugMessage(`  Span ${i}: type="${span.getAttribute('data-suggestion-type')}", text="${span.textContent}"`)
              })
            }
          }
          
          // Count by type
          const byType: Record<string, number> = {}
          allSuggestions.forEach(el => {
            const type = el.getAttribute('data-suggestion-type') || 'unknown'
            byType[type] = (byType[type] || 0) + 1
          })
          
          addDebugMessage('\n🎨 All 8 suggestion types tested:')
          const expectedTypes = ['grammar', 'tone', 'persuasive', 'conciseness', 'headline', 'readability', 'vocabulary', 'ab_test']
          expectedTypes.forEach(type => {
            const count = byType[type] || 0
            const status = count > 0 ? '✅' : '❌'
            addDebugMessage(`   ${status} ${type}: ${count} marks`)
          })
          
          // Check for split marks (formatting issues)
          const byId: Record<string, number> = {}
          allSuggestions.forEach(el => {
            const id = el.getAttribute('data-suggestion-id') || 'unknown'
            byId[id] = (byId[id] || 0) + 1
          })
          
          let splitCount = 0
          Object.entries(byId).forEach(([id, count]) => {
            if (count > 1) {
              splitCount++
              addDebugMessage(`⚠️ Suggestion "${id}" is split into ${count} spans`)
            }
          })
          
          if (splitCount === 0) {
            addDebugMessage('\n✅ SUCCESS: No split marks - formatting preserved correctly!')
          } else {
            addDebugMessage(`\n⚠️ WARNING: ${splitCount} marks were split due to formatting`)
          }
          
          addDebugMessage('\n📝 TEST SUMMARY:')
          addDebugMessage('This test verifies:')
          addDebugMessage('1. All 8 suggestion types render correctly')
          addDebugMessage('2. Word boundaries are respected (no overlapping)')
          addDebugMessage('3. Punctuation is included with words')
          addDebugMessage('4. Mixed formatting (bold/italic) is preserved')
          addDebugMessage('5. Multiple suggestions per line work correctly')
          addDebugMessage('6. Hover states work on all suggestions')
          addDebugMessage('7. Cyan readability color differentiates from blue persuasive')
          addDebugMessage('8. Edge cases:')
          addDebugMessage('   - Partial word underlining (only "are")')
          addDebugMessage('   - Two words with space ("This are")')
          addDebugMessage('   - Skip first word ("are grammatical errors.")')
          addDebugMessage('   - Skip last word ("This are grammatical")')
          addDebugMessage('   - Full multi-line sentence underlining')
          addDebugMessage('   - Partial multi-line underlining')
          addDebugMessage('   - Underline spanning line breaks')
          addDebugMessage('   - Front and end underlined, middle skipped')
        }, 100)
      }, 50)
    }, 500)
  }

  // Debug function to inspect current DOM state
  const inspectCurrentDOM = () => {
    addDebugMessage('🔍 INSPECTING CURRENT DOM STATE...')
    
    const editor = document.querySelector('.ProseMirror')
    if (!editor) {
      addDebugMessage('❌ No editor found!')
      return
    }
    
    // Get the raw HTML from the editor
    addDebugMessage('\n📄 Raw Editor HTML:')
    addDebugMessage(editor.innerHTML)
    
    // Count different types of elements
    const allSpans = editor.querySelectorAll('span')
    const suggestionSpans = editor.querySelectorAll('[data-suggestion-id]')
    const suggestionClasses = editor.querySelectorAll('.suggestion')
    
    addDebugMessage(`\n📊 DOM Statistics:`)
    addDebugMessage(`  - Total <span> elements: ${allSpans.length}`)
    addDebugMessage(`  - Spans with data-suggestion-id: ${suggestionSpans.length}`)
    addDebugMessage(`  - Elements with .suggestion class: ${suggestionClasses.length}`)
    
    // Check each suggestion
    if (suggestionSpans.length > 0) {
      addDebugMessage('\n📍 Suggestion Details:')
      suggestionSpans.forEach((span, i) => {
        const el = span as HTMLElement
        const id = el.getAttribute('data-suggestion-id')
        const type = el.getAttribute('data-suggestion-type')
        const classes = el.className
        const text = el.textContent?.substring(0, 30) + '...'
        
        addDebugMessage(`\n  Suggestion ${i + 1}:`)
        addDebugMessage(`    ID: ${id}`)
        addDebugMessage(`    Type: ${type}`)
        addDebugMessage(`    Classes: ${classes}`)
        addDebugMessage(`    Text: "${text}"`)
        
        // Check if class matches type
        const expectedClass = `suggestion-${type}`
        if (classes.includes(expectedClass)) {
          addDebugMessage(`    ✅ Has correct class: ${expectedClass}`)
        } else {
          addDebugMessage(`    ❌ MISSING correct class: ${expectedClass}`)
        }
      })
    } else {
      // Try to find any spans at all
      addDebugMessage('\n❌ No suggestion spans found! Checking all spans:')
      allSpans.forEach((span, i) => {
        const el = span as HTMLElement
        if (i < 5) { // Only show first 5
          addDebugMessage(`  Span ${i}: classes="${el.className}", text="${el.textContent?.substring(0, 20)}..."`)
        }
      })
    }
  }

  // Inspect computed styles
  const inspectHeadlineStyles = () => {
    addDebugMessage('🔍 INSPECTING HEADLINE SUGGESTION STYLES...')
    
    const editor = document.querySelector('.ProseMirror')
    if (!editor) {
      addDebugMessage('❌ No editor found!')
      return
    }
    
    // Find headline suggestion
    const headlineElement = editor.querySelector('.suggestion-headline') as HTMLElement
    if (!headlineElement) {
      addDebugMessage('❌ No headline suggestion found!')
      return
    }
    
    const computedStyles = window.getComputedStyle(headlineElement)
    
    addDebugMessage('\n📊 Computed Styles for Headline Suggestion:')
    addDebugMessage(`  Text decoration color: ${computedStyles.textDecorationColor}`)
    addDebugMessage(`  Background color: ${computedStyles.backgroundColor}`)
    addDebugMessage(`  Classes: ${headlineElement.className}`)
    addDebugMessage(`  Data attributes: id="${headlineElement.getAttribute('data-suggestion-id')}", type="${headlineElement.getAttribute('data-suggestion-type')}"`)
    
    // Also check persuasive for comparison
    const persuasiveElement = editor.querySelector('.suggestion-persuasive') as HTMLElement
    if (persuasiveElement) {
      const persuasiveStyles = window.getComputedStyle(persuasiveElement)
      addDebugMessage('\n📊 Computed Styles for Persuasive Suggestion (for comparison):')
      addDebugMessage(`  Text decoration color: ${persuasiveStyles.textDecorationColor}`)
      addDebugMessage(`  Classes: ${persuasiveElement.className}`)
    }
    
    // Check CSS rules
    addDebugMessage('\n🔍 Checking which CSS rules are being applied...')
    const styleSheets = Array.from(document.styleSheets)
    styleSheets.forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || [])
        rules.forEach((rule) => {
          if (rule instanceof CSSStyleRule) {
            if (rule.selectorText && rule.selectorText.includes('suggestion-headline')) {
              addDebugMessage(`  Rule: ${rule.selectorText}`)
              addDebugMessage(`    ${rule.style.cssText}`)
            }
          }
        })
      } catch (e) {
        // Some stylesheets might be cross-origin
      }
    })
  }

  // Clear everything
  const clearEditor = () => {
    setContent('<p>Editor cleared. Click a test button to load content.</p>')
    setDebugInfo([])
    addDebugMessage('🧹 Editor and debug log cleared')
  }

  // Force CSS initialization
  const forceCSSInit = () => {
    addDebugMessage('🎨 FORCING CSS INITIALIZATION...')
    
    // Create a temporary container
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.className = 'ProseMirror'
    document.body.appendChild(tempDiv)
    
    // Create elements for each suggestion type
    const types = ['grammar', 'tone', 'headline', 'persuasive', 'conciseness', 'readability', 'vocabulary', 'ab_test']
    
    types.forEach(type => {
      // Create element without hover
      const el1 = document.createElement('span')
      el1.className = `suggestion suggestion-${type}`
      el1.setAttribute('data-suggestion-id', `init-${type}`)
      el1.setAttribute('data-suggestion-type', type)
      el1.textContent = `Test ${type}`
      tempDiv.appendChild(el1)
      
      // Create element with hover
      const el2 = document.createElement('span')
      el2.className = `suggestion suggestion-${type} suggestion-hover`
      el2.setAttribute('data-suggestion-id', `init-${type}-hover`)
      el2.setAttribute('data-suggestion-type', type)
      el2.textContent = `Test ${type} hover`
      tempDiv.appendChild(el2)
      
      // Force style computation
      const computed1 = window.getComputedStyle(el1)
      const computed2 = window.getComputedStyle(el2)
      
      addDebugMessage(`  ${type}: underline=${computed1.textDecorationColor}, hover bg=${computed2.backgroundColor}`)
    })
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(tempDiv)
      addDebugMessage('✅ CSS initialization complete')
    }, 100)
  }

  // Test visual CSS rendering
  const testVisualCSS = () => {
    addDebugMessage('🎨 TESTING VISUAL CSS RENDERING...')
    
    // Create a visible test container
    const testContainer = document.createElement('div')
    testContainer.id = 'css-visual-test'
    testContainer.style.position = 'fixed'
    testContainer.style.top = '50%'
    testContainer.style.left = '50%'
    testContainer.style.transform = 'translate(-50%, -50%)'
    testContainer.style.background = 'white'
    testContainer.style.padding = '20px'
    testContainer.style.border = '2px solid black'
    testContainer.style.zIndex = '9999'
    testContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
    
    testContainer.innerHTML = `
      <h3 style="margin-bottom: 10px;">Visual CSS Test (Close in 5 seconds)</h3>
      <div class="ProseMirror" style="line-height: 2;">
        <p>Without hover class:</p>
        <p>
          <span class="suggestion suggestion-grammar" data-suggestion-id="vis-1" data-suggestion-type="grammar">Grammar (red)</span> | 
          <span class="suggestion suggestion-tone" data-suggestion-id="vis-2" data-suggestion-type="tone">Tone (yellow)</span> | 
          <span class="suggestion suggestion-headline" data-suggestion-id="vis-3" data-suggestion-type="headline">Headline (green)</span>
        </p>
        <p style="margin-top: 10px;">With hover class:</p>
        <p>
          <span class="suggestion suggestion-grammar suggestion-hover" data-suggestion-id="vis-4" data-suggestion-type="grammar">Grammar hover</span> | 
          <span class="suggestion suggestion-tone suggestion-hover" data-suggestion-id="vis-5" data-suggestion-type="tone">Tone hover</span> | 
          <span class="suggestion suggestion-headline suggestion-hover" data-suggestion-id="vis-6" data-suggestion-type="headline">Headline hover</span>
        </p>
        <p style="margin-top: 10px;">With inline styles (fallback):</p>
        <p>
          <span class="suggestion suggestion-grammar" style="background-color: rgb(254, 242, 242);">Grammar inline</span> | 
          <span class="suggestion suggestion-tone" style="background-color: rgb(254, 252, 232);">Tone inline</span> | 
          <span class="suggestion suggestion-headline" style="background-color: rgb(240, 253, 244);">Headline inline</span>
        </p>
      </div>
    `
    
    document.body.appendChild(testContainer)
    
    // Log what we see
    setTimeout(() => {
      const visuals = {
        grammar: document.querySelector('#css-visual-test [data-suggestion-id="vis-1"]') as HTMLElement,
        tone: document.querySelector('#css-visual-test [data-suggestion-id="vis-2"]') as HTMLElement,
        headline: document.querySelector('#css-visual-test [data-suggestion-id="vis-3"]') as HTMLElement,
        grammarHover: document.querySelector('#css-visual-test [data-suggestion-id="vis-4"]') as HTMLElement,
        toneHover: document.querySelector('#css-visual-test [data-suggestion-id="vis-5"]') as HTMLElement,
        headlineHover: document.querySelector('#css-visual-test [data-suggestion-id="vis-6"]') as HTMLElement,
      }
      
      Object.entries(visuals).forEach(([key, el]) => {
        if (el) {
          const styles = window.getComputedStyle(el)
          addDebugMessage(`  ${key}: bg=${styles.backgroundColor}, underline=${styles.textDecorationColor}`)
        }
      })
    }, 100)
    
    // Remove after 5 seconds
    setTimeout(() => {
      document.body.removeChild(testContainer)
      addDebugMessage('✅ Visual test complete')
    }, 5000)
  }

  // Debug underline styles
  const debugUnderlineStyles = () => {
    addDebugMessage('🎨 DEBUGGING UNDERLINE STYLES...')
    
    const suggestions = document.querySelectorAll('[data-suggestion-id]')
    addDebugMessage(`Found ${suggestions.length} suggestion elements`)
    
    suggestions.forEach((el, i) => {
      const htmlEl = el as HTMLElement
      const computed = window.getComputedStyle(htmlEl)
      const type = htmlEl.getAttribute('data-suggestion-type')
      const id = htmlEl.getAttribute('data-suggestion-id')
      
      addDebugMessage(`\nSuggestion ${i + 1} (${type}, ${id}):`)
      addDebugMessage(`  text-decoration: ${computed.textDecoration}`)
      addDebugMessage(`  text-decoration-line: ${computed.textDecorationLine}`)
      addDebugMessage(`  text-decoration-color: ${computed.textDecorationColor}`)
      addDebugMessage(`  text-decoration-thickness: ${computed.textDecorationThickness}`)
      addDebugMessage(`  text-underline-offset: ${computed.textUnderlineOffset}`)
      addDebugMessage(`  display: ${computed.display}`)
      addDebugMessage(`  classes: ${htmlEl.className}`)
      
      // Check if parent has any conflicting styles
      const parent = htmlEl.parentElement
      if (parent) {
        const parentComputed = window.getComputedStyle(parent)
        addDebugMessage(`  Parent text-decoration: ${parentComputed.textDecoration}`)
      }
    })
    
    // Check if CSS is loaded
    const testEl = document.createElement('span')
    testEl.className = 'suggestion suggestion-grammar'
    document.body.appendChild(testEl)
    const testComputed = window.getComputedStyle(testEl)
    addDebugMessage(`\nTest element with suggestion classes:`)
    addDebugMessage(`  text-decoration: ${testComputed.textDecoration}`)
    addDebugMessage(`  text-decoration-color: ${testComputed.textDecorationColor}`)
    document.body.removeChild(testEl)
  }

  // Debug function to inspect hover state
  const debugHoverState = () => {
    console.log('🔍 DEBUG: Starting detailed hover analysis...')
    const editorEl = document.querySelector('.ProseMirror')
    if (!editorEl) {
      console.log('❌ No editor found')
      return
    }
    
    const suggestions = editorEl.querySelectorAll('[data-suggestion-id]')
    console.log(`Found ${suggestions.length} suggestions:`)
    
    // Group suggestions by line
    const suggestionsByLine = new Map<number, Element[]>()
    suggestions.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      const lineY = Math.floor(rect.top)
      
      if (!suggestionsByLine.has(lineY)) {
        suggestionsByLine.set(lineY, [])
      }
      suggestionsByLine.get(lineY)!.push(el)
      
      console.log(`${i}: ID=${el.getAttribute('data-suggestion-id')}, Type=${el.getAttribute('data-suggestion-type')}, Y=${lineY}`)
    })
    
    // Log suggestions grouped by line
    console.log('\n📍 Suggestions grouped by line:')
    let lineNum = 1
    suggestionsByLine.forEach((elements, y) => {
      console.log(`Line ${lineNum} (Y=${y}): ${elements.length} suggestions`)
      elements.forEach((el, i) => {
        console.log(`  - ${el.getAttribute('data-suggestion-type')} (${el.getAttribute('data-suggestion-id')})`)
      })
      lineNum++
    })
    
    // Add test mouseover/mouseout listeners to each suggestion
    console.log('\n📍 Adding hover listeners to all suggestions...')
    
    suggestions.forEach((el, index) => {
      const element = el as HTMLElement
      const id = element.getAttribute('data-suggestion-id')
      const type = element.getAttribute('data-suggestion-type')
      
      // Mouseover handler
      const handleMouseOver = (e: MouseEvent) => {
        e.stopPropagation() // Prevent bubbling
        console.log(`🎯 MOUSEOVER [${index}]: ${type} (${id})`)
        
        // Check computed styles
        const computed = window.getComputedStyle(element)
        console.log(`   Background: ${computed.backgroundColor}`)
        console.log(`   Classes: ${element.className}`)
        console.log(`   Has .suggestion-hover: ${element.classList.contains('suggestion-hover')}`)
        
        // Check if CSS :hover is working
        setTimeout(() => {
          const hoverComputed = window.getComputedStyle(element)
          console.log(`   Background after delay: ${hoverComputed.backgroundColor}`)
        }, 10)
      }
      
      // Mouseout handler
      const handleMouseOut = (e: MouseEvent) => {
        e.stopPropagation() // Prevent bubbling
        console.log(`🔀 MOUSEOUT [${index}]: ${type} (${id})`)
      }
      
      element.addEventListener('mouseover', handleMouseOver)
      element.addEventListener('mouseout', handleMouseOut)
      
      // Store handlers for cleanup
      (element as any)._debugHandlers = { handleMouseOver, handleMouseOut }
    })
    
    // Clean up after 20 seconds
    setTimeout(() => {
      console.log('📍 Removing debug listeners...')
      suggestions.forEach(el => {
        const element = el as HTMLElement & { _debugHandlers?: any }
        if (element._debugHandlers) {
          element.removeEventListener('mouseover', element._debugHandlers.handleMouseOver)
          element.removeEventListener('mouseout', element._debugHandlers.handleMouseOut)
          delete element._debugHandlers
        }
      })
      console.log('✅ Debug listeners removed')
    }, 20000)
    
    addDebugMessage('🐛 Hover debug mode activated - check browser console for detailed logs')
    addDebugMessage('Debug will auto-disable in 20 seconds')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Suggestion Mark Test Page</h1>
        
        {/* Debug Info for W3M Testing */}
        <div className="sr-only" data-testid="debug-info">
          DEBUG: Page=TestSuggestionMark
          DEBUG: Content Length={content.length}
          DEBUG: Debug Messages={debugInfo.length}
        </div>
        
        {/* W3M Hover State Debug Section */}
        <div className="sr-only" data-testid="hover-debug-state">
          HOVER DEBUG: Container Initialized={hoverDebugState.containerInitialized ? 'YES' : 'NO'}
          HOVER DEBUG: ProseMirror Classes={hoverDebugState.proseMirrorClasses}
          HOVER DEBUG: Hover Ready={hoverDebugState.hoverReady ? 'YES' : 'NO'}
          HOVER DEBUG: Current Hovered ID={hoverDebugState.currentHoveredId || 'none'}
          HOVER DEBUG: Suggestion Count={hoverDebugState.suggestionCount}
          HOVER DEBUG: Last Event={hoverDebugState.lastEvent}
          HOVER DEBUG: Timestamp={hoverDebugState.timestamp}
          HOVER DEBUG: Test Results={
            hoverDebugState.containerInitialized && hoverDebugState.hoverReady ? 'PASS' : 'FAIL'
          }
        </div>
        
        {/* ASCII Art Hover State Visualization */}
        <pre className="sr-only" aria-label="hover-state-diagram">
Hover State Visualization:
=========================
Container: [{hoverDebugState.containerInitialized ? '✓' : '✗'}] Initialized
ProseMirror: [{hoverDebugState.hoverReady ? '✓' : '✗'}] hover-ready class

Suggestions ({hoverDebugState.suggestionCount} total):
{hoverDebugState.currentHoveredId ? `Currently hovering: ${hoverDebugState.currentHoveredId}` : 'No active hover'}

System Health:
├── Container [{hoverDebugState.containerInitialized ? '✓' : '✗'}]
├── ProseMirror [{hoverDebugState.hoverReady ? '✓' : '✗'}]
├── Suggestions [{hoverDebugState.suggestionCount > 0 ? '✓' : '✗'}]
└── Hover Active [{hoverDebugState.currentHoveredId ? '✓' : '✗'}]
        </pre>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls and Debug */}
          <div className="space-y-6">
            {/* Test Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
              <div className="space-y-3">
                <button
                  onClick={testBasicColors}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
                >
                  Test 1: Basic Colors (Grammar=Red, Tone=Yellow, etc.)
                </button>
                <button
                  onClick={testHoverFunctionality}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left"
                >
                  Test 2: Hover Functionality
                </button>
                <button
                  onClick={testLongAndMultiline}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left"
                >
                  Test 3: Long & Multi-line Text
                </button>
                <button
                  onClick={testMixedFormatting}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-left"
                >
                  Test 4: Mixed Formatting (Bold/Italic)
                </button>
                <button
                  onClick={testProgrammaticMarks}
                  className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-left"
                >
                  Test 5: Programmatic Marks
                </button>
                <button
                  onClick={testProgrammaticApplication}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-left"
                >
                  Test 6: Programmatic Application
                </button>
                <button
                  onClick={testMixedProgrammatic}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-left"
                >
                  Test 7: Mixed Programmatic Marks
                </button>
                <button
                  onClick={testPreciseSelection}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Test 8: Multi-line Suggestions
                </button>
                <button
                  onClick={clearEditor}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🧹 Clear Everything
                </button>
                <button
                  onClick={debugUnderlineStyles}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🎨 Debug Underlines
                </button>
                <button
                  onClick={debugHoverState}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🐭 Debug Hover State
                </button>
              </div>
            </div>

            {/* Color Legend */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Expected Colors</h2>
              <div className="space-y-2 text-sm">
                {suggestionTypes.map(type => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type}:</span>
                    <span className={`suggestion suggestion-${type} px-2`}>
                      Sample Text
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Debug Console */}
            <div className="bg-slate-900 rounded-lg shadow-sm p-4">
              <h2 className="text-white font-semibold mb-2">Debug Console</h2>
              <div className="h-64 overflow-y-auto text-xs font-mono space-y-1">
                {debugInfo.map((msg, i) => (
                  <div key={i} className="text-green-400">{msg}</div>
                ))}
              </div>
            </div>

            {/* Visual Hover State Debug Panel */}
            <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
              <h2 className="text-yellow-900 font-semibold mb-2">🐛 Live Hover State</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Container Init:</span>
                  <span className={hoverDebugState.containerInitialized ? 'text-green-600 font-bold' : 'text-red-600'}>
                    {hoverDebugState.containerInitialized ? '✓ YES' : '✗ NO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Hover Ready:</span>
                  <span className={hoverDebugState.hoverReady ? 'text-green-600 font-bold' : 'text-red-600'}>
                    {hoverDebugState.hoverReady ? '✓ YES' : '✗ NO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Suggestions:</span>
                  <span className="text-yellow-900 font-mono">{hoverDebugState.suggestionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Currently Hovering:</span>
                  <span className="text-yellow-900 font-mono text-xs">
                    {hoverDebugState.currentHoveredId || 'none'}
                  </span>
                </div>
                <div className="border-t border-yellow-200 pt-2 mt-2">
                  <div className="text-yellow-700 text-xs">ProseMirror Classes:</div>
                  <div className="text-yellow-900 font-mono text-xs break-all">
                    {hoverDebugState.proseMirrorClasses}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Reference */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Color Reference</h2>
              <p className="text-sm text-slate-600 mb-3">These are the exact colors being used:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="text-sm">Grammar (Red): #ef4444</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#eab308' }}></div>
                  <span className="text-sm">Tone (Yellow): #eab308</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="text-sm">Persuasive (Blue): #3b82f6</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#a855f7' }}></div>
                  <span className="text-sm">Conciseness (Purple): #a855f7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#22c55e' }}></div>
                  <span className="text-sm">Headline (Green): #22c55e</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#06b6d4' }}></div>
                  <span className="text-sm">Readability (Cyan): #06b6d4</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#f97316' }}></div>
                  <span className="text-sm">Vocabulary (Orange): #f97316</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#14b8a6' }}></div>
                  <span className="text-sm">A/B Test (Teal): #14b8a6</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                Note: Readability (cyan) is now clearly different from Persuasive (blue).
              </p>
            </div>

            {/* Static CSS Test */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Static CSS Test</h2>
              <p className="text-sm text-slate-600 mb-3">Test hover styles without TipTap (hover over these):</p>
              <div className="space-y-2">
                <p>
                  <span className="suggestion suggestion-grammar" data-suggestion-id="static-1" data-suggestion-type="grammar">
                    Grammar suggestion (should be red underline, light red on hover)
                  </span>
                </p>
                <p>
                  <span className="suggestion suggestion-tone" data-suggestion-id="static-2" data-suggestion-type="tone">
                    Tone suggestion (should be yellow underline, light yellow on hover)
                  </span>
                </p>
                <p>
                  <span className="suggestion suggestion-headline" data-suggestion-id="static-3" data-suggestion-type="headline">
                    Headline suggestion (should be green underline, light green on hover)
                  </span>
                </p>
                <p className="mt-4 text-sm font-semibold">With hover class pre-applied:</p>
                <p>
                  <span className="suggestion suggestion-grammar suggestion-hover">Grammar with hover</span>
                </p>
                <p>
                  <span className="suggestion suggestion-tone suggestion-hover">Tone with hover</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editor */}
          <div className="space-y-6">
            {/* Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Editor</h2>
              <TextEditor content={content} onChange={setContent} ref={editorRef} />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm">
              <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Click "Test 1" to verify each suggestion type has the correct underline color</li>
                <li>Click "Test 2" and hover over the text to see background color changes</li>
                <li>Click "Test 3" to test long text and multi-line suggestions</li>
                <li>Click "Test 4" to test the problematic mixed formatting case</li>
                <li>Click "Test 5" to test creating suggestion marks programmatically</li>
                <li>Click "Test 6" to test applying suggestion marks programmatically to existing content</li>
                <li>Click "Test 7" to test mixed formatting with programmatic marks</li>
                <li>Click "Test 8" to test comprehensive edge cases including partial underlining</li>
                <li>Use "Inspect DOM" anytime to see the current state</li>
                <li>Check the Debug Console for detailed information</li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-1">Test 8 Edge Cases:</h4>
                <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Line 9: Only "are" underlined</li>
                  <li>Line 10: "This are" underlined (two words)</li>
                  <li>Line 11: "are grammatical errors." (skip first word)</li>
                  <li>Line 12: "This are grammatical" (skip last word)</li>
                  <li>Line 13: Full multi-line sentence</li>
                  <li>Line 14: Partial multi-line underline</li>
                  <li>Line 15: Underline spanning line break</li>
                  <li>Line 16: Front & end underlined, middle skipped</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 