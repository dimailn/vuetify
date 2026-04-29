import { createHead as createHeadClient } from '@unhead/vue/client'
import { createHead as createHeadServer } from '@unhead/vue/server'

const IS_SERVER = process.env.VUE_APP_WEBPACK_TARGET === 'node'

/**
 * vue-meta 3 alpha даёт «too much recursion» в recompute + Vue 3.5 reactive —
 * замена на поддерживаемый Unhead (рекомендация maintainers vue-meta).
 */
export function installHead (app) {
  const createHead = IS_SERVER ? createHeadServer : createHeadClient
  const head = createHead()
  app.use(head)
  return head
}
