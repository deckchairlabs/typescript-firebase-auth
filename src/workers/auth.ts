declare var self: DedicatedWorkerGlobalScope

import * as firebase from 'firebase/app'
import 'firebase/auth'
import * as Comlink from 'comlink'
import { AuthApiProxy } from '../types'
import { firebaseConfig } from '../config'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const auth = firebaseApp.auth()

const api: AuthApiProxy = {
  onAuthStateChanged(callback) {
    auth.onAuthStateChanged((user) => {
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
    const result = await auth.signInWithEmailAndPassword(email, password)

    if (result.user) {
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }
    }
  },
}

Comlink.expose(api)
