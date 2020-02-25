declare var self: ServiceWorkerGlobalScope

export default (firebase: firebase.app.App) => {
  const getIdToken = () => {
    return new Promise<string | null>(resolve => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        unsubscribe()
        if (user) {
          user.getIdToken().then(
            idToken => {
              resolve(idToken)
            },
            error => {
              resolve(null)
            }
          )
        } else {
          resolve(null)
        }
      })
    })
  }

  const getOriginFromUrl = (url: string) => {
    // https://stackoverflow.com/questions/1420881/how-to-extract-base-url-from-a-string-in-javascript
    const pathArray = url.split('/')
    const protocol = pathArray[0]
    const host = pathArray[2]

    return protocol + '//' + host
  }

  // Get underlying body if available. Works for text and json bodies.
  const getBodyContent = (request: Request) => {
    return Promise.resolve()
      .then(() => {
        if (request.method !== 'GET') {
          const contentType = request.headers.get('Content-Type')
          if (contentType && contentType.indexOf('json') !== -1) {
            return request.json().then((json: any) => {
              return JSON.stringify(json)
            })
          } else {
            return request.text()
          }
        }

        return null
      })
      .catch(error => {
        // Ignore error.
        return null
      })
  }

  self.addEventListener('fetch', event => {
    const requestProcessor = (idToken: string | null) => {
      let request = event.request
      let processRequestPromise = Promise.resolve()

      // For same origin https requests, append idToken to header.
      if (
        self.location.origin == getOriginFromUrl(event.request.url) &&
        (self.location.protocol == 'https:' ||
          self.location.hostname == 'localhost') &&
        idToken
      ) {
        // Clone headers as request headers are immutable.
        const headers = new Headers()
        for (let entry of request.headers.entries()) {
          headers.append(entry[0], entry[1])
        }

        // Add ID token to header.
        headers.append('Authorization', 'Bearer ' + idToken)

        processRequestPromise = getBodyContent(request).then(body => {
          try {
            request = new Request(request.url, {
              method: request.method,
              headers: headers,
              mode: 'same-origin',
              credentials: request.credentials,
              cache: request.cache,
              redirect: request.redirect,
              referrer: request.referrer,
              body
            })
          } catch (error) {
            // This will fail for CORS requests. We just continue with the
            // fetch caching logic below and do not pass the ID token.
          }
        })
      }

      return processRequestPromise.then(() => {
        return fetch(request)
      })
    }

    // Fetch the resource after checking for the ID token.
    // This can also be integrated with existing logic to serve cached files
    // in offline mode.
    event.respondWith(getIdToken().then(requestProcessor, requestProcessor))
  })

  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
  })
}
