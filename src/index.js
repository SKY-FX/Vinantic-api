const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const http = require("http");
const { json } = require("body-parser");
const cors = require("cors");

const mergedSchema = require("./schema");
const dotenv = require("dotenv");

dotenv.config();

const startServer = async () => {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      schema: mergedSchema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
      "/graphql",
      cors({
        origin: "https://www.vinantic.fr",
        methods: "POST",
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }),
      json(),
      expressMiddleware(server)
    );

    await new Promise((resolve) => httpServer.listen({ port: process.env.APOLLO_SERVER_PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();
