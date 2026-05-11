import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Surfaces render errors instead of a blank page (helps WebGL / loader failures).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[var(--color-bg)] p-6 text-center font-body text-[var(--color-text)]">
          <h1 className="font-display text-xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-sm text-silver-muted">
            The UI crashed. Check the browser console (F12) for details. You can try clearing site
            data for this origin or disabling browser extensions.
          </p>
          <pre className="max-h-40 max-w-full overflow-auto rounded-lg border border-white/10 bg-black/40 p-3 text-left font-mono text-xs text-amber-200/90">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            className="rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
