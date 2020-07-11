declare var self: ServiceWorkerGlobalScope

import * as firebase from 'firebase/app'
import 'firebase/auth'
import * as Comlink from 'comlink'
import firebaseAuth from './serviceWorker/firebaseAuth'
import { firebaseConfig } from './config'
import { ControllerProxyApi } from './types'

const firebaseApp = firebase.initializeApp(firebaseConfig)

firebaseAuth(firebaseApp)

const api: ControllerProxyApi = {
  onAuthStateChanged(callback) {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      }
    })
  },
  async signInWithEmailAndPassword(email: string, password: string) {
    const result = await firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)

    if (result.user) {
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }
    }
  },
}

self.addEventListener('message', (event) => {
  if (event.data.comlinkInit) {
    Comlink.expose(api, event.data.port)
    return
  }
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
