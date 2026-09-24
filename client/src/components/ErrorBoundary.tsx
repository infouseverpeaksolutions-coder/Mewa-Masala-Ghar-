import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center bg-[#FAF6EC]">
          <div className="max-w-md p-8 bg-white rounded-3xl border border-[#E7E0D0] shadow-sm">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#183B23] mb-2">Something went wrong</h2>
            <p className="text-zinc-600 text-sm mb-6">
              We encountered an unexpected error while rendering this page. Please refresh or return to the home store.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2F5D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#24492D] transition"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-800 rounded-xl text-sm font-semibold hover:bg-zinc-200 transition"
              >
                <Home className="w-4 h-4" /> Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
