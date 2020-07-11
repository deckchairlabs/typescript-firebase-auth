import * as Comlink from 'comlink'
import { ControllerProxyApi } from './types'

const loginForm = document.getElementById('login-form') as HTMLFormElement

const onAuthStateChanged = (user: any) => {
  console.log(user)
}

const main = async (controller: ServiceWorker) => {
  const { port1, port2 } = new MessageChannel()

  const message = {
    comlinkInit: true,
    port: port1,
  }

  controller.postMessage(message, [port1])
  const controllerProxy = Comlink.wrap<ControllerProxyApi>(port2)

  controllerProxy.onAuthStateChanged(Comlink.proxy(onAuthStateChanged))

  try {
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault()

      const emailInput = this.elements.namedItem('email') as HTMLInputElement
      const passwordInput = this.elements.namedItem(
        'password'
      ) as HTMLInputElement

      if (emailInput && passwordInput) {
        const result = await controllerProxy.signInWithEmailAndPassword(
          emailInput.value,
          passwordInput.value
        )

        console.log(result)

        // window.location.assign('/')
        return false
      }
    })
  } catch (error) {
    console.error(error)
  }
}

navigator.serviceWorker.register('./service-worker.ts').then((registration) => {
  if (registration.active) {
    main(registration.active)
  }
})
