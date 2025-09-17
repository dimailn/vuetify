import { h, vShow, withDirectives, VNode, Component } from 'vue'
// Components
import VExpansionPanel from './VExpansionPanel'
import { VExpandTransition } from '../transitions'

// Mixins
import Bootable from '../../mixins/bootable'
import Colorable from '../../mixins/colorable'
import { inject as RegistrableInject } from '../../mixins/registrable'

// Utilities
import { getSlot } from '../../util/helpers'
import mixins from '../../util/mixins'

const baseMixins = mixins(
  Bootable,
  Colorable,
  RegistrableInject<'expansionPanel', Component>('expansionPanel', 'v-expansion-panel-content', 'v-expansion-panel')
)

interface options {
  expansionPanel: InstanceType<typeof VExpansionPanel>
}

/* @vue/component */
export default baseMixins.extend({
  name: 'v-expansion-panel-content',

  data: () => ({
    isActive: false,
  }),

  computed: {
    parentIsActive (): boolean {
      return this.expansionPanel.isActive
    },
  },

  watch: {
    parentIsActive: {
      immediate: true,
      handler (val, oldVal) {
        if (val) this.isBooted = true

        if (oldVal == null) this.isActive = val
        else this.$nextTick(() => this.isActive = val)
      },
    },
  },

  created () {
    this.expansionPanel.registerContent(this)
  },

  beforeUnmount () {
    this.expansionPanel.unregisterContent()
  },

  render (): VNode {
    return h(VExpandTransition, {}, () => this.showLazyContent(() => [
      withDirectives(h('div', this.setBackgroundColor(this.color, {
        class: 'v-expansion-panel-content',
      }), [
        h('div', { class: 'v-expansion-panel-content__wrap' }, getSlot(this, 'default', { open: this.isActive })),
      ]), [
        [
          vShow,
          this.isActive,
        ],
      ]),
    ]))
  },
})
