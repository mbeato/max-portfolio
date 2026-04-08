'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface PuzzleContextType {
  puzzleSolved: boolean
  solvePuzzle: () => void
}

const PuzzleContext = createContext<PuzzleContextType>({
  puzzleSolved: false,
  solvePuzzle: () => {},
})

export function usePuzzle() {
  return useContext(PuzzleContext)
}

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [puzzleSolved, setPuzzleSolved] = useState(false)

  // Lock scroll when puzzle is unsolved
  useEffect(() => {
    document.body.style.overflow = puzzleSolved ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [puzzleSolved])

  const solvePuzzle = useCallback(() => setPuzzleSolved(true), [])

  return (
    <PuzzleContext.Provider value={{ puzzleSolved, solvePuzzle }}>
      {children}
    </PuzzleContext.Provider>
  )
}
