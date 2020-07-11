export type AuthApiProxy = {
  onAuthStateChanged: (callback: (user: any) => void) => void
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>
}
