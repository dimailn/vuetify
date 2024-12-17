const fs = require('fs');
const path = require('path');

// Root folder containing JS files
const rootDir = './src';
const outputFile = './dist/vuetify.sass';

const sassFiles = [];

// Recursively find .sass imports in JS files
function findSassFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // console.log(fullPath)

    if (stat.isDirectory()) {
      findSassFiles(fullPath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      const matches = content.match(/import ['"](.*\.sass)['"]/g);
      if (matches) {
        matches.forEach((match) => {
          const sassPath = match.match(/['"](.*\.sass)['"]/)[1];
          sassFiles.push(path.resolve(dir, sassPath));
        });
      }
    }
  });
}

// Find all Sass files
findSassFiles(rootDir);

// Write all Sass files into a single concatenated file
const concatenatedSass = sassFiles
  .map((sassFile) => {
    const relativePath = path.relative(rootDir, sassFile).replace(/\\/g, '/');
    return `@import "../src/${relativePath}"`;
  })
  .join('\n');


fs.writeFileSync(outputFile, concatenatedSass);

console.log(`Sass bundle created at: ${outputFile}`);