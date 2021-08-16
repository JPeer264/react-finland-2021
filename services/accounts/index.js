const { ApolloServer, gql } = require("apollo-server");
const { ApolloLogPlugin } = require("apollo-log");
const { buildFederatedSchema } = require("@apollo/federation");

function mySlowFunction(baseNumber) {
  let result = 0;
  for (var i = Math.pow(baseNumber, 7); i >= 0; i--) {
    result += Math.atan(i) * Math.tan(i);
  };
}

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];

const typeDefs = gql`
  extend type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    }
  },
  User: {
    __resolveReference(object) {
      mySlowFunction(7);

      return users.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  plugins: [ApolloLogPlugin({ timestamp: true })]
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
