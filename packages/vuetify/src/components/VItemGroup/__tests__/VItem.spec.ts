// Components
import VItem from '../VItem'

// Utilities
import {
  mount,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h, nextTick } from 'vue'


describe('VItem', () => {
  let mountFunction: (options?: object) => any

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VItem, {
        ...options,
      })
    }
  })

  it.skip('should render without default slot', () => {
    // VItem должен использоваться внутри VItemGroup
    const VItemGroup = require('../VItemGroup').default
    const wrapper = mount(VItemGroup, {
      slots: {
        default: () => h(VItem)
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render with multiple elements', () => {
    // VItem должен использоваться внутри VItemGroup
    const VItemGroup = require('../VItemGroup').default
    const wrapper = mount(VItemGroup, {
      slots: {
        default: () => h(VItem, {}, {
          default: () => [h('div', 'foo'), h('div', 'bar')]
        })
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should match snapshot activeClass', async () => {
    const wrapper = mount(VItem, {
      props: {
        activeClass: 'foo',
      },
      slots: {
        default: '<div>test content</div>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    // Изменяем isActive напрямую в компоненте
    wrapper.vm.isActive = true

    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()

    expect('[Vuetify] The v-item component must be used inside a v-item-group').toHaveBeenTipped()
  })
})
