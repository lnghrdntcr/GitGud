/**
 * Dependency Import
 */
const { Pool, Client } = require('pg')

const { encode } = require('./crypto')

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
    await client.query(
      'INSERT INTO account VALUES($1, $2) ON CONFLICT(user_id) DO UPDATE account SET state = $3 WHERE user_id = $4',
      [uid, state, state, uid]
    )
  } catch (err) {
    await client.release()
    throw err
  }
}

async function storeToken({ uid, access_token }) {
  const client = await connect()
  const encodedToken = encode(access_token)
  try {
    await client.query(
      'INSERT INTO token VALUES($1, $2) ON CONFILCT(user_id) DO UPDATE token SET token = $3 WHERE user_id = $4',
      [uid, encodedToken, encodedToken, uid]
    )
  } catch (err) {
    await client.release()
    throw err
  }
}

module.exports = {
  connect,
  storeToken,
  storeUser
}
