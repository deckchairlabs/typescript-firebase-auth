export type AuthenticatedUser = {
  id: string
  token: string
  email: string | null
  displayName: string | null
}

export type AuthApiProxy = {
  onAuthStateChanged: (callback: (user: AuthenticatedUser) => void) => void
  signInWithEmail: (email: string, redirectUrl: string) => Promise<boolean>
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>
  signOut: () => Promise<boolean>
}
