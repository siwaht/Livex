/**
 * Database abstraction layer
 * Currently uses in-memory storage, easily swappable to PostgreSQL/MongoDB
 * 
 * To migrate to a real database:
 * 1. Install your preferred ORM (Prisma, Drizzle, etc.)
 * 2. Replace the Map-based stores with database queries
 * 3. Update the CRUD functions to use async database operations
 */

export interface Repository<T, CreateInput> {
  getAll(): T[]
  getById(id: string): T | undefined
  create(input: CreateInput): T
  update(id: string, updates: Partial<T>): T | null
  delete(id: string): boolean
}

// Generic in-memory store factory
export function createInMemoryStore<T extends { id: string }, CreateInput>(
  initialData: Map<string, T>,
  createFn: (input: CreateInput) => T
): Repository<T, CreateInput> {
  const store = new Map(initialData)
  
  return {
    getAll: () => Array.from(store.values()),
    getById: (id) => store.get(id),
    create: (input) => {
      const item = createFn(input)
      store.set(item.id, item)
      return item
    },
    update: (id, updates) => {
      const item = store.get(id)
      if (!item) return null
      const updated = { ...item, ...updates, updatedAt: new Date().toISOString() }
      store.set(id, updated as T)
      return updated as T
    },
    delete: (id) => store.delete(id),
  }
}

// Database connection status (for health checks)
export function getDatabaseStatus(): { connected: boolean; type: string } {
  return {
    connected: true,
    type: 'in-memory', // Change to 'postgresql', 'mongodb', etc. when migrating
  }
}
