const imageTypeDefs = `#graphql
  type Image {
    id: ID!
    filename: String!
    contentType: String!
    data: String!
  }

  type imageQueryResponse {
    ok: Boolean!
    message: String!
    data: [Image!]!
  }

  type mutationResponse {
    ok: Boolean!
    message: String!
  }

  type Query {
    getImages: imageQueryResponse!
  }

  type Mutation {
    setImages: mutationResponse!
  }

  type Mutation {
    deleteImages: mutationResponse!
  }
`;

module.exports = imageTypeDefs;
