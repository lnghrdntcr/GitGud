const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const bot = require('./bot/bot')
const { checkConfig } = require('./utils/configure')
const { storeToken, updateUser } = require('./utils/db')

const { DEFAULT_PORT, GITHUB_ACCESS_TOKEN_LINK } = require('./utils/constants')

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

  storeToken({ uid: state, access_token: resp.access_token })
  updateUser({ uid, state: 'AUTHENTICATED' })

  bot.sendMessage(state, 'Successfully authenticated!')

  console.log(resp)

  //res.redirect('http://t.me/git_gud_bot')
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
