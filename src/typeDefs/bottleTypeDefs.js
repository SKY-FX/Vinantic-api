const bottleTypeDefs = `#graphql
  type Bottle {
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

  input InputBottle {
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

  type bottleQueryResponse {
    ok: Boolean!
    message: String!
    data: [Bottle!]!
  }

  type mutationResponse {
    ok: Boolean!
    message: String!
  }

  type Query {
    getBottles: bottleQueryResponse!
  }

  type Mutation {
    setBottles(bottles: [InputBottle!]!): mutationResponse!
  }

  type Mutation {
    deleteBottles: mutationResponse!
  }
`;

module.exports = bottleTypeDefs;
