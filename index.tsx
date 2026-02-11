
import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import App from './App';
import './index.css';

// Global debug loggers
window.onerror = (msg, url, line, col, error) => {
  console.error("Global crash:", { msg, url, line, col, error });
};

// Register Service Worker for PWA/Notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW registration failed:', err));
  });
}

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convexUrl = import.meta.env.VITE_CONVEX_URL;

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F2E9DE] flex items-center justify-center p-8">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-black/5 max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center mx-auto text-3xl">🧩</div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-black text-[#1A1A1A] tracking-tight text-center">System Refresh</h1>
              <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] text-center">Charlie caught a glitch</p>
            </div>

            <p className="text-xs font-bold text-gray-400 bg-[#F2E9DE]/30 p-6 rounded-3xl font-mono break-all leading-relaxed text-center">
              {String(this.state.error?.message || this.state.error)}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-black text-white px-8 py-6 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Restart System
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('force_guest_mode', 'true');
                  window.location.reload();
                }}
                className="w-full bg-amber-50 text-amber-700 px-8 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-amber-100 transition-all border border-amber-200/50"
              >
                Enter Guest Mode (Local Only)
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

let convexClient: any = null;
try {
  if (convexUrl) {
    convexClient = new ConvexReactClient(convexUrl);
  }
} catch (e) {
  console.error("Failed to init Convex client", e);
}

function Root() {
  if (!clerkKey) return <div className="p-20 text-center font-serif">Setup Error: Missing Clerk Key</div>;
  if (!convexClient) return <div className="p-20 text-center font-serif">Setup Error: Missing Convex Client</div>;

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkKey}>
        <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
          <App />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<Root />);
}
