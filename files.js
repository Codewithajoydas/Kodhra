const fs = require("fs");
const path = require("path");
/**
 * @param {string} dirPath - The root directory.
 * @param {string[]} arrayOfFiles - Used internally (do not pass).
 * @param {string} basePath - Used internally to preserve relative paths.
 * @returns {string[]} Array of file paths.
 */
function getAllFiles(dirPath, arrayOfFiles = [], basePath = dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles, basePath);
    } else {
      arrayOfFiles.push(path.relative(basePath, fullPath));
    }
  });

  return arrayOfFiles;
}

const rootFolder = "./public"; 
const fileList = getAllFiles(rootFolder);
console.log(fileList);
  
