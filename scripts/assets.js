let fs = require('fs');

// Create assets directories
fs.mkdirSync('dist/assets');
fs.mkdirSync('dist/assets/icon');

// Directories source => destination
let directories = {
  'assets/icon': 'dist/assets/icon',
  'assets/public': 'dist'
};

Object.keys(directories).forEach(function (source) {

  let destination = directories[source];

  fs
    .readdirSync(source)
    .forEach(function (file, index) {

      // PNG files only
      if (file.substr(-4) === '.png') {

        fs
          .createReadStream(source + '/' + file)
          .pipe(fs.createWriteStream(destination + '/' + file))
        ;
      }
    })
  ;

});
