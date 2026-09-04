import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#fff', background: '#09090b', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong rendering this component.</h2>
          <pre style={{ color: '#ff4b2e', background: 'rgba(255,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#7c5cff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '16px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
