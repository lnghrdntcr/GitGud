/**
 * Dependency Import
 */
const { Pool, Client } = require('pg')

/**
 * Create a connection pool for the database
 * @type {PG.Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20
})

/**
 * Connects to the database
 * @returns {Promise<Client>}
 */
async function connect() {
  return await pool.connect()
}

async function storeUser({ uid, state }) {
  const client = await connect()
  try {
    await client.query('INSERT INTO account VALUES($1, $2)', [uid, state])
  } catch (err) {
    await client.release()
    throw err
  }
}

module.exports = {
  connect,
  storeUser
}
