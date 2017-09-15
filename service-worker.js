var CACHE_NAME = 'gallerizeit';

var INSTALL_URI = 'install';

var SHELL_FILES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/gallerizeit.css',
  '/gallerizeit.js'
];

var ASSETS_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.js', '.html', '.ico'
];

self.addEventListener('install', function (event) {

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {

        return cache.addAll(SHELL_FILES);
      })
      .then(function () {

        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {

  event.waitUntil(
    caches
      .keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {

            if (key !== CACHE_NAME) {

              return caches.delete(key);
            }
          })
        );
      })
  );

  return self.clients.claim();
});

/**
 * Fetch the request from the cache first, if it fails falls back to remote.
 *
 * @param {Request} request
 * @param {Response} responseCache
 * @param {number} responseStatusError In case of a "no cache no connection", return this status code
 */
function fetchLocalFirst (request, responseCache, responseStatusError) {

  // Cache
  if (responseCache) {

    return responseCache;
  }

  // Remote
  return fetchRemoteFirst(request, responseCache, responseStatusError);
}

/**
 * Fetch the request from remote first, if it fails falls back to the cache.
 * If there is no cache, then an empty response is return, with a "200 OK" header.
 *
 * @param {Request} request
 * @param {Response} responseCache
 * @param {number} responseStatusError In case of a "no cache no connection", return this status code
 */
function fetchRemoteFirst (request, responseCache, responseStatusError) {

  // Remote
  return fetch(request)
    .then(
      function (response) {

        var responseRemote = response.clone();

        // Check if we received a valid response
        if (request.method === 'GET' && response && response.status < 300) {

          caches.open(CACHE_NAME)
            .then(function (cache) {

              // Update cache
              cache.put(request, responseRemote);
            })
          ;
        }

        return response;
      }
    )
    .catch(function () {

      // Cache
      if (!responseCache) {

        // No cache, no connection
        responseCache = fetchNoCacheNoConnection(responseStatusError);
      }

      return responseCache;
    });
}

/**
 * Returns an empty response
 *
 * @param {number} status
 * @returns {Response}
 */
function fetchNoCacheNoConnection (status) {

  if (status === 404) {

    return new Response('', {
      status: 404,
      statusText: 'Not Found'
    });

  } else {

    return new Response('', {
      status: 200,
      statusText: 'OK'
    });
  }
}

self.addEventListener('fetch', function (event) {

  var uri = event.request.url.split('/').pop();

  // Install request
  if (uri === INSTALL_URI) {

    event
      .waitUntil(
        caches
          .keys()
          .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {

                if (key === CACHE_NAME) {

                  return caches.delete(key);
                }
              })
            );
          })
      )
    ;

    return event.respondWith(
      fetchNoCacheNoConnection(200)
    );

  } else {

    return event.respondWith(
      caches
        .match(event.request)
        .then(function (response) {

          var extension = uri.length > 1 ? '.' + uri.split('.').pop() : '';

          // Assets
          if (ASSETS_EXTENSIONS.indexOf(extension) > -1) {

            return fetchLocalFirst(event.request.clone(), response, 404);

          } // API
          else {

            return fetchRemoteFirst(event.request.clone(), response, 200);
          }
        })
    );
  }
});
