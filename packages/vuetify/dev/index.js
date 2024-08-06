import { createApp, h } from 'vue'
import App from './App'
import router from './router'
import vuetify from './vuetify'
import Vuetify from 'vuetify'

// Vue.config.performance = true

const app = createApp({
  data: () => ({ isLoaded: document.readyState === 'complete' }),
  vuetify,
  router,
  render () {
    return this.isLoaded ? h(App) : undefined
  },
})

app.use(Vuetify)

app.config.globalProperties.$vuetify = vuetify.framework

const vm = app.mount('#app')


// Prevent layout jump while waiting for styles
vm.isLoaded || window.addEventListener('load', () => {
  vm.isLoaded = true
})
