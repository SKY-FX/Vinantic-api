const { concat } = require("ramda");
const fs = require("fs");
const path = require("path");
const queryAsync = require("./utils");
const { connectToDb } = require("../connectToDb");

const IMAGES_ROOT_PATH = "../assets/images/";
const FOLDER_PATH = path.resolve(__dirname, "../assets/images");

const imageResolvers = {
  Query: {
    getImages: async () => {
      let connection;
      try {
        connection = await connectToDb();
        const query = "SELECT * FROM images";
        const images = await queryAsync(connection)(query);

        const newImages = images.map((image) => ({
          id: image.id.toString(),
          filename: image.filename,
          contentType: image.contentType,
          data: image.data.toString("base64"),
        }));

        return {
          ok: true,
          message: "All images have been retrieved from the database",
          data: newImages,
        };
      } catch (err) {
        console.error("Error getting images:", err);
        return {
          ok: false,
          message: `Error getting images: ${err}`,
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from getImages query");
        }
      }
    },
  },
  Mutation: {
    setImages: async () => {
      let connection;
      try {
        const connection = await connectToDb();
        const files = fs.readdirSync(FOLDER_PATH);
        const imageFiles = files.filter((file) => path.extname(file).toLowerCase() === ".jpg");

        await saveImages(imageFiles, connection);

        return {
          ok: true,
          message: "All images have been successfully added.",
        };
      } catch (err) {
        console.error("Error setting images:", err);
        return {
          ok: false,
          message: `Error setting images: ${err}`,
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from setImages mutation");
        }
      }
    },
    deleteImages: async () => {
      let connection;
      try {
        connection = await connectToDb();
        const query = "DELETE FROM images";
        await queryAsync(connection)(query);

        return {
          ok: true,
          message: "All images have been successfully deleted.",
        };
      } catch (err) {
        console.error("Error deleting images:", err);
        return {
          ok: false,
          message: `Error deleting images: ${err}`,
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from deleteImages mutation");
        }
      }
    },
  },
};

const saveImages = async (imageFiles, connection) => {
  try {
    const savePromises = imageFiles.map(async (image) => {
      const concatPath = concat(IMAGES_ROOT_PATH, image);
      const imagePath = path.resolve(__dirname, concatPath);

      const file = fs.readFileSync(imagePath);
      const [, extension] = imagePath.split(".");
      const contentType = `image/${extension}`;

      const query = "INSERT INTO images (filename, contentType, data) VALUES (?, ?, ?)";
      await queryAsync(connection)(query, [imagePath, contentType, file]);
    });

    await Promise.all(savePromises);
  } catch (err) {
    throw new Error("An error occurred while saving the images.");
  }
};

module.exports = imageResolvers;
