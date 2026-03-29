// Runs Drizzle ORM migrations against the database.
// Uses only production dependencies (drizzle-orm + postgres) — safe to run
// inside the standalone Docker image without drizzle-kit.
//
// Usage: node migrate.js
// Requires: DATABASE_URL environment variable

const { drizzle } = require('drizzle-orm/postgres-js')
const { migrate } = require('drizzle-orm/postgres-js/migrator')
const postgres = require('postgres')
const path = require('path')

async function main() {
  const connectionString = process.env['DATABASE_URL']
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const client = postgres(connectionString, { prepare: false, max: 1 })
  const db = drizzle(client)

  console.log('Running database migrations...')
  await migrate(db, { migrationsFolder: path.join(__dirname, 'lib/db/migrations') })
  console.log('Migrations complete.')

  await client.end()
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
