let fs = require('fs');

let directories = ['./aot', './dist'];

/**
 * Delete directory and all its files recursively
 *
 * @param {string} path
 */
let removeDir = function (path) {

  if (path === '/') {

    return;
  }

  if (fs.existsSync(path)) {

    fs
      .readdirSync(path)
      .forEach(function (file, index) {

        let curPath = path + '/' + file;

        if (fs.lstatSync(curPath).isDirectory()) {

          removeDir(curPath);
        } else {

          fs.unlinkSync(curPath);
        }
      });
    fs.rmdirSync(path);
  }
};

directories.forEach(function (directory) {

// Directory exists
  if (fs.existsSync(directory)) {

    // Remove it with all its content
    removeDir(directory);
  }

// Create directory
  fs.mkdirSync(directory);
});
