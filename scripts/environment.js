let fs = require('fs');

// Files
let fileSource = 'app/environments/environment.{env}.ts';
let fileDestination = 'app/environments/environment.ts';
let fileBackup = 'app/environments/environment.ts.backup';

// CLI argument
let argument = !!process.argv[2] ? process.argv[2] : '';

/**
 * Restore environment file
 */
if (argument === '--restore') {

  if (fs.existsSync(fileBackup)) {

    if (fs.existsSync(fileBackup)) {

      fs.unlinkSync(fileDestination);
    }

    fs.renameSync(fileBackup, fileDestination);
  }
}

/**
 * Use specific environment file
 */
if (argument.indexOf('--use=') === 0) {

  // Default environment
  let env = argument.replace('--use=', '');

  // Remove backup
  if (fs.existsSync(fileBackup)) {

    fs.unlinkSync(fileBackup);
  }

  // Backup current environment file
  if (fs.existsSync(fileDestination)) {

    fs.renameSync(fileDestination, fileBackup);
  }

  // Generate destination file
  fs
    .createReadStream(fileSource.replace('{env}', env))
    .pipe(fs.createWriteStream(fileDestination))
  ;
}
