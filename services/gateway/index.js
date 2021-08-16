const { ApolloServer } = require("apollo-server");
const { ApolloLogPlugin } = require("apollo-log");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  // This entire `serviceList` is optional when running in managed federation
  // mode, using Apollo Graph Manager as the source of truth.  In production,
  // using a single source of truth to compose a schema is recommended and
  // prevents composition failures at runtime using schema validation using
  // real usage-based metrics.
  serviceList: [
    { name: "accounts", url: process.env.ACCOUNTS_URI },
    { name: "reviews", url: process.env.REVIEWS_URI },
    { name: "products", url: process.env.PRODUCTS_URI },
    { name: "inventory", url: process.env.INVENTORY_URI }
  ],

  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
});

const server = new ApolloServer({
  gateway,

  // Apollo Graph Manager (previously known as Apollo Engine)
  // When enabled and an `ENGINE_API_KEY` is set in the environment,
  // provides metrics, schema management and trace reporting.
  engine: false,

  // Subscriptions are unsupported but planned for a future Gateway version.
  subscriptions: false,
  plugins: [ApolloLogPlugin({ timestamp: true })]
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
