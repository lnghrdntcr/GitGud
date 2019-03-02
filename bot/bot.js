const Bot = require('node-telegram-bot-api')
const fetch = require('node-fetch')

const { GITHUB_AUTH_LINK } = require('../utils/constants')
const { updateUser, retrieveToken } = require('../utils/db')
const { INIT, GITHUB_REPO_URL } = require('../utils/constants')

const bot = new Bot(process.env.BOT_TOKEN)

bot.setWebHook(process.env.WEBHOOK_URL)

bot.onText(/\/start/, async msg => {
  const { id: uid } = msg.chat

  bot.sendMessage(
    uid,
    `Click on this link to authenticate!\n${GITHUB_AUTH_LINK}&state=${uid}`
  )
  // TODO: catch this motherfather
  try {
    await updateUser({ uid, state: INIT })
  } catch(err){}
})

bot.onText(/\/login/, msg => {
  const { id: uid } = msg.chat

  bot.sendMessage(
    uid,
    `Click on this link to authenticate!\n${GITHUB_AUTH_LINK}&state=${uid}`
  )
})

bot.onText(/\/list/, async msg => {
  const { id: uid } = msg.chat

  try {

    const token = await retrieveToken(uid)
    
    let res = await fetch(GITHUB_REPO_URL, {
      headers: new fetch.Headers({
        Authorization: `TOKEN ${token}`
      })
    })
    
    res = await res.json()
    
    let response = 'These are the repo you can monitor: \n'
    
    bot.sendMessage(uid, response + res.map(el => '⚫ ' + el.name))

  }catch(err) {
    bot.sendMessage(uid, 'There was a problem listing your repositories, try /login again!')
  }

})

module.exports = bot
