import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('SlotGame ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          id="slot-error-boundary"
          className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#2a0c05] via-[#120402] to-black text-white select-none text-center"
        >
          <div className="max-w-md w-full p-6 rounded-2xl bg-black/90 border-2 border-amber-400 shadow-[0_0_50px_rgba(239,68,68,0.5),inset_0_2px_4px_rgba(255,255,255,0.2)]">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-950/80 border border-red-500/80 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              <AlertTriangle size={32} />
            </div>

            <h1 className="font-russo text-2xl text-yellow-300 uppercase tracking-wider mb-2">
              Golden 50 Auto-Recovery
            </h1>

            <p className="font-montserrat text-xs text-stone-300 mb-6 leading-relaxed">
              The game encountered an unexpected rendering interrupt. Click below to instantly resume your session.
            </p>

            {this.state.error && (
              <div className="text-left font-mono text-[10px] text-red-300 bg-red-950/50 p-2.5 rounded-lg border border-red-900/50 mb-6 max-h-24 overflow-auto">
                {this.state.error.toString()}
              </div>
            )}

            <button
              id="error-boundary-recovery-btn"
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-6 rounded-xl font-russo text-sm text-yellow-950 uppercase tracking-wider bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 hover:from-yellow-100 hover:to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.8)] border border-yellow-100 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={18} className="animate-spin" />
              Resume Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
