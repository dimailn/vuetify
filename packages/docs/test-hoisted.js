const { createVNode, withDirectives, h, defineComponent, createApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')

const Child = defineComponent({
  render() {
    return h('div', { ref: 'myref' }, 'child')
  }
})

const App = defineComponent({
  render() {
    return h(Child)
  }
})

renderToString(createApp(App)).then(console.log).catch(console.error)
