const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mergedSchema = require("./schema");

const startServer = async () => {
  try {
    const server = new ApolloServer({ schema: mergedSchema });
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    console.log(`🚀 ApolloServer ready at ${url}`);
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();
