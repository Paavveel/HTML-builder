const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const pathToFolder = path.join(__dirname, 'secret-folder');

fsPromises.readdir(pathToFolder, { withFileTypes: true }).then((files) => {
  for (const file of files) {
    if (file.isFile()) {
      const pathToFile = path.join(pathToFolder, file.name);

      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          const fileType = path.extname(file.name).slice(1);
          const fileSize = stats.size;
          const fileName = path.parse(pathToFile).name;
          console.log(`${fileName} - ${fileType} - ${fileSize}B`);
        }
      });
    }
  }
});
