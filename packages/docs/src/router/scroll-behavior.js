// Globals
import { IN_BROWSER } from '@/util/globals'

export default async function (vuetify, store, to, from, savedPosition) {
  if (
    !IN_BROWSER ||
    (from && to.path === from.path) ||
    store.state.app.scrolling
  ) return

  let scrollTo = 0

  if (to.hash) scrollTo = to.hash
  // Vue Router 4: { top, left }, не { x, y } как в старых примерах
  else if (savedPosition && typeof savedPosition.top === 'number') {
    scrollTo = savedPosition.top
  }

  // TODO: https://github.com/vuejs/vue-router/pull/3199
  // scroll-behavior is not called on
  // load handled in views/Documentation.vue
  return new Promise((resolve, reject) => {
    // Options 1
    const options = {}

    if (!scrollTo || to.hash) options.duration = 0

    window.requestAnimationFrame(async () => {
      vuetify.framework
        .goTo(scrollTo, options)
        .catch(reject)
        .finally(resolve)
    })
  })
}
