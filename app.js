const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const bot = require('./bot/bot')
const { checkConfig } = require('./utils/configWebHook')

const { DEFAULT_PORT, GITHUB_ACCESS_TOKEN_LINK } = require('./utils/constants')

const app = express()

app.use(bodyParser.json())

app.post('/' + process.env.BOT_TOKEN, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

app.get('/auth', async (req, res) => {
  const { code: tempToken } = req.query

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
      tempToken +
      '&' +
      'accept=json'
  )

  resp = await resp.json()

  console.log(res)
})

app.listen(process.env.PORT || DEFAULT_PORT, async () => {
  await checkConfig()
  console.log('App listening on port ' + (process.env.PORT || DEFAULT_PORT))
})
