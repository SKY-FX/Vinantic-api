const { connectToDb } = require("../connectToDb");
const queryAsync = require("./utils");

const bottleResolvers = {
  Query: {
    getBottles: async () => {
      let connection;
      try {
        connection = await connectToDb();
        const query = "SELECT * FROM bottles";
        const results = await queryAsync(connection)(query);

        return {
          ok: true,
          message: "All botles details have been retrieved from the database",
          data: results,
        };
      } catch (err) {
        console.error("Error getting bottles:", err);
        return {
          ok: false,
          message: "Error getting bottles",
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from getBottles query");
        }
      }
    },
  },
  Mutation: {
    setBottles: async (_, args) => {
      let connection;
      try {
        connection = await connectToDb();
        const { bottles } = args;
        for (let i = 0; i < bottles.length; i++) {
          const bottle = bottles[i];
          const query =
            "INSERT INTO bottles (name, price, year, quality, bottleRef, bottleType, city, quantity, wineType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
          const values = [
            bottle.name,
            bottle.price,
            bottle.year,
            bottle.quality,
            bottle.bottleRef,
            bottle.bottleType,
            bottle.city,
            bottle.quantity,
            bottle.wineType,
          ];
          await queryAsync(connection)(query, values);
        }

        return {
          ok: true,
          message: "All bottles details have been successfully added",
        };
      } catch (err) {
        console.error("Error adding bottles:", err);
        return {
          ok: false,
          message: "Error adding bottles",
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from setBottles mutation");
        }
      }
    },
    deleteBottles: async () => {
      let connection;
      try {
        connection = await connectToDb();
        const query = "DELETE FROM bottles";
        await queryAsync(connection)(query);

        return {
          ok: true,
          message: "All bottles details have been successfully deleted.",
        };
      } catch (err) {
        console.error("Error deleting bottles details:", err);
        return {
          ok: false,
          message: "Error deleting bottles details",
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from deleteBottles mutations");
        }
      }
    },
  },
};

module.exports = bottleResolvers;
