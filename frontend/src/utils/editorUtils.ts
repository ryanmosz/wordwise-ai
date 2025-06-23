import type { Editor } from '@tiptap/react'

/**
 * Convert character-based position (from AI) to editor position
 * The AI gives us character indices based on plain text,
 * but TipTap uses a more complex position system based on document nodes
 */
export function characterToEditorPosition(
  editor: Editor,
  startChar: number,
  endChar: number
): { from: number; to: number } | null {
  console.log(`[editorUtils] Mapping character positions: ${startChar}-${endChar}`)
  
  let currentChar = 0
  let from: number | null = null
  let to: number | null = null
  
  // Get the document's plain text for reference
  const plainText = editor.state.doc.textContent
  console.log(`[editorUtils] Document plain text length: ${plainText.length}`)
  
  // Traverse the document tree
  editor.state.doc.descendants((node, pos) => {
    // Only process text nodes
    if (node.isText && node.text) {
      const nodeStart = currentChar
      const nodeEnd = currentChar + node.text.length
      
      console.log(`[editorUtils] Text node at pos ${pos}: "${node.text}" (chars ${nodeStart}-${nodeEnd})`)
      
      // Check if our start position is in this node
      if (from === null && startChar >= nodeStart && startChar < nodeEnd) {
        from = pos + (startChar - nodeStart)
        console.log(`[editorUtils] Found start position: ${from} (char ${startChar} in node)`)
      }
      
      // Check if our end position is in this node
      if (to === null && endChar > nodeStart && endChar <= nodeEnd) {
        to = pos + (endChar - nodeStart)
        console.log(`[editorUtils] Found end position: ${to} (char ${endChar} in node)`)
      }
      
      currentChar = nodeEnd
      
      // Early exit if we found both positions
      if (from !== null && to !== null) {
        return false // Stop traversing
      }
    }
  })
  
  if (from === null || to === null) {
    console.error(`[editorUtils] Failed to map positions: from=${from}, to=${to}`)
    return null
  }
  
  console.log(`[editorUtils] Successfully mapped: chars ${startChar}-${endChar} -> positions ${from}-${to}`)
  return { from, to }
}

/**
 * Get the text content at a specific position range
 */
export function getTextAtPosition(editor: Editor, from: number, to: number): string {
  try {
    const text = editor.state.doc.textBetween(from, to)
    console.log(`[editorUtils] Text at positions ${from}-${to}: "${text}"`)
    return text
  } catch (e) {
    console.error('[editorUtils] Error getting text at position:', e)
    return ''
  }
} 