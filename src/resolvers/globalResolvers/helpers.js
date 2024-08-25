const { applySpec, map, compose, toLower, prop, propOr, head, split, last, equals } = require("ramda");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const getImageSource = ({ bottle, imagesList }) => {
  const imageRef = toLower(prop("bottleRef", bottle));

  const foundedImage = imagesList.find((image) => {
    const imagePath = propOr("", "imagePath", image);
    const splittedName = head(split(".", last(split("/", imagePath))));
    if (equals(splittedName, imageRef)) return image;
  });

  //   return foundedImage && `data:${foundedImage.imageContentType};base64,${Buffer.from(foundedImage.imageData, "base64").toString("base64")}`;
  return foundedImage && foundedImage.imageData;
};

const getWinesInfosFromXlsFile = ({ filePath }) => {
  try {
    const files = fs.readFileSync(filePath);

    const bstr = files.toString("binary");
    const workbook = XLSX.read(bstr, { type: "binary" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const filteredWines = compose(
      map(
        applySpec({
          year: propOr(0, "Année"),
          name: propOr("", "Château"),
          bottleType: propOr("", "Contenant"),
          price: propOr(0, "Prix sur le marché"),
          quality: propOr("", "Qualité"),
          bottleRef: (wine) => propOr("", "Référence", wine).toLowerCase(),
          wineType: propOr("", "Type"),
          city: propOr("", "Ville"),
          quantity: propOr(0, "Quantity"),
          description: propOr("", "Description"),
        })
      ),
      transformBottles
    )(jsonData);

    return filteredWines;
  } catch (err) {
    console.error("Error while reading the file :", err);
    return err;
  }
};

const transformBottles = (winesList) => {
  const filteredWinesList = [];

  winesList.forEach((obj) => {
    if (obj["Photo"] === "OK_main") {
      const bottleRef = obj["Référence"];
      const refNumber = bottleRef.replace("Ref_", "");
      const newImageRef = `OK_${refNumber}`;

      let count = 1;
      winesList.forEach((obj1) => {
        if (obj1["Photo"] === newImageRef) {
          count = count + 1;
        }
      });

      filteredWinesList.push({ ...obj, Quantity: count });
    }
  });

  return filteredWinesList;
};

const getImagesFromFolder = async ({ rootPath }) => {
  try {
    const files = fs.readdirSync(rootPath);
    const imageFiles = files.filter((file) => path.extname(file).toLowerCase() === ".jpg");

    const promisesImageFiles = imageFiles.map((image) => {
      const concatPath = path.join(rootPath, image); // Utilisez path.join au lieu de concat pour les chemins
      const imagePath = path.resolve(__dirname, concatPath);

      const imageData = fs.readFileSync(imagePath);
      const [, extension] = imagePath.split(".");
      const imageContentType = `image/${extension}`;

      return { imageData, imageContentType, imagePath };
    });

    return Promise.all(promisesImageFiles);
  } catch (err) {
    throw new Error("An error occurred while saving the images.");
  }
};

const getSortWinesList = ({ wineList, sortBy }) => {
  // Trier les bouteilles de vin en fonction de l'option de tri sélectionnée
  let sortedList = wineList;
  if (sortBy === "year") {
    sortedList = wineList.sort((a, b) => a.year - b.year);
  } else if (sortBy === "price") {
    sortedList = wineList.sort((a, b) => a.price - b.price);
  } else if (sortBy === "name") {
    sortedList = wineList.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sortedList;
};

module.exports = {
  getWinesInfosFromXlsFile,
  getImagesFromFolder,
  getImageSource,
  transformBottles,
  getSortWinesList,
};
