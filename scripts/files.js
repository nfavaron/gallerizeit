let fs = require('fs');

// Copy files to 'dist'
let files = [
  'favicon.ico',
  'service-worker.js',
  'manifest.json'
];

files.forEach(function (file) {

  fs
    .createReadStream(file)
    .pipe(fs.createWriteStream('dist/' + file))
  ;
});
