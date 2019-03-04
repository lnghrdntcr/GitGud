const fetch = require('node-fetch')

const { GITHUB_AUTH_LINK } = require('../utils/constants')
const {
  updateUser,
  retrieveToken,
  saveRepo,
  retrieveRepos
} = require('../api/db')
const { INIT, GITHUB_REPO_URL } = require('../utils/constants')
const { createWebHook, getApiURLByToken } = require('../api/github')

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

    bot.sendMessage(
      uid,
      'These are the repos you can monitor, click on one (or multiple of them) to be notified when a push occurs!',
      {
        reply_markup: {
          inline_keyboard: [
            ...res.map(el => {
              return [
                {
                  text: el.name,
                  callback_data: `${uid}#${el.name}#monitor`
                }
              ]
            })
          ]
        }
      }
    )
  } catch (err) {
    if (err.message === 'AUTH_NEEDED')
      bot.sendMessage(uid, "You're not authenticated, /login!")
    else
      bot.sendMessage(
        uid,
        'There was a problem listing your repositories, try /login again!'
      )
  }
}

const onUnmonitor = bot => async msg => {
  const { id: uid } = msg.chat

  try {
    const repos = await retrieveRepos(uid)
    bot.sendMessage(
      uid,
      'These are the repos you can monitor, click on one (or multiple of them) to be notified when a push occurs!',
      {
        reply_markup: {
          inline_keyboard: [
            ...repos.map(repo => {
              return [
                {
                  text: repo,
                  callback_data: `${uid}#${repo}#unmonitor`
                }
              ]
            })
          ]
        }
      }
    )
  } catch (err) {
    console.log(err)
  }
}

const onCallbackQuery = bot => async answer => {
  const [uid, repoName, actionStatus] = answer.data.split('#')
  console.log(uid + ' => ' + repoName + ' => ' + actionStatus)

  if (actionStatus === 'monitor') {
    try {
      const token = await retrieveToken(uid)
      const api_url = await getApiURLByToken(token)

      await saveRepo({ uid, repoName })
      await createWebHook({ token, api_url, repoName, uid })

      bot.sendMessage(uid, 'Ok! Monitoring ' + repoName)
      return
    } catch (err) {
      console.log(err)
      if (!err.message.includes('duplicate'))
        bot.sendMessage(
          uid,
          'There was a problem activating the monitoring of your repo, please try again later'
        )
      return
    }
  } else {
    // unmonitor
  }
}

module.exports = {
  onStart,
  onLogin,
  onList,
  onUnmonitor,
  onCallbackQuery
}
