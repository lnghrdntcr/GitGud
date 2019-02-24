const Bot = require('node-telegram-bot-api')
const { GITHUB_AUTH_LINK } = require('../utils/constants')

const bot = new Bot(process.env.BOT_TOKEN)

bot.setWebHook(process.env.WEBHOOK_URL)

bot.onText(/\/login/, msg => {
  const { id: uid } = msg.chat

  bot.sendMessage(
    uid,
    `Click on this link to authenticate!\n${GITHUB_AUTH_LINK}`
  )
})

module.exports = bot
