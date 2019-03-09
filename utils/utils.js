const {
  retrieveRepos,
  getUserInfo,
  deleteUser: deleteUserFromDb
} = require('../api/db')
const { deleteWebHook } = require('../api/github')

function formatCommits(repoName, commits) {
  let message = `*${repoName}*:\n`
  commits.forEach(el => {
    message += `${el.committer.name}(_${el.committer.username}_): ${
      el.message
    }\n`
  })
  return message
}

async function deleteUser(uid) {
  const repos = await retrieveRepos(uid) // gets repo name
  const userInfo = await getUserInfo(uid) // gets {token, api_url}

  Promise.all(
    repos.map(repoName =>
      deleteWebHook({
        token: userInfo.token,
        api_url: userInfo.api_url,
        repoName,
        uid
      })
    )
  )

  await deleteUserFromDb(uid)
}

module.exports = {
  formatCommits,
  deleteUser
}
