module.exports = {
  port: process.env.PORT || 3000,
  openfaas: {
    active: Boolean(process.env.OPENFAAS) || false,
    url: process.env.OPENFAAS_URL || 'http://localhost:8080',
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/dev',
    user: process.env.MONGODB_USER || 'root',
    password: process.env.MONGODB_PASSWORD || 'example',
  },
}
