// Components
import VAvatar from '../VAvatar'

// Types
import { VNode, defineComponent } from 'vue'

/* @vue/component */
export default defineComponent({
  name: 'v-list-item-avatar',
  extends: VAvatar,

  props: {
    horizontal: Boolean,
    size: {
      type: [Number, String],
      default: 40,
    },
  },

  computed: {
    classes (): object {
      return {
        'v-list-item__avatar--horizontal': this.horizontal,
        ...VAvatar.computed.classes.call(this),
        'v-avatar--tile': this.tile || this.horizontal,
      }
    },
  },

  render (h): VNode {
    const render = VAvatar.render.call(this, h)

    render.data = render.data || {}
    render.data.staticClass += ' v-list-item__avatar'

    return render
  },
})
