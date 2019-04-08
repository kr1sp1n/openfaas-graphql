// OpenFAAS function handler
const config = require('config')

const functionName = process.env.FUNCTION_NAME
const fn = require('./src/controller')(config)[functionName]

// const db = await require('./src/db')(config)

module.exports = async (data, callback) => {
  const { args, context } = JSON.parse(data)
  const result = await fn(args, context)
  return result
  // db.close(() => {
  //   callback(undefined, result)
  // })
}
