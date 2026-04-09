'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface PuzzleContextType {
  puzzleSolved: boolean
  solvePuzzle: () => void
  resetPuzzle: () => void
}

const PuzzleContext = createContext<PuzzleContextType>({
  puzzleSolved: false,
  solvePuzzle: () => {},
  resetPuzzle: () => {},
})

export function usePuzzle() {
  return useContext(PuzzleContext)
}

const STORAGE_KEY = 'puzzle-solved'

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [puzzleSolved, setPuzzleSolved] = useState(false)

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      setPuzzleSolved(true)
    }
  }, [])

  // Lock scroll when puzzle is unsolved
  useEffect(() => {
    document.body.style.overflow = puzzleSolved ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [puzzleSolved])

  const solvePuzzle = useCallback(() => {
    setPuzzleSolved(true)
    localStorage.setItem(STORAGE_KEY, '1')
  }, [])

  const resetPuzzle = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }, [])

  return (
    <PuzzleContext.Provider value={{ puzzleSolved, solvePuzzle, resetPuzzle }}>
      {children}
    </PuzzleContext.Provider>
  )
}
