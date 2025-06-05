import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function formatUrlsFromText(text: string): string[] {
  if (!text) return [];
  return text.split('\n').filter(line => line.trim() && line.trim().startsWith('http'));
}

export function formatArrayFromText(text: string): string[] {
  if (!text) return [];
  return text.split(',').map(item => item.trim()).filter(item => item);
}

export function isGitHubPages(): boolean {
  // Detect if running on GitHub Pages
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('.github.io') || 
          window.location.hostname.includes('techfunhouse.com'));
}
