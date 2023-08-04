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

  type bottleWineQueryResponse {
    ok: Boolean!
    message: String!
    data: Global!
  }

  type Query {
    getGlobal: globalQueryResponse!
  }

  type Query {
    getWineBottle(id: ID!): bottleWineQueryResponse!
  }

  type Mutation {
    setGlobal: mutationResponse!
  }

  type Mutation {
    deleteGlobal: mutationResponse!
  }
`;

module.exports = globalTypeDefs;
