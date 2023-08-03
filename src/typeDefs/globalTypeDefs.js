const globalTypeDefs = `#graphql
  type mutationResponse {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    setGlobal: mutationResponse!
  }
`;

module.exports = globalTypeDefs;
