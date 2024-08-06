import {h} from 'vue'
// Types
import mixins, { ExtractVue } from '../../util/mixins'
import { VNode, VNodeData } from 'vue'

// Components
import VTimeline from './VTimeline'
import VIcon from '../VIcon'

// Mixins
import Themeable from '../../mixins/themeable'
import Colorable from '../../mixins/colorable'
import { getSlot } from '../../util/helpers'
import mergeData from '../../util/mergeData'

const baseMixins = mixins(
  Colorable,
  Themeable
/* @vue/component */
)

type VTimelineInstance = InstanceType<typeof VTimeline>

interface options extends ExtractVue<typeof baseMixins> {
  timeline: VTimelineInstance
}

export default baseMixins.extend({
  name: 'v-timeline-item',

  inject: ['timeline'],

  props: {
    color: {
      type: String,
      default: 'primary',
    },
    fillDot: Boolean,
    hideDot: Boolean,
    icon: String,
    iconColor: String,
    large: Boolean,
    left: Boolean,
    right: Boolean,
    small: Boolean,
  },

  computed: {
    hasIcon (): boolean {
      return !!this.icon || !!this.$slots.icon
    },
  },

  methods: {
    genBody () {
      return h('div', {
        class: 'v-timeline-item__body',
      }, getSlot(this))
    },
    genIcon (): VNode | VNode[] {
      return getSlot(this, 'icon') || h(VIcon, {
        color: this.iconColor,
        dark: !this.theme.isDark,
        small: this.small
      }, this.icon)
    },
    genInnerDot () {
      const data: VNodeData = this.setBackgroundColor(this.color)

      return h('div', mergeData({
        class: 'v-timeline-item__inner-dot',
      }, data), [this.hasIcon && this.genIcon()])
    },
    genDot () {
      return h('div', {
        class: ['v-timeline-item__dot', {
          'v-timeline-item__dot--small': this.small,
          'v-timeline-item__dot--large': this.large,
        }],
      }, [this.genInnerDot()])
    },
    genDivider () {
      const children = []

      if (!this.hideDot) children.push(this.genDot())

      return h('div', {
        class: 'v-timeline-item__divider',
      }, children)
    },
    genOpposite () {
      return h('div', {
        class: 'v-timeline-item__opposite',
      }, getSlot(this, 'opposite'))
    },
  },

  render (): VNode {
    const children = [
      this.genBody(),
      this.genDivider(),
    ]

    if (this.$slots.opposite) children.push(this.genOpposite())

    return h('div', {
      class: ['v-timeline-item', {
        'v-timeline-item--fill-dot': this.fillDot,
        'v-timeline-item--before': this.timeline.reverse ? this.right : this.left,
        'v-timeline-item--after': this.timeline.reverse ? this.left : this.right,
        ...this.themeClasses,
      }],
    }, children)
  },
})
