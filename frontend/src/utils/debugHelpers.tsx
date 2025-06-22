import React from 'react'

// Check if debug mode is enabled
export const isDebugMode = () => {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('debug')
}

// HOC for adding debug info to any component
export function withDebugInfo<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function DebugWrapped(props: P) {
    const renderTime = new Date().toISOString()
    
    if (!isDebugMode()) {
      return <Component {...props} />
    }
    
    return (
      <>
        <div className="sr-only" data-debug-component={componentName}>
          [DEBUG-START:{componentName}]
          Props: {JSON.stringify(props)}
          Rendered: {renderTime}
        </div>
        <Component {...props} />
        <div className="sr-only">
          [DEBUG-END:{componentName}]
        </div>
      </>
    )
  }
}

// ASCII Art State Visualization
export function createASCIIVisualization(state: {
  suggestions: { total: number; accepted: number; rejected: number; pending: number }
  loading: boolean
  error: boolean
  textLength: number
}) {
  const { suggestions, loading, error, textLength } = state
  
  // Calculate percentages
  const acceptanceRate = suggestions.total > 0 
    ? Math.round((suggestions.accepted / suggestions.total) * 100) 
    : 0
  
  // Create progress bars
  const createProgressBar = (value: number, max: number, width = 10) => {
    const filled = Math.round((value / max) * width)
    const empty = width - filled
    return '█'.repeat(filled) + '░'.repeat(empty)
  }
  
  return `
Component Status:
================
Loading: ${loading ? '⟳ In Progress' : '✓ Complete'}
Error:   ${error ? '✗ Error Detected' : '✓ No Errors'}
Text:    ${textLength} chars

Suggestions Overview:
====================
Total:     ${suggestions.total}
Accepted:  ${createProgressBar(suggestions.accepted, suggestions.total)} ${suggestions.accepted}/${suggestions.total}
Rejected:  ${createProgressBar(suggestions.rejected, suggestions.total)} ${suggestions.rejected}/${suggestions.total}
Pending:   ${createProgressBar(suggestions.pending, suggestions.total)} ${suggestions.pending}/${suggestions.total}

Acceptance Rate: [${createProgressBar(acceptanceRate, 100, 20)}] ${acceptanceRate}%

Component Health:
================
├── useSuggestions [${loading ? '⟳' : '✓'}]
│   ├── Debouncing [✓]
│   ├── API Calls [${error ? '✗' : '✓'}]
│   └── State Mgmt [✓]
└── UI Components [✓]
    ├── Text Input [✓]
    ├── Status Panel [✓]
    └── Suggestions [${suggestions.total > 0 ? '✓' : '○'}]
`
}

// Meta tag generator for debug info
export function DebugMetaTags({ pageInfo }: { pageInfo: Record<string, any> }) {
  if (!isDebugMode()) return null
  
  // Note: This would be used with react-helmet or similar
  // For now, return debug info as hidden div
  return (
    <div className="sr-only" data-debug-meta="true">
      debug:page={pageInfo.page || 'unknown'}
      debug:timestamp={new Date().toISOString()}
      debug:auth={pageInfo.authenticated ? 'true' : 'false'}
      debug:components={pageInfo.components?.join(',') || ''}
      debug:errors={(pageInfo.errors?.length || 0).toString()}
      debug:version={pageInfo.version || '1.0.0'}
    </div>
  )
}

// Test result formatter
export function formatTestResults(tests: Array<{ name: string; passed: boolean; details?: string }>) {
  const timestamp = new Date().toISOString()
  const passed = tests.filter(t => t.passed).length
  const total = tests.length
  
  return `
Automated Test Results
======================
Timestamp: ${timestamp}
Summary: ${passed}/${total} tests passed

Test Details:
${tests.map(test => 
  `${test.passed ? '✓' : '✗'} ${test.name}${test.details ? ` - ${test.details}` : ''}`
).join('\n')}

Overall Status: ${passed === total ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}
`
} 