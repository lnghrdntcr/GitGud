const formatCommits = (repoName, commits) => {
  let message = `*${repoName}*:\n`
  commits.forEach(el => {
    message += `${el.committer.name}(_${el.committer.username}_): ${
      el.message
    }\n`
  })
  return message
}
