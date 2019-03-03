const fetch = require('node-fetch')
const { GITHUB_BASE_URL, HEROKU_HOOKS_URL } = require('../utils/constants')

async function createWebHook({ token, api_url, repoName, uid }) {
  // TODO: Create a webhook

  const repoHooksURL =
    api_url.replace('users', 'repos') + '/' + repoName + '/hooks'

  console.log(repoHooksURL)

  let res = await fetch(repoHooksURL, {
    method: 'POST',
    headers: new fetch.Headers({
      Authorization: `token ${token}`
    }),
    body: {
      name: 'web',
      config: {
        url: `${HEROKU_HOOKS_URL}/${uid}`,
        content_type: 'json'
      }
    }
  })

  res = await res.json()
  console.log(res)
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
