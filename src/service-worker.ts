declare var self: ServiceWorkerGlobalScope

import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseAuth from './serviceWorker/firebaseAuth'
import { firebaseConfig } from './config'

const firebaseApp = firebase.initializeApp(firebaseConfig)

firebaseAuth(firebaseApp)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

export {}
