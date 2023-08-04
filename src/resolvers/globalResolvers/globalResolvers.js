const { connectToDb } = require("../../connectToDb");
const queryAsync = require("../utils");

const { getWinesInfosFromXlsFile, getImagesFromFolder, getImageSource } = require("./helpers");
const { XLS_FILE_PATH, IMAGES_ROOT_PATH } = require("./constants");

const globalResolvers = {
  Query: {
    getGlobal: async () => {
      let connection;
      try {
        connection = await connectToDb();
        const query = "SELECT * FROM global";
        const global = await queryAsync(connection)(query);

        const newGlobal = global.map((row) => ({
          ...row,
          id: row.id.toString(),
          imageData: row.imageData.toString("base64"),
        }));

        return {
          ok: true,
          message: "Global have been retrieved from the database",
          data: newGlobal,
        };
      } catch (err) {
        console.error("Error getting global:", err);
        return {
          ok: false,
          message: `Error getting global: ${err}`,
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from getGlobal query");
        }
      }
    },
    getWineBottle: async (_, args) => {
      let connection;
      try {
        const { id } = args;

        connection = await connectToDb();
        const query = "SELECT * FROM global WHERE id = ?";
        const results = await queryAsync(connection)(query, [id]);

        if (results.length === 0) {
          return {
            ok: false,
            message: "Wine bottle not found",
          };
        }

        const wineBottle = results[0];
        const newWineBottle = {
          ...wineBottle,
          imageData: wineBottle.imageData.toString("base64"),
        };

        return {
          ok: true,
          message: "Wine bottle have been retrieved from the database",
          data: newWineBottle,
        };
      } catch (err) {
        console.error("Error getting wine bottle:", err);
        return {
          ok: false,
          message: "Error getting wine bottle",
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from getWineBottle query");
        }
      }
    },
  },
  Mutation: {
    setGlobal: async () => {
      let connection;
      try {
        connection = await connectToDb();

        // GET BOTTLES
        const bottlesInfos = getWinesInfosFromXlsFile({ filePath: XLS_FILE_PATH });

        // GET IMAGES
        const imagesList = await getImagesFromFolder({ rootPath: IMAGES_ROOT_PATH, connection });

        bottlesInfos.map(async (bottle) => {
          const imageData = getImageSource({ bottle, imagesList });

          const query =
            "INSERT INTO global (name, price, year, quality, bottleRef, bottleType, city, quantity, wineType, imageData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
            imageData,
          ];
          await queryAsync(connection)(query, values);
        });

        return {
          ok: true,
          message: "All bottles and images details have been successfully added",
        };
      } catch (err) {
        console.error("Error adding global", err);
        return {
          ok: false,
          message: "Error adding global",
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from setGlobal mutation");
        }
      }
    },
    deleteGlobal: async () => {
      let connection;
      try {
        connection = await connectToDb();
        const query = "DELETE FROM global";
        await queryAsync(connection)(query);

        return {
          ok: true,
          message: "Global have been successfully deleted.",
        };
      } catch (err) {
        console.error("Error deleting global:", err);
        return {
          ok: false,
          message: `Error deleting global: ${err}`,
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from deleteGlobal mutation");
        }
      }
    },
  },
};

module.exports = globalResolvers;
