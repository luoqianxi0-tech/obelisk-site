import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="text-4xl font-light tracking-[0.2em] mb-4">ERROR</div>
            <div className="h-[1px] w-16 bg-black/20 mx-auto mb-6" />
            <p className="text-sm text-black/40 mb-6">Something went wrong. Please refresh the page.</p>
            <pre className="text-[10px] text-black/30 bg-black/5 p-3 rounded overflow-auto max-h-40">{this.state.error?.toString()}</pre>
            <button onClick={() => window.location.reload()} className="btn-primary mt-6">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}