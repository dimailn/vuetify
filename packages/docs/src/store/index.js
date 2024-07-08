// Vue
import {createStore as _createStore} from 'vuex'

// Utilities
import pathify from '@/plugins/vuex-pathify'

// Modules
import * as modules from './modules'

export function createStore () {
  const store = _createStore({
    modules,
    plugins: [pathify.plugin],
  })

  store.subscribe(mutation => {
    if (!mutation.type.startsWith('user/')) return

    store.dispatch('user/update', mutation)
  })

  return store
}

export const ROOT_DISPATCH = Object.freeze({ root: true })
