const mongoose = require('mongoose')

module.exports = (config) => {
  const options = {
    useNewUrlParser: true,
    authSource: 'admin',
    auth: {
      user: config.mongodb.user,
      password: config.mongodb.password,
    },
  }
  return mongoose.createConnection(config.mongodb.url, options)
}
