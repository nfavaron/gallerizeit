const functions = require('firebase-functions');
const https = require('https');
const http = require('http');

exports.getSource = functions.https.onRequest((req, res) => {

  const allowedOrigin = ['https://gallerize.it', 'http://localhost:3000'];
  let origin = req.get('origin');

  // Origin not allowed
  if (allowedOrigin.indexOf(origin) === -1) {

    origin = allowedOrigin[0];
  }

  res.set('Access-Control-Allow-Origin', origin);
  res.set('Access-Control-Allow-Methods', 'GET');

  const url = decodeURI(req.query.url);
  let request;

  return new Promise((resolve, reject) => {

    request = (url.indexOf('https') === 0 ? https : http)
      .get(url, (response) => {

        const body = [];

        // Received chunk of data
        response.on('data', function (chunk) {

          body.push(chunk);
        });

        // Finished downloading
        response.on('end', () => {

          resolve(Buffer.concat(body).toString());
        });
      })
      .on('error', (e) => {

        resolve('error');
      })
    ;
  })
  .then(content => {

    // Abort request to prevent Firebase Functions random timeout
    request.abort();

    // Send response
    res.send(content);
  });
});
