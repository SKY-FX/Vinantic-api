const globalTypeDefs = `#graphql
  type Global {
    id: ID!
    name: String!
    price: Int!
    year: Int!
    quality: String!
    bottleRef: String!
    bottleType: String!
    city: String!
    quantity: Int!
    wineType: String!
    imageData: String!
  }

  type mutationResponse {
    ok: Boolean!
    message: String!
  }

  type globalQueryResponse {
    ok: Boolean!
    message: String!
    data: [Global!]!
  }

  type Query {
    getGlobal: globalQueryResponse!
  }

  type Mutation {
    setGlobal: mutationResponse!
  }
`;

module.exports = globalTypeDefs;
