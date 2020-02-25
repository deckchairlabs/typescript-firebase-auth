import * as firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  unsubscribe()
  console.log(user)
})

if ('serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.register('./service-worker.ts')
  } catch (error) {
    console.error(error)
  }
}

const loginForm = document.getElementById('login-form') as HTMLFormElement

loginForm.addEventListener('submit', async function(event) {
  event.preventDefault()
  const emailInput = this.elements.namedItem('email') as HTMLInputElement
  const passwordInput = this.elements.namedItem('password') as HTMLInputElement

  if (emailInput && passwordInput) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(emailInput.value, passwordInput.value)

    window.location.assign('/')
  }
})
