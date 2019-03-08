const fetch = require('node-fetch')

const bot = require('../bot/bot')

const { storeToken, updateUser } = require('../api/db')
const { getApiURLByToken } = require('../api/github')
const { formatCommits } = require('../utils/utils')
const { onErrorBlockedBot } = require('../bot/routes')

const {
  GITHUB_ACCESS_TOKEN_LINK,
  AUTHENTICATED
} = require('../utils/constants')

const botProcessMessage = (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
}

const authUser = async (req, res) => {
  const { code: tempToken, state } = req.query

  let resp = await fetch(
    GITHUB_ACCESS_TOKEN_LINK +
      '?' +
      'client_id=' +
      process.env.GITHUB_CLIENT_ID +
      '&' +
      'client_secret=' +
      process.env.GITHUB_CLIENT_SECRET +
      '&' +
      'code=' +
      tempToken,
    {
      headers: new fetch.Headers({
        Accept: 'application/json'
      })
    }
  )

  resp = await resp.json()

  const api_url = await getApiURLByToken(resp.access_token)

  storeToken({ uid: state, access_token: resp.access_token, api_url })
  updateUser({ uid: state, state: AUTHENTICATED })

  bot.sendMessage(
    state,
    'Successfully authenticated! Now write /list to list all the repo you can monitor'
  )

  res.sendStatus(200)
}

const onGithubEvent = async (req, res) => {
  const { uid } = req.params

  console.log('RECEIVED GITHUB EVENT')
  try {
    await bot.sendMessage(
      uid,
      formatCommits(req.body.repository.full_name, req.body.commits),
      {
        parse_mode: 'Markdown'
      }
    )
  } catch (err) {
    err.uid = uid
    // If there's an error here, it means that the user has blocked the bot
    onErrorBlockedBot(err)
  }

  res.sendStatus(200)
}

const onError = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') res.sendStatus(500)
  else res.status(500).send(err.stack)
}

module.exports = {
  botProcessMessage,
  authUser,
  onGithubEvent,
  onError
}
