/**
 * Storage Types
 * Type definitions for storage adapters and operations
 */

export interface StorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
  has(key: string): boolean
}

export interface StorageConfig {
  prefix?: string
  serializer?: {
    serialize: (value: any) => string
    deserialize: (value: string) => any
  }
}
