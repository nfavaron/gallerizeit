let recursive = require('recursive-readdir');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
let postcss = require('postcss');
let postcssImport = require('postcss-import');
let fs = require('fs');

let autoprefixerOptions = { browsers: ['> 0%'] };
let cssNanoOptions = { zindex: false };

// Autoprefixer CSS files within "app"
recursive('app', function (err, files) {

  files.forEach(function (file) {

    if (file.substr(-4) === '.css') {

      let css = fs.readFileSync(file, 'UTF-8');
      let options = {
        from: file,
        to: file,
        map: false
      };

      postcss([autoprefixer(autoprefixerOptions)])
        .process(css, options)
        .then(function (result) {

          result.warnings().forEach(function (warn) {

            console.warn(warn.toString());
          });

          fs.writeFileSync(file, result.css);
        })
      ;
    }
  });
});

// Compile main CSS file
let css = fs.readFileSync('gallerizeit.css', 'UTF-8');

postcss([postcssImport, autoprefixer(autoprefixerOptions), cssnano(cssNanoOptions)])
  .process(css, {
    from: 'gallerizeit.css',
    to: 'dist/gallerizeit.css',
    map: false
  })
  .then(function (result) {

    result.warnings().forEach(function (warn) {

      console.warn(warn.toString());
    });

    fs.writeFileSync('dist/gallerizeit.css', result.css);
  })
;
