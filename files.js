const fs = require("fs");
const path = require("path");
/**
 * Recursively get all files in a directory (deep flat list).
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
      // Recursive call for subfolder
      getAllFiles(fullPath, arrayOfFiles, basePath);
    } else {
      // Save relative path (nice for flat structure)
      arrayOfFiles.push(path.relative(basePath, fullPath));
    }
  });

  return arrayOfFiles;
}

// Example usage:
const rootFolder = "./public"; // change this to your folder
const fileList = getAllFiles(rootFolder);
console.log(fileList);
