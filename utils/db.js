/**
 * Dependency Import
 */
const { Pool, Client } = require('pg')

const { encode, decode } = require('./crypto')

/**
 * Create a connection pool for the database
 * @type {Pool}
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

async function updateUser({ uid, state }) {
  const client = await connect()
  try {
    await client.query(
      'INSERT INTO account VALUES($1, $2) ON CONFLICT (user_id) DO UPDATE SET state = $3',
      [uid, state, state]
    )

    await client.release()
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
      'INSERT INTO token VALUES($1, $2) ON CONFLICT (user_id) DO UPDATE SET token = $3',
      [uid, encodedToken, encodedToken]
    )

    await client.release()
  } catch (err) {
    await client.release()
    throw err
  }
}

/**
 * Retrieves the saved token from the database
 * @param {string} uid
 * @returns The decrypted token
 */
async function retrieveToken(uid) {
  console.log('Called with uid ' + uid)
  const client = await connect()

  try {
    const { rows: token } = await client.query(
      'SELECT token from token where user_id = $1 LIMIT 1',
      [uid.toString()]
    )

    // TODO: If the user doesn't exist, throw an error
    if (token.length === 0) throw new Error('AUTH_NEEDED')

    return decode(token[0].token)
  } catch (err) {
    await client.release()
    throw err
  }
}

module.exports = {
  connect,
  storeToken,
  updateUser,
  retrieveToken
}
