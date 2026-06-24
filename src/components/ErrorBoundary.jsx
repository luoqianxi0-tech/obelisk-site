import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-obelisk-bg p-8">
          <div className="glass-card rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-h-60">
              {this.state.error?.toString?.() || 'Unknown error'}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-obelisk-line text-white rounded-lg text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
