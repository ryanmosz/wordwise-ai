# Underline Rules for Inline Suggestions

## Core Principles

1. **Word Boundary Rule**: Underlines must start and end at word boundaries
   - A word boundary is defined as: space, start of line, or end of line
   - Underlines should NOT break in the middle of a word

2. **Punctuation Inclusion Rule**: When a word has punctuation attached, the punctuation MUST be included in the same underline
   - Examples:
     - "errors." - The entire word including the period must have the same underline
     - "work!" - The exclamation mark must be part of the same underline
     - "complex," - The comma must be included with the word
   - This prevents split underlining where punctuation has a different color than the word

3. **No Overlapping Rule**: Suggestions must NOT overlap
   - Each word or phrase can only belong to ONE suggestion
   - If two suggestions would overlap, they must be adjusted to have clear boundaries
   - Example: "grammatical errors." and "errors are" cannot both exist - adjust boundaries

## Examples

### ✅ CORRECT - Punctuation included with words:
```
This are grammatical [errors.]
The tone here needs [work.]
And this headline is [bad!]
Plus readability [problems.]
```

### ❌ INCORRECT - Punctuation separated:
```
This are grammatical error[s.]  // 's.' has different underline
The tone here needs wor[k.]     // 'k.' has different underline
And this headline is ba[d!]     // 'd!' has different underline
```

### ✅ CORRECT - Clear boundaries between suggestions:
```
[Grammar bad] again! [Headline weak!] [Vocabulary difficult.]
     ^red^            ^green^          ^orange^
```

### ❌ INCORRECT - Overlapping suggestions:
```
[Grammar bad agai][n! Headline] weak!
     ^red^           ^green^
// 'again!' is split between two suggestions
```

## Implementation Guidelines

When applying suggestions programmatically:

1. **Include full words with punctuation**: When searching for text to mark, include any trailing punctuation with the word
2. **Check for overlaps**: Before applying a suggestion, verify it doesn't overlap with existing suggestions
3. **Adjust boundaries**: If overlap is detected, adjust the suggestion boundaries to the nearest word boundary

## Technical Considerations

- When using text search in formatted content (with HTML tags), ensure positions are calculated correctly
- The document's text content should be used for position calculations, not the HTML
- Each suggestion should have a clear start and end position that respects word boundaries

## Summary

The golden rule: **A word and its punctuation are inseparable** - they must always share the same underline color. 