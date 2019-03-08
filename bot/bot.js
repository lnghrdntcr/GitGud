const Bot = require('node-telegram-bot-api')
const {
  onStart,
  onLogin,
  onList,
  onUnmonitor,
  onCallbackQuery,
  onErrorBlockedBot
} = require('./routes')

const bot = new Bot(process.env.BOT_TOKEN)

bot.setWebHook(process.env.WEBHOOK_URL)

bot.onText(/\/start/, onStart(bot))

bot.onText(/\/login/, onLogin(bot))

bot.onText(/\/list/, onList(bot))

bot.onText(/\/unmonitor/, onUnmonitor(bot))

bot.on('callback_query', onCallbackQuery(bot)).catch(onErrorBlockedBot)

module.exports = bot
