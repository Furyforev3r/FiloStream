import { auth } from "$lib/client/services/firebase"
import { writable, type Writable } from 'svelte/store'

export const user: Writable<any> = writable("Loading...")

const unsubscribe = auth.onAuthStateChanged((authUser) => {
  if (authUser) {
    user.set(authUser)
  } else {
    user.set(null)
  }
})

export function cleanup() {
  unsubscribe()
}
