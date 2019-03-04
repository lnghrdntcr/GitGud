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

async function storeToken({ uid, access_token, api_url }) {
  const client = await connect()
  const encodedToken = encode(access_token)

  try {
    await client.query(
      'INSERT INTO token VALUES($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = $4',
      [uid, encodedToken, api_url, encodedToken]
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

async function saveRepo({ uid, repoName }) {
  const client = await connect()

  try {
    await client.query('INSERT INTO repo VALUES($1, $2)', [uid, repoName])
    await client.release()
  } catch (err) {
    await client.release()
    throw err
  }
}

async function retrieveRepos(uid) {
  const client = await connect()

  try {
    const { rows: repos } = await client.query(
      'SELECT repo_name FROM repo as r JOIN account as a ON r.user_id = a.user_id WHERE a.user_id = $1',
      [uid]
    )

    if (repos.length === 0) throw new Error('AUTH_NEEDED')

    await client.release()
    console.log(repos)
    return repos.map(repo => repo.repo_name)
  } catch (err) {
    await client.release()
    throw err
  }
}

module.exports = {
  connect,
  storeToken,
  updateUser,
  retrieveToken,
  saveRepo,
  retrieveRepos
}
