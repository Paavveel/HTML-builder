const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function createBundle() {
  const pathToStylesFolder = path.join(__dirname, 'styles');
  const pathToProjectDist = path.join(__dirname, 'project-dist');

  const writableStream = fs.createWriteStream(
    path.join(pathToProjectDist, 'bundle.css'),
    { flags: 'a' }
  );
  let readableStream;

  fs.writeFile(path.join(pathToProjectDist, 'bundle.css'), '', (err) => {
    if (err) throw err;
  });

  await fsPromises.readdir(pathToStylesFolder).then((files) => {
    for (const file of files) {
      const pathToFile = path.join(pathToStylesFolder, file);
      const fileType = path.extname(file).slice(1);

      if (fileType === 'css') {
        fs.stat(pathToFile, (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            readableStream = fs.createReadStream(pathToFile, 'utf-8');
            readableStream.pipe(writableStream);
          }
        });
      }
    }
  });
}

createBundle();
