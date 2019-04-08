module.exports = (config) => {
  return ({ name }, context) => `Hello ${name || 'World.'}`
}
