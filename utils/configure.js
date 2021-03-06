const fetch = require('node-fetch')
const { connect } = require('../api/db')

const TELEGRAM_BOT_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`

/**
 * Sets the webhook
 * @param {string} url
 */
async function setWebHook(url) {
  let res = await fetch(
    `${TELEGRAM_BOT_URL}/setWebhook?url=${process.env.WEBHOOK_URL}`
  )
  res = await res.json()

  if (!res.ok) {
    let err = new Error('There was a problem setting the Webhook')
    err.body = res
    throw err
  }
}

/**
 * Checks if the webhook is configured to point to the correct url
 * @param {string} url
 */
async function checkWebHook(url) {
  let res = await fetch(`${TELEGRAM_BOT_URL}/getWebhookInfo`)
  res = await res.json()
  console.log('Response from getWebhookInfo')
  console.log(res)
  if (url !== res.result.url) await setWebHook(url)
}

/**
 * CREATE TABLE IF NOT EXISTS myschema.mytable (i integer);
 * Sets up the database, if not configured
 * @param {string} databaseUrl
 */
async function setUpDb() {
  try {
    const client = await connect()

    await client.query('BEGIN')

    await client.query(
      'CREATE TABLE IF NOT EXISTS account(user_id varchar(30) PRIMARY KEY, state VARCHAR(100) NOT NULL)'
    )

    await client.query(
      'CREATE TABLE IF NOT EXISTS repo(user_id varchar(30), repo_name VARCHAR(1000), hook_id INTEGER, PRIMARY KEY(user_id, repo_name))'
    )

    await client.query(
      'CREATE TABLE IF NOT EXISTS token(user_id varchar(30) PRIMARY KEY, token json NOT NULL, api_url VARCHAR(1000) NOT NULL)'
    )

    await client.query('END')
    await client.release()
  } catch (err) {
    await client.release()
    throw err
  }
}

async function checkConfig() {
  console.log('SETTING UP WEBHOOK')
  await checkWebHook(process.env.WEBHOOK_URL)
  console.log('SETTING UP DATABASE')
  await setUpDb()
}

module.exports = {
  checkConfig
}
