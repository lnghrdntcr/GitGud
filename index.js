const { checkConfig } = require('./utils/configure')
const app = require('./express/app')

app.listen(process.env.PORT, async () => {
  try {
    await checkConfig()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('App listening on port ' + process.env.PORT)
})
