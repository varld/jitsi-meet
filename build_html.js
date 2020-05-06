let fs = require('fs');
let { join } = require('path');

let args = process.argv.slice(2);
let isProd = args[0] == 'prod' || args[0] == 'production';

if (isProd) {
  console.log('> Building `index.html` for production');
} else {
  console.log('> Building `index.html` for development');
}

let html = fs.readFileSync(join(__dirname, `base${ isProd ? '_prod' : '' }.html`)).toString();

let config = fs.readFileSync(join(__dirname, 'config.js')).toString();
let interfaceConfig = fs.readFileSync(join(__dirname, 'interface_config.js')).toString();
let loggingConfig = fs.readFileSync(join(__dirname, 'logging_config.js')).toString();

let result = html.replace('{{config}}', config).replace('{{interfaceConfig}}', interfaceConfig).replace('{{loggingConfig}}', loggingConfig);

fs.writeFileSync(join(__dirname, 'index.html'), result);

console.log('> Done!');
