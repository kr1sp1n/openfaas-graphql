const { GraphQLServer } = require('graphql-yoga')
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql')
const { buildSchema, printSchema } = require('graphql/utilities')
const OpenFaaS = require('openfaas')
const config = require('config')

const { port } = config

const openfaas = new OpenFaaS(config.openfaas.url)

;( async function () {

  const db = await require('./db')(config)

  // TODO: Get typeDefs by URL or upload as file
  const typeDefs = `
    type Query {
      hello(name: String): String!
    }
    type Mutation {
      registerUser(email: String): String!
    }
  `
  // Parse typeDefs to generate resolvers
  const schema = buildSchema(typeDefs)

  let functions
  let genericResolver

  if (config.openfaas.active) {
    // Fetch function names from OpenFAAS:
    const { body: openfaasFunctions } = await openfaas.list()
    functions = Object.assign(...openfaasFunctions.map((f) => ({ [f.name]: f.image })));
    // Resolver for openfaas mode:
    genericResolver = (key) => async (parent, args, context, info) => {
      if (!functions[key]) throw new Error('Not implemented.')
      // TODO: Check context if user is allowed to execute function
      const res = await openfaas.invoke(key, JSON.stringify({ args, context }), true)
      return res.body
    }
  } else {
    // // Fetch function names from files:
    functions = require('./controller')({ ...config, db })
    // Resolver for monolithic mode:
    genericResolver = (key) => (parent, args, context, info) => {
      if (!functions[key]) throw new Error('Not implemented.')
      // TODO: Check context if user is allowed to execute function
      return functions[key](args, context)
    }
  }

  const resolvers = {
    Query: Object.assign(
      ...Object.entries(schema._queryType._fields).map(([key]) => ({[key]: genericResolver(key)}))
    ),
    Mutation: Object.assign(
      ...Object.entries(schema._mutationType._fields).map(([key]) => ({[key]: genericResolver(key)}))
    ),
  }

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: (req) => {
      return {
        // TODO: fetch user from JWT
        user: 'Krispin'
      }
    }
  })

  server.start({
    port,
  }, ({ port }) => console.log(`Server is running on localhost:${port}`))
})()
