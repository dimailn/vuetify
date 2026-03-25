import {h} from 'vue'
// Mixins
import Colorable from '../../mixins/colorable'

// Utilities
import mixins from '../../util/mixins'

// Types
import type { VNode } from '../../types/vue-internal'

/* @vue/component */
export default mixins(Colorable).extend({
  name: 'v-tabs-slider',

  render (): VNode {
    return h('div', this.setBackgroundColor(this.color, {
      class: 'v-tabs-slider',
    }))
  },
})
