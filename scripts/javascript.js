let fs = require('fs');
let UglifyJS = require("uglify-js");

let fileDestination = 'dist/gallerizeit.js';

let uglified = UglifyJS.minify([
  'node_modules/core-js/client/shim.min.js',
  'node_modules/zone.js/dist/zone.js',
  'aot/gallerizeit.js'
]);

// TODO: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
fs.writeFileSync(fileDestination, "window.module='aot';" + uglified.code);
