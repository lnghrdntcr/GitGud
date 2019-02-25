const Bot = require('node-telegram-bot-api')
const { GITHUB_AUTH_LINK } = require('../utils/constants')
const { storeUser } = require('../utils/db')

const bot = new Bot(process.env.BOT_TOKEN)

bot.setWebHook(process.env.WEBHOOK_URL)

bot.onText(/\/start/, async msg => {
  const { id: uid } = msg.chat

  // TODO: save user into the database upon first login

  bot.sendMessage(
    uid,
    `Click on this link to authenticate!\n${GITHUB_AUTH_LINK}&state=${uid}`
  )

  await storeUser({ uid, state: 'INIT' })
})

bot.onText(/\/login/, msg => {
  const { id: uid } = msg.chat

  bot.sendMessage(
    uid,
    `Click on this link to authenticate!\n${GITHUB_AUTH_LINK}&state=${uid}`
  )
})

module.exports = bot
