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
    description: String!
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
    totalCount: Int!
    totalCountInSearch: Int!
  }

  type bottleWineQueryResponse {
    ok: Boolean!
    message: String!
    data: Global!
  }

  type Query {
    getGlobal(offset: Int, limit: Int, sortBy: String, searchText: String): globalQueryResponse!
    getWineBottle(id: ID!): bottleWineQueryResponse!
  }

  type Mutation {
    setGlobal: mutationResponse!
    deleteGlobal: mutationResponse!
  }
`;

module.exports = globalTypeDefs;
