// https://davestewart.github.io/vuex-pathify/#/setup/config
// В Vue 3 версия pathify по умолчанию строит computed refs (useComputed=true),
// а этот проект использует Options API c spread в computed.
// Проксируем get/sync через useComputed=false, чтобы вернуть геттеры/сеттеры.

import pathify, {
  call as rawCall,
  get as rawGet,
  make,
  sync as rawSync,
} from '../../node_modules/vuex-pathify/dist/vuex-pathify.esm.js'

// options
pathify.options.mapping = 'simple'
pathify.options.strict = false

export const get = (path, props) => rawGet(path, props, false)
export const sync = (path, props) => rawSync(path, props, false)
export const call = (path, props) => {
  // rawCall захватывает store в момент объявления метода.
  // В Options API это часто происходит до инициализации pathify plugin.
  if (props == null && typeof path === 'string') {
    return function dispatchPathifyAction (payload) {
      return this.$store.dispatch(path, payload)
    }
  }
  return rawCall(path, props)
}
export { make }
export default pathify
