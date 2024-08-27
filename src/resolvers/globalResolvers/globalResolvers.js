const { connectToDb } = require("../../connectToDb");
const queryAsync = require("../utils");

const { getWinesInfosFromXlsFile, getImagesFromFolder, getImageSource, getSortWinesList } = require("./helpers");
const { XLS_FILE_PATH, IMAGES_ROOT_PATH } = require("./constants");
const { isEmpty } = require("ramda");

const globalResolvers = {
  Query: {
    getGlobal: async (_, args) => {
      const { offset = 0, limit, sortBy = 'id', searchText = '' } = args;
      let connection;

      try {
        connection = await connectToDb();
        let winesList = [];
        let totalCountInSearch = 0;

        const countQuery = "SELECT COUNT(*) AS totalCount FROM global";
        const totalCountResult = await queryAsync(connection)(countQuery);
        const totalCount = totalCountResult[0].totalCount;
        const nbItems = limit || totalCount;

        // Liste des colonnes valides pour le tri
        const validSortColumns = ['year', 'price', 'name'];

        // Construire la clause ORDER BY uniquement si sortBy est valide
        const orderByClause = validSortColumns.includes(sortBy) ? `ORDER BY ${sortBy} ASC` : '';

        if (isEmpty(searchText)) {
          // Pas de recherche texte, on applique uniquement tri et pagination
          const dataQuery = `
            SELECT *
            FROM global
            ${orderByClause}
            LIMIT ? OFFSET ?
          `;
          winesList = await queryAsync(connection)(dataQuery, [nbItems, offset]);
          totalCountInSearch = totalCount;
        } else {
          // Rechercher les éléments en fonction du searchText dans plusieurs colonnes
          const filteredQuery = `
            SELECT *
            FROM global
            WHERE name LIKE CONCAT('%', ?, '%')
              OR city LIKE CONCAT('%', ?, '%')
              OR price LIKE CONCAT('%', ?, '%')
              OR wineType LIKE CONCAT('%', ?, '%')
              OR year LIKE CONCAT('%', ?, '%')
            ${orderByClause}
          `;
          const filteredList = await queryAsync(connection)(filteredQuery, [searchText, searchText, searchText, searchText, searchText]);

          totalCountInSearch = filteredList.length;
          winesList = filteredList.slice(offset, offset + nbItems);
        }

        const newGlobal = winesList.map((row) => ({
          ...row,
          id: row.id.toString(),
          imageData: row.imageData.toString("base64"),
        }));

        return {
          ok: true,
          message: "Global have been retrieved from the database",
          data: newGlobal,
          totalCount,
          totalCountInSearch,
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
            "INSERT INTO global (name, price, year, quality, bottleRef, bottleType, city, quantity, wineType, description, imageData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
            bottle.description,
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
