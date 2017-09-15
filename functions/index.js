const functions = require('firebase-functions');
const https = require('https');

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

  return https
    .get(url, function (response) {

      const body = [];

      response.on('data', function (chunk) {

        body.push(chunk);
      });

      response.on('end', () => {

        res
          .status(200)
          .send(Buffer.concat(body).toString())
        ;
      });
    })
    .on('error', function (e) {

      res
        .status(500)
        .send('Error while downloading source')
      ;
    })
  ;
});
