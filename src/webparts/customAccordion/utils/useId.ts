/**
 * Polyfill for React.useId() — available only from React 18.
 * This project targets React 17 (SPFx 1.20 default), so we implement
 * a simple ref-based unique-ID generator instead.
 *
 * The counter is module-level so IDs are unique across all instances on the page.
 */
import { useRef } from 'react';

let counter = 0;

export function useUniqueId(): string {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `sa-${++counter}`;
  }
  return idRef.current;
}
