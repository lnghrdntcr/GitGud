const DEFAULT_PORT = 12345
const GITHUB_AUTH_LINK = `https://github.com/login/oauth/authorize?scope=user,email,repo&client_id=${
  process.env.GITHUB_CLIENT_ID
}`

const GITHUB_ACCESS_TOKEN_LINK = 'https://github.com/login/oauth/access_token'

module.exports = {
  DEFAULT_PORT,
  GITHUB_AUTH_LINK,
  GITHUB_ACCESS_TOKEN_LINK
}
