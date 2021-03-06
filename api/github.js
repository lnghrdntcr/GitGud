const fetch = require('node-fetch')
const { GITHUB_BASE_URL, HEROKU_HOOKS_URL } = require('../utils/constants')
const { updateHook, getHookId } = require('./db')

async function createWebHook({ token, api_url, repoName, uid }) {
  const repoHooksURL =
    api_url.replace('users', 'repos') + '/' + repoName + '/hooks'

  let res = await fetch(repoHooksURL, {
    method: 'POST',
    headers: new fetch.Headers({
      Authorization: `token ${token}`
    }),
    body: JSON.stringify({
      name: 'web',
      active: true,
      events: ['push'],
      config: {
        url: `${HEROKU_HOOKS_URL}/${uid}`,
        content_type: 'json'
      }
    })
  })
  res = await res.json()
  console.log(res)
  await updateHook({ uid, repoName, hook_id: res.id })
}

async function deleteWebHook({ token, api_url, repoName, uid }) {
  const repoHooksURL =
    api_url.replace('users', 'repos') + '/' + repoName + '/hooks'

  const hookId = await getHookId(uid, repoName)
  console.log('HOOKID')
  console.log(hookId)
  let res = await fetch(repoHooksURL + '/' + hookId, {
    method: 'DELETE',
    headers: new fetch.Headers({
      Authorization: `token ${token}`
    })
  })
  console.log('RESPONSE FROM DELETE - GITHUB')
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
  deleteWebHook,
  getApiURLByToken
}
