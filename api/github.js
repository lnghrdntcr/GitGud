const fetch = require('node-fetch')
const { GITHUB_BASE_URL } = require('../utils/constants')

async function createWebHook({ token, repoName }) {
  // TODO: Create a webhook
}

async function getApiURLByToken(token) {
  let res = await fetch(`${GITHUB_BASE_URL}/user`, {
    headers: new fetch.Headers({
      Authorization: `token ${token}`
    })
  })

  res = await res.json()
  return res.url
}

module.exports = {
  createWebHook,
  getApiURLByToken
}
