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

  const filesArr = await fsPromises.readdir(pathToBasicFolder);

  for (const file of filesArr) {
    const pathToBasicFile = path.join(pathToBasicFolder, file);
    const pathToCopyFile = path.join(pathToCopyFolder, file);
    await fsPromises.copyFile(pathToBasicFile, pathToCopyFile);
  }
}

copyDir();
