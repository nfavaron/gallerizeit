const functions = require('firebase-functions');
const https = require('https');
const http = require('http');

const download = function (url, resolveOriginal, rejectOriginal) {

  return new Promise((resolve, reject) => {

    const method = url.match(/^https/) !== null ? https : http;

    method
      .get(url, function (res) {

        // Redirect 301 or 302
        /*if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {

          return download(res.headers.location, resolveOriginal || resolve, rejectOriginal || reject);
        }*/

        let content = '';

        res.on('data', function (chunk) {
          content += chunk;

          if (!chunk) {
            (resolveOriginal || resolve)(content);
          }
        });

        res.on('end', () => {
          (resolveOriginal || resolve)(content);
        });
      })
      .on('error', function (e) {
        (rejectOriginal || reject)(e);
      })
    ;
  });
};

exports.getSource = functions.https.onRequest((req, res) => {

  const allowedOrigin = ['https://gallerize.it', 'http://localhost:3000'];
  let origin = req.get('origin');

  // Origin not allowed
  if (allowedOrigin.indexOf(origin) === -1) {

    origin = allowedOrigin[0];
  }

  res.set('Access-Control-Allow-Origin', origin);
  res.set('Access-Control-Allow-Methods', 'OPTIONS, GET');

  // OPTIONS request
  if (req.method.toUpperCase() === 'OPTIONS') {

    res
      .status(200)
      .send()
    ;

    return;
  }

  // Default header
  res.set('Content-type', 'text/plain');

  // GET request
  download(decodeURI(req.query.url))
    .then(content => {

      res.set('Content-length', content.length);

      res
        .status(200)
        .send(content)
      ;
    })
    .catch(e => {

      const content = e.toString();

      res.set('Content-length', content.length);

      res
        .status(500)
        .send('error')
      ;
    })
  ;
});
