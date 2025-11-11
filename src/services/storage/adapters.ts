/**
 * Storage Adapters
 * Reusable storage adapter implementations
 */

import type { StorageAdapter } from './types'

/**
 * LocalStorage adapter implementation
 * Provides a consistent interface for localStorage operations with error handling
 */
export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error)
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage', error)
    }
  }

  has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null
    } catch (error) {
      console.warn(`Failed to check item in localStorage: ${key}`, error)
      return false
    }
  }
}

// Create and export singleton instance
export const localStorageAdapter = new LocalStorageAdapter()
