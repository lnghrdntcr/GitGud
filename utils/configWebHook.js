const fetch = require('node-fetch')

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

async function checkConfig() {
  await checkWebHook(process.env.WEBHOOK_URL)
}

module.exports = {
  checkConfig
}
