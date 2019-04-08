module.exports = (config) => {
  const userController = require('./user')(config)
  return {
    hello: require('./hello')(config),
    ...userController,
  }
}
