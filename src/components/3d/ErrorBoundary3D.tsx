'use client'

import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary3D extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Component Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-16 h-16 mb-3 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              3D content temporarily unavailable
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}