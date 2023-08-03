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

/* Global Schema */
const globalTypeDefs = require("./typeDefs/globalTypeDefs");
const globalResolvers = require("./resolvers/globalResolvers/globalResolvers");

/* Merge Schema */
const mergedSchema = makeExecutableSchema({
  typeDefs: [bottleTypeDefs, imageTypeDefs, userTypeDefs, globalTypeDefs],
  resolvers: [bottleResolvers, imageResolvers, userResolvers, globalResolvers]
});

module.exports = mergedSchema;