declare var self: ServiceWorkerGlobalScope

const getOriginFromUrl = (url: string) => {
  const pathArray = url.split('/')
  const protocol = pathArray[0]
  const host = pathArray[2]

  return protocol + '//' + host
}

const isSafeRequest = (request: Request) => {
  return (
    self.location.origin === getOriginFromUrl(request.url) &&
    (self.location.protocol === 'https:' ||
      self.location.hostname === 'localhost')
  )
}

export default (firebase: firebase.app.App) => {
  const auth = firebase.auth()

  self.addEventListener('fetch', async (event) => {
    let request = event.request

    if (isSafeRequest(request)) {
      const currentUser = auth.currentUser

      if (currentUser) {
        const token = await currentUser.getIdToken()
      }
    }

    event.respondWith(fetch(request))
  })
}
