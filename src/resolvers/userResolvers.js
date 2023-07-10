const bcrypt = require("bcrypt");
const queryAsync = require("./utils");
const { connectToDb } = require("../connectToDb");
const { checkAndKillProcessAfterDelay } = require("../scripts/checkAndKillProcess");

const userResolvers = {
  Query: {
    getUser: async (_, args) => {
      let connection;
      try {
        const { username, password } = args;

        connection = await connectToDb();
        const query = "SELECT * FROM users WHERE username = ?";
        const results = await queryAsync(connection)(query, [username]);

        if (results.length === 0) {
          return {
            ok: false,
            message: "User not found",
          };
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return {
            ok: false,
            message: "Incorrect password",
          };
        }

        return {
          ok: true,
          message: "Connexion réussie",
        };
      } catch (err) {
        console.error("Error checking user:", err);
        return {
          ok: false,
          message: "Error checking user",
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from getUser resolver");
          checkAndKillProcessAfterDelay();
        }
      }
    },
  },
};

module.exports = userResolvers;
