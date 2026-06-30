import { mount } from '@vue/test-utils'
import { h, defineComponent, withDirectives, resolveComponent } from 'vue'

const MyDir = { mounted: () => {} }

const VBtn = defineComponent({
  name: 'v-btn',
  render () {
    return withDirectives(h('button', { ref: 'btn' }, 'btn'), [[MyDir]])
  }
})

const VMenu = defineComponent({
  name: 'v-menu',
  data: () => ({ activatorNode: [] as any[] }),
  render () {
    const act = this.$slots.activator ? this.$slots.activator({ attrs: { class: 'act' } }) : []
    this.activatorNode = act
    return h('div', [this.activatorNode])
  }
})

describe('test', () => {
  it('works', () => {
    const AppBtn = defineComponent({
      setup (props, { slots, attrs }) {
        return () => h(VBtn, attrs, slots)
      }
    })

    const AppMenu = defineComponent({
      setup (props, { slots }) {
        return () => h(VMenu, null, {
          activator: (props: any) => slots.activator ? slots.activator(props) : null
        })
      }
    })

    const App = defineComponent({
      render () {
        return h(AppMenu, null, {
          activator: ({ attrs }: any) => h(AppBtn, attrs)
        })
      }
    })

    const wrapper = mount(App)
    console.log(wrapper.html())
  })
})
