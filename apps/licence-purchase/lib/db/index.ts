import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

type Db = ReturnType<typeof drizzle<typeof schema>>

let _db: Db | null = null

function getDb(): Db {
  if (_db) return _db
  const connectionString = process.env['DATABASE_URL']
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }
  const client = postgres(connectionString, { prepare: false })
  _db = drizzle(client, { schema })
  return _db
}

// Proxy defers the client construction to first use so `next build` can import
// modules that touch `db` without requiring DATABASE_URL at build time.
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const d = getDb()
    const value = Reflect.get(d, prop, receiver)
    return typeof value === 'function' ? value.bind(d) : value
  },
})
