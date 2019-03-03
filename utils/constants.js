const DEFAULT_PORT = 12345
const GITHUB_AUTH_LINK = `https://github.com/login/oauth/authorize?scope=user,email,repo&client_id=${
  process.env.GITHUB_CLIENT_ID
}`

const GITHUB_ACCESS_TOKEN_LINK = 'https://github.com/login/oauth/access_token'

const GITHUB_BASE_URL = 'https://api.github.com'
const GITHUB_REPO_URL = `${GITHUB_BASE_URL}/user/repos`

const INIT = 'INIT'
const AUTHENTICATED = 'AUTHENTICATED'
const MONITORING = 'MONITORING'

module.exports = {
  DEFAULT_PORT,
  GITHUB_AUTH_LINK,
  GITHUB_ACCESS_TOKEN_LINK,
  INIT,
  AUTHENTICATED,
  MONITORING,
  GITHUB_REPO_URL,
  GITHUB_BASE_URL
}
