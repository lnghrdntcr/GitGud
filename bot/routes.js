const fetch = require('node-fetch')

const { GITHUB_AUTH_LINK } = require('../utils/constants')
const { updateUser, retrieveToken } = require('../utils/db')
const { INIT, GITHUB_REPO_URL } = require('../utils/constants')

const onStart = bot => async msg => {
  const { id: uid } = msg.chat

  bot.sendMessage(
    uid,
    `Click on this link to authenticate!\n${GITHUB_AUTH_LINK}&state=${uid}`
  )
  try {
    await updateUser({ uid, state: INIT })
  } catch (err) {
    bot.sendMessage(
      uid,
      'An error occurred, try /start again.\n If the problem persists, contact the developer francesco.sgherzi.dev@gmail.com'
    )
  }
}

const onLogin = bot => msg => {
  const { id: uid } = msg.chat

  bot.sendMessage(
    uid,
    `Click on this link to authenticate!\n${GITHUB_AUTH_LINK}&state=${uid}`
  )
}

const onList = bot => async msg => {
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

    bot.sendMessage(
      uid,
      response + res.map(el => '⚫ ' + el.name.replace(',', '') + '\n')
    )
  } catch (err) {
    bot.sendMessage(
      uid,
      'There was a problem listing your repositories, try /login again!'
    )
  }
}

module.exports = {
  onStart,
  onLogin,
  onList
}
