import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Safe LocalStorage & SessionStorage Globals Fallback for Iframe Sandboxing
try {
  const testKey = "__scope_test_ls_key__";
  window.localStorage.setItem(testKey, "test");
  window.localStorage.removeItem(testKey);
} catch (e) {
  console.warn("[SafeStorage] window.localStorage is blocked. Injecting memory-based localStorage backup.", e);
  const store: Record<string, string> = {};
  const mockStorage: Storage = {
    getItem: (key: string): string | null => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key: string, value: string): void => { store[key] = String(value); },
    removeItem: (key: string): void => { delete store[key]; },
    clear: (): void => { Object.keys(store).forEach(k => delete store[k]); },
    key: (index: number): string | null => Object.keys(store)[index] || null,
    get length(): number { return Object.keys(store).length; }
  };
  try {
    Object.defineProperty(window, "localStorage", { value: mockStorage, configurable: true, writable: true });
  } catch (err) {
    console.warn("[SafeStorage] Failed to redefine window.localStorage via Object.defineProperty. Trying direct assignment.", err);
    try {
      (window as any).localStorage = mockStorage;
    } catch (err2) {
      console.error("[SafeStorage] Could not shim window.localStorage.", err2);
    }
  }
}

try {
  const testKey = "__scope_test_ss_key__";
  window.sessionStorage.setItem(testKey, "test");
  window.sessionStorage.removeItem(testKey);
} catch (e) {
  console.warn("[SafeStorage] window.sessionStorage is blocked. Injecting memory-based sessionStorage backup.", e);
  const store: Record<string, string> = {};
  const mockStorage: Storage = {
    getItem: (key: string): string | null => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key: string, value: string): void => { store[key] = String(value); },
    removeItem: (key: string): void => { delete store[key]; },
    clear: (): void => { Object.keys(store).forEach(k => delete store[k]); },
    key: (index: number): string | null => Object.keys(store)[index] || null,
    get length(): number { return Object.keys(store).length; }
  };
  try {
    Object.defineProperty(window, "sessionStorage", { value: mockStorage, configurable: true, writable: true });
  } catch (err) {
    console.warn("[SafeStorage] Failed to redefine window.sessionStorage via Object.defineProperty. Trying direct assignment.", err);
    try {
      (window as any).sessionStorage = mockStorage;
    } catch (err2) {
      console.error("[SafeStorage] Could not shim window.sessionStorage.", err2);
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

