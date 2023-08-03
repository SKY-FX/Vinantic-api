const { applySpec, map, compose, toLower, prop, find, propOr, head, split, last, equals } = require("ramda");
const { connectToDb } = require("../connectToDb");
const queryAsync = require("./utils");

// const fs = require("fs");
// const XLSX = require("xlsx");

const globalResolvers = {
  Mutation: {
    setGlobal: async () => {
      let connection;
      try {
        connection = await connectToDb();

        // GET BOTTLES
        const bottlesQuery = "SELECT * FROM bottles";
        const bottlesInfos = await queryAsync(connection)(bottlesQuery);
        console.info("bottlesInfos", bottlesInfos);

        // GET IMAGES
        const ImagesQuery = "SELECT * FROM images";
        const imagesInfos = await queryAsync(connection)(ImagesQuery);

        const imagesList = imagesInfos.map((image) => ({
          id: image.id.toString(),
          filename: image.filename,
          contentType: image.contentType,
          data: image.data.toString("base64"),
        }));
        console.info("imagesList", imagesList);

        for (let i = 0; i < bottlesInfos.length; i++) {
          const bottle = bottlesInfos[i];

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
        }

        return {
          ok: true,
          message: "All bottles and images details have been successfully added",
        };
      } catch (err) {
        console.error("Error adding bottles and images:", err);
        return {
          ok: false,
          message: "Error adding bottles and images",
        };
      } finally {
        if (connection) {
          connection.end();
          console.log("🚀 MySQL disconnected from setGlobal mutation");
        }
      }
    },
  },
};

// const getImageSource = ({ bottle, imagesList }) => {
//   const imageRef = toLower(prop("bottleRef", bottle));
//   const foundedImage = find((image) => {
//     const imagePath = propOr("", "filename", image);
//     const splittedName = head(split(".", last(split("\\", imagePath))));
//     if (equals(splittedName, imageRef)) return image;
//   })(imagesList);

//   //   return foundedImage && foundedImage.data;
//   return foundedImage && `data:${foundedImage.contentType};base64,${Buffer.from(foundedImage.data, "base64").toString("base64")}`;
// };

// const getWinesInfosFromXlsFile = (filePath) => {
//   // Lire le contenu du fichier Excel
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       console.error("Erreur lors de la lecture du fichier :", err);
//       return;
//     }

//     const bstr = data.toString("binary");
//     const workbook = XLSX.read(bstr, { type: "binary" });
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet);

//     const filteredWines = compose(
//       map(
//         applySpec({
//           year: propOr(0, "Année"),
//           name: propOr("", "Château"),
//           bottleType: propOr("", "Contenant"),
//           price: propOr(0, "Prix sur le marché"),
//           quality: propOr("", "Qualité"),
//           bottleRef: (wine) => propOr("", "Référence", wine).toLowerCase(),
//           wineType: propOr("", "Type"),
//           city: propOr("", "Ville"),
//           quantity: propOr(0, "Quantity"),
//         })
//       ),
//       transformBottles
//     )(jsonData);

//     // Vous pouvez ensuite traiter les données filtrées comme vous le souhaitez
//     console.log('filteredWines', filteredWines);

//     return filteredWines;
//   });
// };

// const transformBottles = (winesList) => {
//   const filteredWinesList = [];

//   winesList.forEach((obj) => {
//     if (obj["Photo"] === "OK_main") {
//       const bottleRef = obj["Référence"];
//       const refNumber = bottleRef.replace("Ref_", "");
//       const newImageRef = `OK_${refNumber}`;

//       let count = 1;
//       winesList.forEach((obj1) => {
//         if (obj1["Photo"] === newImageRef) {
//           count = count + 1;
//         }
//       });

//       filteredWinesList.push({ ...obj, Quantity: count });
//     }
//   });

//   return filteredWinesList;
// };

module.exports = globalResolvers;
