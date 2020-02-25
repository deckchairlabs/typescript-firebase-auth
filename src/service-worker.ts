declare var self: ServiceWorkerGlobalScope

import { firebaseConfig } from './config'
import firebaseAuth from './serviceWorker/firebaseAuth'

self.importScripts('https://www.gstatic.com/firebasejs/7.9.0/firebase-app.js')
self.importScripts('https://www.gstatic.com/firebasejs/7.9.0/firebase-auth.js')

const firebaseApp = firebase.initializeApp(firebaseConfig)

firebaseAuth(firebaseApp)
