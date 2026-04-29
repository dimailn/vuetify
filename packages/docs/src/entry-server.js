// Imports
import { createApp } from './main'

const path = require('path')
const resolve = file => path.resolve(__dirname, file)

// ENV Variables
require('dotenv').config({ path: resolve('../.env.local') })

global.fetch = require('node-fetch')

async function getAsyncDataFromMatched (router, store) {
  const matched = router.currentRoute.value.matched
  const tasks = []

  for (const record of matched) {
    const comp = record.components?.default
    if (!comp) continue

    let def = comp
    if (typeof comp === 'function') {
      const resolved = await comp()
      def = resolved.default || resolved
    }

    if (def && typeof def.asyncData === 'function') {
      tasks.push(
        def.asyncData({
          route: router.currentRoute.value,
          store,
        }),
      )
    }
  }

  return Promise.all(tasks)
}

export default async context => {
  let app
  let router
  let store

  try {
    const res = await createApp(undefined, context)

    app = res.app
    router = res.router
    store = res.store
  } catch (e) {
    console.log('error in server try')
    return Promise.reject(e)
  }

  await router.push(context.url)
  await router.isReady()

  try {
    await getAsyncDataFromMatched(router, store)
  } catch (e) {
    console.log('asyncData error', e)
    return Promise.reject(e)
  }

  context.state = store.state

  return app
}
