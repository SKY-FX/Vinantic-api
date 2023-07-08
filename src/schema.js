const { makeExecutableSchema } = require('@graphql-tools/schema');

/* Bottle Schema */
const bottleTypeDefs = require("./typeDefs/bottleTypeDefs");
const bottleResolvers = require("./resolvers/bottleResolvers");

/* Image Schema */
const imageTypeDefs = require("./typeDefs/imageTypeDefs");
const imageResolvers = require("./resolvers/imageResolvers");

/* User Schema */
const userTypeDefs = require("./typeDefs/userTypeDefs");
const userResolvers = require("./resolvers/userResolvers");

/* Merge Schema */
const mergedSchema = makeExecutableSchema({
  typeDefs: [bottleTypeDefs, imageTypeDefs, userTypeDefs],
  resolvers: [bottleResolvers, imageResolvers, userResolvers]
});

module.exports = mergedSchema;