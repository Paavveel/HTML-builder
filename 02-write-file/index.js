const path = require('path');
const fs = require('fs');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const filePath = path.join(__dirname, 'file.txt');

function handleExit() {
  rl.close();
  console.log('Good bye!');
}

const file = fs.createWriteStream(filePath);

const rl = readline.createInterface({ input, output });

console.log('Please enter the data:');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    handleExit();
  }
  file.write(input);
});

rl.on('SIGINT', handleExit);
