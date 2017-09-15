let fs = require('fs');
let minify = require('html-minifier').minify;

// Files
let fileSource = 'index.html';
let fileDestination = 'dist/index.html';

// Open source file
let htmlSource = fs.readFileSync(fileSource, 'UTF-8');
let htmlDestination = '';

// AOT start/end keywords
let aotStart = '<!--@aot-remove-start-->';
let aotEnd = '<!--@aot-remove-end-->';
let aotScripts = '<!--@aot-scripts-->';
let aotKeepStart = /<\!\-\-@aot\-keep/g;
let aotKeepEnd = /@aot\-keep\-\->/g;

// Remove unnecessary code
while(htmlSource.indexOf(aotStart) > -1) {
  htmlDestination = '';
  htmlDestination += htmlSource.substr(0, htmlSource.indexOf(aotStart));
  htmlDestination += htmlSource.substr(htmlSource.indexOf(aotEnd) + String(aotEnd).length);
  htmlSource = htmlDestination;
}

// Inject bundle code
htmlDestination = htmlDestination.replace(aotScripts, '<script src="/gallerizeit.js"></script>');

// Remove aot comments
htmlDestination = htmlDestination.replace(aotKeepStart, '');
htmlDestination = htmlDestination.replace(aotKeepEnd, '');

// Minify into destination file
htmlDestination = minify(htmlDestination, {
  html5: true,
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  removeAttributeQuotes: true,
  minifyCSS: true,
  minifyJS: true,
  preserveLineBreaks: false,
  removeComments: true
});

fs.writeFileSync(fileDestination, htmlDestination);
