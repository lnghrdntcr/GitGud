const express = require('express')
const bodyParser = require('body-parser')

const {
  GITHUB_ACCESS_TOKEN_LINK,
  AUTHENTICATED
} = require('../utils/constants')
const {
  botProcessMessage,
  authUser,
  onGithubEvent,
  onError
} = require('./routes')

const app = express()

app.use(bodyParser.json())

app.post('/' + process.env.BOT_TOKEN, botProcessMessage)

app.get('/auth', authUser)

app.post('/hooks/:uid', onGithubEvent)

app.use(onError)

module.exports = app
