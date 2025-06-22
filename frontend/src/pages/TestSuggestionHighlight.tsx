import React, { useState } from 'react'
import { SuggestionCard } from '../components/editor/SuggestionCard'
import type { Suggestion } from '../types'

export function TestSuggestionHighlight() {
  const [showCard, setShowCard] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)

  // Mock suggestions for testing
  const mockSuggestions: Suggestion[] = [
    {
      id: '1',
      startIndex: 0,
      endIndex: 8,
      type: 'grammar',
      originalText: 'This are',
      suggestionText: 'This is',
      explanation: 'Subject-verb agreement: "This" is singular and requires "is" not "are"',
      confidence: 0.95
    },
    {
      id: '2',
      startIndex: 20,
      endIndex: 31,
      type: 'tone',
      originalText: 'very unique',
      suggestionText: 'distinctive',
      explanation: 'More professional tone: "unique" already means one-of-a-kind, no need for "very"',
      confidence: 0.85
    },
    {
      id: '3',
      startIndex: 40,
      endIndex: 55,
      type: 'persuasive',
      originalText: 'Our product is good',
      suggestionText: 'Our award-winning product transforms your workflow',
      explanation: 'Added credibility marker and outcome-focused language for more persuasive impact',
      confidence: 0.78
    },
    {
      id: '4',
      startIndex: 60,
      endIndex: 75,
      type: 'headline',
      originalText: 'Product Features',
      suggestionText: '5 Game-Changing Features That Boost Productivity 10x',
      explanation: 'Added specificity, benefit, and quantified outcome for attention-grabbing headline',
      confidence: 0.92
    }
  ]

  const handleTextClick = (e: React.MouseEvent<HTMLSpanElement>, suggestion: Suggestion) => {
    // Get the position of the clicked element, not the mouse position
    const rect = e.currentTarget.getBoundingClientRect()
    // Position to the right of the clicked text to avoid obscuring it
    setClickPosition({ 
      x: rect.right, // Position at the right edge of the text
      y: rect.bottom // Always use bottom of text as reference
    })
    setSelectedSuggestion(suggestion)
    setShowCard(true)
  }

  const handleAccept = () => {
    console.log('Accepted suggestion:', selectedSuggestion)
    setShowCard(false)
  }

  const handleReject = () => {
    console.log('Rejected suggestion:', selectedSuggestion)
    setShowCard(false)
  }

  const handleClose = () => {
    console.log('Closed suggestion card')
    setShowCard(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SuggestionCard Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <p className="text-gray-600 mb-4">
            Click on any highlighted text below to see the SuggestionCard popup. 
            Test different positions and suggestion types.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Text with Suggestions</h2>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">
              <span 
                className="border-b-2 border-red-500 cursor-pointer hover:bg-red-50"
                onClick={(e) => handleTextClick(e, mockSuggestions[0])}
              >
                This are
              </span>
              {' '}a test sentence with{' '}
              <span 
                className="border-b-2 border-yellow-500 cursor-pointer hover:bg-yellow-50"
                onClick={(e) => handleTextClick(e, mockSuggestions[1])}
              >
                very unique
              </span>
              {' '}content.
            </p>
            
            <p className="text-lg leading-relaxed mt-4">
              <span 
                className="border-b-2 border-blue-500 cursor-pointer hover:bg-blue-50"
                onClick={(e) => handleTextClick(e, mockSuggestions[2])}
              >
                Our product is good
              </span>
              {' '}and helps you achieve your goals.
            </p>
            
            <h3 className="text-xl font-bold mt-6">
              <span 
                className="border-b-2 border-green-500 cursor-pointer hover:bg-green-50"
                onClick={(e) => handleTextClick(e, mockSuggestions[3])}
              >
                Product Features
              </span>
            </h3>
          </div>
        </div>

        {/* Test position buttons */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Different Positions</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={(e) => {
                setClickPosition({ x: 50, y: 200 })
                setSelectedSuggestion(mockSuggestions[0])
                setShowCard(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Top Left
            </button>
            <button
              onClick={(e) => {
                setClickPosition({ x: window.innerWidth / 2, y: 200 })
                setSelectedSuggestion(mockSuggestions[1])
                setShowCard(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Top Center
            </button>
            <button
              onClick={(e) => {
                setClickPosition({ x: window.innerWidth - 100, y: 200 })
                setSelectedSuggestion(mockSuggestions[2])
                setShowCard(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Top Right
            </button>
            <button
              onClick={(e) => {
                setClickPosition({ x: 50, y: window.innerHeight - 100 })
                setSelectedSuggestion(mockSuggestions[3])
                setShowCard(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Bottom Left
            </button>
            <button
              onClick={(e) => {
                setClickPosition({ x: window.innerWidth / 2, y: window.innerHeight - 100 })
                setSelectedSuggestion(mockSuggestions[0])
                setShowCard(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Bottom Center
            </button>
            <button
              onClick={(e) => {
                setClickPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 })
                setSelectedSuggestion(mockSuggestions[1])
                setShowCard(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Bottom Right
            </button>
          </div>
        </div>
      </div>

      {/* Render SuggestionCard */}
      {showCard && selectedSuggestion && (
        <SuggestionCard
          suggestion={selectedSuggestion}
          position={clickPosition}
          onAccept={handleAccept}
          onReject={handleReject}
          onClose={handleClose}
        />
      )}
    </div>
  )
} 