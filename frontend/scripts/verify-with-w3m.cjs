#!/usr/bin/env node

/**
 * Node.js W3M Verification Script
 * Provides more sophisticated parsing and testing capabilities
 * Usage: node verify-with-w3m.js [url]
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

// Test configuration
const config = {
  defaultUrl: 'http://localhost:3000/test-w3m-suggestions.html',
  timeout: 10000
};

/**
 * Fetch page content using w3m
 */
async function fetchWithW3m(url) {
  try {
    const { stdout, stderr } = await execPromise(
      `w3m -dump "${url}?debug=true"`, 
      { timeout: config.timeout }
    );
    
    if (stderr) {
      console.error(`${colors.red}W3M Error: ${stderr}${colors.reset}`);
    }
    
    return stdout;
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

/**
 * Extract debug information from various sections
 */
function extractDebugInfo(output) {
  const debugInfo = {};
  
  // Extract JSON from DEBUG-START/END section
  const stateMatch = output.match(/\[DEBUG-START:STATE\]([\s\S]*?)\[DEBUG-END:STATE\]/);
  if (stateMatch) {
    try {
      debugInfo.state = JSON.parse(stateMatch[1].trim());
    } catch (e) {
      debugInfo.state = null;
      debugInfo.stateError = e.message;
    }
  }
  
  // Extract test results
  const testMatch = output.match(/Automated Test Results[\s\S]*?Overall Status: ([^\n]+)/);
  if (testMatch) {
    debugInfo.testStatus = testMatch[1].trim();
    
    // Count test results
    const passedTests = (output.match(/✓/g) || []).length;
    const failedTests = (output.match(/✗/g) || []).length;
    
    debugInfo.testResults = {
      passed: passedTests,
      failed: failedTests,
      total: passedTests + failedTests
    };
  }
  
  // Extract ASCII visualization
  const asciiMatch = output.match(/Component Status:[\s\S]*?Component Health:[\s\S]*?└[^\n]+/);
  if (asciiMatch) {
    debugInfo.hasAsciiVisualization = true;
    debugInfo.asciiVisualization = asciiMatch[0];
  }
  
  // Extract basic debug values
  const textLengthMatch = output.match(/Text Length: (\d+)/);
  if (textLengthMatch) {
    debugInfo.textLength = parseInt(textLengthMatch[1]);
  }
  
  const loadingMatch = output.match(/Loading: (true|false)/);
  if (loadingMatch) {
    debugInfo.loading = loadingMatch[1] === 'true';
  }
  
  return debugInfo;
}

/**
 * Run assertions on extracted debug info
 */
function runAssertions(debugInfo) {
  const assertions = [];
  
  // Check if state was extracted
  assertions.push({
    name: 'State extraction',
    passed: debugInfo.state !== null && !debugInfo.stateError,
    details: debugInfo.stateError || 'State successfully parsed'
  });
  
  // Check hook initialization
  if (debugInfo.state) {
    assertions.push({
      name: 'Hook initialized',
      passed: debugInfo.state.state?.hookInitialized === true,
      details: 'useSuggestions hook is initialized'
    });
    
    // Check for errors
    assertions.push({
      name: 'No errors',
      passed: debugInfo.state.errors?.length === 0,
      details: debugInfo.state.errors?.length > 0 
        ? `Found ${debugInfo.state.errors.length} errors` 
        : 'No errors detected'
    });
  }
  
  // Check test results
  assertions.push({
    name: 'Test execution',
    passed: debugInfo.testResults?.total > 0,
    details: `${debugInfo.testResults?.passed || 0}/${debugInfo.testResults?.total || 0} tests passed`
  });
  
  // Check ASCII visualization
  assertions.push({
    name: 'ASCII visualization',
    passed: debugInfo.hasAsciiVisualization === true,
    details: 'Component health visualization present'
  });
  
  // Check specific values
  if (debugInfo.textLength !== undefined) {
    assertions.push({
      name: 'Text length readable',
      passed: true,
      details: `Text length: ${debugInfo.textLength} chars`
    });
  }
  
  return assertions;
}

/**
 * Display results with color formatting
 */
function displayResults(assertions, debugInfo) {
  console.log('\n' + '='.repeat(50));
  console.log('W3M Verification Results');
  console.log('='.repeat(50) + '\n');
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  assertions.forEach(assertion => {
    const icon = assertion.passed ? '✓' : '✗';
    const color = assertion.passed ? colors.green : colors.red;
    
    console.log(`${color}${icon} ${assertion.name}${colors.reset}`);
    console.log(`  ${assertion.details}`);
    
    if (assertion.passed) totalPassed++;
    else totalFailed++;
  });
  
  // Summary
  console.log('\n' + '-'.repeat(50));
  console.log(`Total: ${totalPassed + totalFailed} assertions`);
  console.log(`${colors.green}Passed: ${totalPassed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${totalFailed}${colors.reset}`);
  
  // Show debug state if available
  if (debugInfo.state && process.env.SHOW_STATE === 'true') {
    console.log('\n' + '-'.repeat(50));
    console.log('Debug State:');
    console.log(JSON.stringify(debugInfo.state, null, 2));
  }
  
  // Show ASCII visualization if requested
  if (debugInfo.asciiVisualization && process.env.SHOW_VIZ === 'true') {
    console.log('\n' + '-'.repeat(50));
    console.log('ASCII Visualization:');
    console.log(debugInfo.asciiVisualization);
  }
  
  return totalFailed === 0;
}

/**
 * Main execution
 */
async function main() {
  const url = process.argv[2] || config.defaultUrl;
  
  console.log(`${colors.blue}Verifying: ${url}${colors.reset}`);
  
  try {
    // Fetch page content
    const output = await fetchWithW3m(url);
    
    // Extract debug information
    const debugInfo = extractDebugInfo(output);
    
    // Run assertions
    const assertions = runAssertions(debugInfo);
    
    // Display results
    const success = displayResults(assertions, debugInfo);
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for use as module
module.exports = { fetchWithW3m, extractDebugInfo, runAssertions }; 