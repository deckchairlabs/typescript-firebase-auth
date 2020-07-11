import * as firebase from 'firebase/app'
import 'firebase/auth'
import * as Comlink from 'comlink'
import { AuthApiProxy } from '../types'
import { firebaseConfig } from '../config'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const auth = firebaseApp.auth()

const api: AuthApiProxy = {
  onAuthStateChanged(callback) {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken()
        callback({
          token,
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      }
    })
  },
  async signInWithEmail(email: string, redirectUrl: string) {
    await auth.sendSignInLinkToEmail(email, {
      url: redirectUrl,
    })
    return true
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
  async signOut() {
    await auth.signOut()
    return true
  },
}

Comlink.expose(api)
