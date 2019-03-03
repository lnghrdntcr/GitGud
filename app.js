const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const bot = require('./bot/bot')
const { checkConfig } = require('./utils/configure')
const { storeToken, updateUser } = require('./api/db')
const { getApiURLByToken } = require('./api/github')
const { formatCommits } = require('./utils/utils')

const {
  DEFAULT_PORT,
  GITHUB_ACCESS_TOKEN_LINK,
  AUTHENTICATED
} = require('./utils/constants')

const app = express()

app.use(bodyParser.json())

app.post('/' + process.env.BOT_TOKEN, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

app.get('/auth', async (req, res) => {
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
})

app.post('/hooks/:uid', (req, res) => {
  const { uid } = req.params

  bot.sendMessage(
    uid,
    formatCommits(req.body.repository.full_name, req.body.commits),
    {
      parse_mode: 'Markdown'
    }
  )

  res.sendStatus(200)
})

app.use(function(err, req, res, next) {
  res.status(500).send(err.stack)
})

app.listen(process.env.PORT || DEFAULT_PORT, async () => {
  try {
    await checkConfig()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('App listening on port ' + (process.env.PORT || DEFAULT_PORT))
})
