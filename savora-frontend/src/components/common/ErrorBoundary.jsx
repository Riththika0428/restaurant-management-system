import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="font-display text-3xl font-bold text-orange">Something broke on this page</h1>
          <p className="mt-4 text-sm text-muted">Copy the message below and send it to the developer.</p>
          <pre className="mt-6 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-charcoal p-5 text-sm text-cream">
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}