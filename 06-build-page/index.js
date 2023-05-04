const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToProjectDistAssets = path.join(pathToProjectDist, 'assets');
const pathToAssets = path.join(__dirname, 'assets');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponentsFolder = path.join(__dirname, 'components');

async function copyAssetsFolder() {
  await fsPromises.rm(pathToProjectDistAssets, {
    recursive: true,
    force: true,
    maxRetries: 100,
  });

  await fsPromises.mkdir(pathToProjectDistAssets, { recursive: true });

  copyAssets(pathToAssets, pathToProjectDistAssets);
}

async function copyAssets(from, to) {
  const files = await fsPromises.readdir(from, {
    withFileTypes: true,
  });

  for (const file of files) {
    const fileName = file.name;
    const pathToFile = path.join(from, fileName);
    const pathToCopyFile = path.join(to, fileName);

    if (file.isFile()) {
      await fsPromises.copyFile(pathToFile, pathToCopyFile);
    } else {
      await fsPromises.mkdir(pathToCopyFile, { recursive: true });
      await copyAssets(pathToFile, pathToCopyFile);
    }
  }
}

async function createBundle() {
  const pathToStyles = path.join(__dirname, 'styles');

  const writableStream = fs.createWriteStream(
    path.join(pathToProjectDist, 'style.css'),
    { flags: 'a' }
  );
  let readableStream;

  fs.writeFile(path.join(pathToProjectDist, 'style.css'), '', (err) => {
    if (err) throw err;
  });

  await fsPromises.readdir(pathToStyles).then((files) => {
    for (const file of files) {
      const pathToFile = path.join(pathToStyles, file);
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

async function createMarkup() {
  await fsPromises.copyFile(
    pathToTemplate,
    path.join(pathToProjectDist, 'index.html')
  );

  let templateContent = await fsPromises.readFile(pathToTemplate, {
    encoding: 'utf-8',
  });

  const templateTags = templateContent.match(/{{[a-z]*}}/gi);

  for (const tag of templateTags) {
    const tagName = tag.slice(2, -2);
    const componentFileName = `${tagName}.html`;

    const pathToComponentFile = path.join(
      pathToComponentsFolder,
      componentFileName
    );

    const componentContent = await fsPromises.readFile(
      path.join(pathToComponentFile),
      { encoding: 'utf-8' }
    );

    templateContent = templateContent.replace(tag, componentContent);
  }

  await fsPromises.writeFile(
    path.join(pathToProjectDist, 'index.html'),
    templateContent
  );
}

async function build() {
  await fsPromises.mkdir(pathToProjectDist, { recursive: true });

  await copyAssetsFolder();
  await createBundle();
  await createMarkup();
}

build();
