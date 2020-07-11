import * as Comlink from 'comlink'
import { AuthApiProxy, AuthenticatedUser } from './types'

const loginForm = document.getElementById('login-form') as HTMLFormElement
const authApi = Comlink.wrap<AuthApiProxy>(new Worker('./workers/auth.ts'))

const onAuthStateChanged = (user: AuthenticatedUser) => {
  console.log(user)
}

authApi.onAuthStateChanged(Comlink.proxy(onAuthStateChanged))

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault()

  const emailInput = this.elements.namedItem('email') as HTMLInputElement
  const passwordInput = this.elements.namedItem('password') as HTMLInputElement

  if (emailInput && passwordInput) {
    const result = await authApi.signInWithEmailAndPassword(
      emailInput.value,
      passwordInput.value
    )

    console.log(result)

    // window.location.assign('/')
    return false
  }
})

navigator.serviceWorker.register('./service-worker.ts')
