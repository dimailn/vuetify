import {h} from 'vue'
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
        'v-list-item__avatar': true
      }
    },
  },

  render (): VNode {
    return VAvatar.render.call(this)
  },
})
