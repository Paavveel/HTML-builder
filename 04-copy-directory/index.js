const path = require('node:path');
const fsPromises = require('node:fs/promises');

const pathToBasicFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fsPromises.rm(pathToCopyFolder, {
    recursive: true,
    force: true,
    maxRetries: 100,
  });

  await fsPromises.mkdir(pathToCopyFolder, { recursive: true });

  let filesArr;

  await fsPromises.readdir(pathToBasicFolder).then((files) => {
    filesArr = files;
  });

  for (const file of filesArr) {
    const pathToBasicFile = path.join(pathToBasicFolder, file);
    const pathToCopyFile = path.join(pathToCopyFolder, file);
    await fsPromises.copyFile(pathToBasicFile, pathToCopyFile);
  }
}

copyDir();
