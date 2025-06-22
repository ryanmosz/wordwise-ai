import { useState, useEffect, useRef } from 'react'
import { TextEditor, type TextEditorHandle } from '../components/editor/TextEditor'
import type { SuggestionType } from '../types/suggestion'
import { logSuggestionMarkVerification } from '../utils/verifySuggestionMark'

export function TestSuggestionMark() {
  const [content, setContent] = useState('<p>Click one of the test buttons below to load content with suggestion marks.</p>')
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const editorRef = useRef<TextEditorHandle>(null)

  // Run verification on component mount
  useEffect(() => {
    logSuggestionMarkVerification()
    addDebugMessage('✅ Page loaded - SuggestionMark verification completed')
  }, [])

  const addDebugMessage = (message: string) => {
    console.log(message)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
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
        
        // CRITICAL: Clear selection after applying all marks (like Test 5 does)
        editor.commands.setTextSelection(editor.state.doc.content.size)
        addDebugMessage('🧹 Cleared text selection after applying marks')
        
        // Force a re-render by blurring and refocusing
        editor.commands.blur()
        setTimeout(() => {
          editor.commands.focus()
          addDebugMessage('🔄 Forced re-render by blur/focus cycle')
        }, 50)
        
        // Inspect the result
      setTimeout(() => {
        addDebugMessage('\n🔍 Checking applied marks...')
        inspectCurrentDOM()
        
        // Special check for all suggestions with focus on position
        addDebugMessage('\n🎯 SPECIAL CHECK - POSITION ANALYSIS:')
        const editor = document.querySelector('.ProseMirror')
        if (editor) {
          const allSuggestions = editor.querySelectorAll('[data-suggestion-id]')
          addDebugMessage(`  Total suggestions: ${allSuggestions.length}`)
          
          // Find the last suggestion in the document
          let lastSuggestion: Element | null = null
          let maxOffset = -1
          
          allSuggestions.forEach((el) => {
            const rect = el.getBoundingClientRect()
            const editorRect = editor.getBoundingClientRect()
            const relativeOffset = rect.left - editorRect.left + rect.top - editorRect.top
            
            if (relativeOffset > maxOffset) {
              maxOffset = relativeOffset
              lastSuggestion = el
            }
          })
          
          addDebugMessage('\n  📍 SUGGESTION ORDER AND STYLES:')
          allSuggestions.forEach((el, i) => {
            const htmlEl = el as HTMLElement
            const computedStyle = window.getComputedStyle(htmlEl)
            const type = htmlEl.getAttribute('data-suggestion-type')
            const isLast = el === lastSuggestion
            
            addDebugMessage(`\n  ${i + 1}. ${type?.toUpperCase()} suggestion ("${htmlEl.textContent}"):`)
            addDebugMessage(`    Background: ${computedStyle.backgroundColor}`)
            addDebugMessage(`    Underline: ${computedStyle.textDecorationColor}`)
            addDebugMessage(`    Classes: ${htmlEl.className}`)
            if (isLast) {
              addDebugMessage(`    ⚠️  THIS IS THE LAST SUGGESTION IN THE LINE`)
            }
          })
        }
      }, 100)
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
      editor.commands.setTextSelection(editor.state.doc.content.size)
      addDebugMessage('🧹 Cleared text selection after applying marks')
      
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
    let pos = 0
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
        const remainingSearch = searchText.substring(0, text.length)
        if (searchText.startsWith(text) && text.length < searchText.length) {
          // This might be the start of our search text
          // For now, we'll skip this complex case
        }
      }
    })
    
    return { from: startPos, to: endPos }
  }

  // Test 8: Precise text selection
  const testPreciseSelection = () => {
    addDebugMessage('🎯 TEST 8: Testing precise text selection with proper positions...')
    
    // DIAGNOSTIC: Moving tone (yellow) to the END to see if position matters
    // Set content with formatting - tone is now last
    const content = `<h2>Precise Selection Test</h2><p>This text has <strong>bold words</strong> that need grammar fixes.</p><p>This <strong><em>bold italic</em></strong> headline needs complete rework!</p><p>The <em>italic tone</em> could be improved significantly.</p>`
    setContent(content)
    
    setTimeout(() => {
      const editor = editorRef.current?.getEditor()
      if (!editor) {
        addDebugMessage('❌ No editor instance available')
        return
      }
      
      addDebugMessage('✅ Got editor instance')
      
      // Get the full text content to find positions
      const fullText = editor.state.doc.textContent
      addDebugMessage(`📄 Full document text: "${fullText}"`)
      
      // Test 1: Grammar mark FIRST - "text has bold words that need grammar fixes"
      const grammarText = 'text has bold words that need grammar fixes'
      const grammarStart = fullText.indexOf(grammarText)
      if (grammarStart !== -1) {
        const from = grammarStart + 1 // +1 because ProseMirror positions are 1-based
        const to = from + grammarText.length
        
        addDebugMessage(`📍 Applying grammar mark (FIRST) from ${from} to ${to}`)
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .setMark('suggestion', {
            suggestionId: 'precise-1',
            suggestionType: 'grammar'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find grammar text in full text')
      }
      
      // Test 2: Mark the headline - "This bold italic headline needs complete rework!"
      const headlineText = 'This bold italic headline needs complete rework!'
      const headlineStart = fullText.indexOf(headlineText)
      if (headlineStart !== -1) {
        const from = headlineStart + 1
        const to = from + headlineText.length
        
        addDebugMessage(`📍 Applying headline mark from ${from} to ${to}`)
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .setMark('suggestion', {
            suggestionId: 'precise-3',
            suggestionType: 'headline'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find headline text in full text')
      }
      
      // Test 3: Mark across italic text - "The italic tone could be improved significantly" (NOW LAST)
      const toneText = 'The italic tone could be improved significantly'
      const toneStart = fullText.indexOf(toneText)
      if (toneStart !== -1) {
        const from = toneStart + 1
        const to = from + toneText.length
        
        addDebugMessage(`📍 Applying tone mark (NOW LAST) from ${from} to ${to}`)
        
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .setMark('suggestion', {
            suggestionId: 'precise-2',
            suggestionType: 'tone'
          })
          .run()
      } else {
        addDebugMessage('❌ Could not find tone text in full text')
      }
      
      // CRITICAL: Clear selection after applying all marks
      editor.commands.setTextSelection(editor.state.doc.content.size)
      addDebugMessage('🧹 Cleared text selection after applying marks')
      
      // Force a re-render by blurring and refocusing
      editor.commands.blur()
      setTimeout(() => {
        editor.commands.focus()
        addDebugMessage('🔄 Forced re-render by blur/focus cycle')
        
        // Additional debug: Check if hover colors are working
        setTimeout(() => {
          addDebugMessage('\n🧪 Testing hover functionality on each type:')
          
          // Test grammar hover (now FIRST)
          const grammarEl = document.querySelector('[data-suggestion-id="precise-1"]') as HTMLElement
          if (grammarEl) {
            addDebugMessage('  Testing GRAMMAR (red) hover - FIRST position...')
            grammarEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
            setTimeout(() => {
              const bgColor = window.getComputedStyle(grammarEl).backgroundColor
              addDebugMessage(`    Grammar background after hover: ${bgColor}`)
              grammarEl.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
            }, 50)
          }
          
          // Test headline hover (MIDDLE)
          setTimeout(() => {
            const headlineEls = document.querySelectorAll('[data-suggestion-id="precise-3"]')
            addDebugMessage(`  Found ${headlineEls.length} headline elements`)
            
            if (headlineEls.length > 0) {
              addDebugMessage('  Testing HEADLINE (green) hover - MIDDLE position...')
              const firstHeadline = headlineEls[0] as HTMLElement
              
              // Log initial state
              addDebugMessage(`    Initial classes: ${firstHeadline.className}`)
              addDebugMessage(`    Initial inline style: ${firstHeadline.style.backgroundColor}`)
              
              firstHeadline.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
              
              setTimeout(() => {
                // Check both computed style and inline style
                const computedBg = window.getComputedStyle(firstHeadline).backgroundColor
                const inlineBg = firstHeadline.style.backgroundColor
                addDebugMessage(`    Headline computed background after hover: ${computedBg}`)
                addDebugMessage(`    Headline inline style after hover: ${inlineBg}`)
                addDebugMessage(`    Classes after hover: ${firstHeadline.className}`)
                
                // Also check all headline elements
                headlineEls.forEach((el, idx) => {
                  const htmlEl = el as HTMLElement
                  addDebugMessage(`    Element ${idx} bg: ${htmlEl.style.backgroundColor}`)
                })
                
                firstHeadline.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
              }, 100) // Increased timeout
            }
          }, 150)
          
          // Test tone hover (now LAST)
          setTimeout(() => {
            const toneEl = document.querySelector('[data-suggestion-id="precise-2"]') as HTMLElement
            if (toneEl) {
              addDebugMessage('  Testing TONE (yellow) hover - LAST position...')
              toneEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
              setTimeout(() => {
                const bgColor = window.getComputedStyle(toneEl).backgroundColor
                addDebugMessage(`    Tone background after hover: ${bgColor}`)
                toneEl.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
              }, 50)
            }
          }, 300)
        }, 200)
      }, 50)
      
      // Inspect results
      setTimeout(() => {
        addDebugMessage('\n🔍 Checking precise selection results...')
        inspectCurrentDOM()
      }, 800)
    }, 500)
  }

  // Test 8b: Try creating suggestions like Test 4 does
  const testPreciseSelectionLikeTest4 = () => {
    addDebugMessage('🎯 TEST 8b: Creating suggestions like Test 4 (with classes in HTML)...')
    
    // Create content with suggestion spans already in place
    const content = `
      <h2>Precise Selection Test</h2>
      <p><span class="suggestion suggestion-tone" data-suggestion-id="precise-2" data-suggestion-type="tone">The <em>italic tone</em> could be improved significantly.</span></p>
      <p><span class="suggestion suggestion-headline" data-suggestion-id="precise-3" data-suggestion-type="headline">This <strong><em>bold italic</em></strong> headline needs complete rework!</span></p>
      <p><span class="suggestion suggestion-grammar" data-suggestion-id="precise-1" data-suggestion-type="grammar">This text has <strong>bold words</strong> that need grammar fixes.</span></p>
    `
    
    setContent(content)
    
    // Wait and test hover
    setTimeout(() => {
      addDebugMessage('\n🧪 Testing hover functionality on pre-created elements:')
      
      // Test each type
      const types = [
        { id: 'precise-1', type: 'grammar', name: 'GRAMMAR (red)' },
        { id: 'precise-2', type: 'tone', name: 'TONE (yellow)' },
        { id: 'precise-3', type: 'headline', name: 'HEADLINE (green)' }
      ]
      
      types.forEach((test, index) => {
        setTimeout(() => {
          const el = document.querySelector(`[data-suggestion-id="${test.id}"]`) as HTMLElement
          if (el) {
            addDebugMessage(`  Testing ${test.name} hover...`)
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
            
            setTimeout(() => {
              const bgColor = window.getComputedStyle(el).backgroundColor
              const inlineStyle = el.style.backgroundColor
              addDebugMessage(`    Computed background: ${bgColor}`)
              addDebugMessage(`    Inline style: ${inlineStyle}`)
              addDebugMessage(`    Classes: ${el.className}`)
              
              el.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
            }, 100)
          }
        }, index * 200)
      })
      
      // Inspect DOM after tests
      setTimeout(() => {
        addDebugMessage('\n🔍 Checking Test 8b results...')
        inspectCurrentDOM()
      }, 800)
    }, 500)
  }

  // Debug panel to show current DOM state
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
                  Test 7: Mixed Formatting with Programmatic Marks
                </button>
                <button
                  onClick={testPreciseSelection}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-left"
                >
                  Test 8: Precise Text Selection
                </button>
                <button
                  onClick={testPreciseSelectionLikeTest4}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-left"
                >
                  Test 8b: Like Test 4 (Pre-created)
                </button>
                <div className="border-t pt-3 mt-3 space-y-2">
                  <button
                    onClick={forceCSSInit}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    🎨 Force CSS Init
                  </button>
                  <button
                    onClick={testVisualCSS}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    👁️ Visual CSS Test
                  </button>
                  <button
                    onClick={inspectCurrentDOM}
                    className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    🔍 Inspect Current DOM
                  </button>
                  <button
                    onClick={inspectHeadlineStyles}
                    className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    🔍 Inspect Headline Styles
                  </button>
                  <button
                    onClick={clearEditor}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    🧹 Clear Everything
                  </button>
                </div>
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
                  <div className="w-20 h-1" style={{ backgroundColor: '#22c55e' }}></div>
                  <span className="text-sm">Headline (Green): #22c55e</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1" style={{ backgroundColor: '#14b8a6' }}></div>
                  <span className="text-sm">A/B Test (Teal): #14b8a6</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                If the headline underline matches the green bar above, the CSS is working correctly.
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
                <li>Click "Test 8" to test precise text selection</li>
                <li>Use "Inspect DOM" anytime to see the current state</li>
                <li>Check the Debug Console for detailed information</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 