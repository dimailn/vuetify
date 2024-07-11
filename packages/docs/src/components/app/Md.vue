<script>
  import {h} from 'vue'

  // Utilities
  const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true,
  })

  export default {
    name: 'AppMd',

    functional: true,

    props: {
      tag: {
        type: String,
        default: 'div',
      },
    },

    render () {
      const data = this.$attrs
      const props = this.$props

      console.log(this.$slots.default)

      const children = this.$slots.default?.()
      const node = this.$.vnode || {}

      /*if (node.children) {
        children.push(...node.children)
      } else if (nodes.length > 1) {
        children.push(nodes)
      } else {
        */

        const text = node.text || this.$.vnode.el?.textContent || ''
        data.innerHTML = md.render(text, {})
      //}

      data.class = `v-markdown ${data.staticClass || ''}`.trim()

      return h(props.tag, data, children)
    },
  }
</script>
