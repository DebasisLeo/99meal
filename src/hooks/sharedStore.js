import { useSyncExternalStore } from 'react'

export function createSharedStore(initialState) {
  let state = initialState
  const listeners = new Set()

  const notify = () => listeners.forEach((listener) => listener())

  const setState = (updater) => {
    state = typeof updater === 'function' ? updater(state) : updater
    notify()
    return state
  }

  const useStore = () =>
    useSyncExternalStore(
      (listener) => {
        listeners.add(listener)
        return () => listeners.delete(listener)
      },
      () => state,
      () => state
    )

  return {
    getState: () => state,
    setState,
    useStore,
  }
}
