// Components
import VMessages from '../VMessages'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { h } from 'vue'

// Types
import type { ComponentPublicInstance } from 'vue'

describe('VMessages.ts', () => {
  type Instance = ComponentPublicInstance
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VMessages, {
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
              icons: {
                component: null
              },
              lang: {
                t: (val: string) => val,
              },
            },
          },
        },
        ...options,
      })
    }
  })

  it('should have a default array', () => {
    const wrapper = mountFunction()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.v-messages').exists()).toBe(true)
  })

  it('should show messages', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: ['foo', 'bar'],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ modelValue: [] })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should allow HTML', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: ['<a href="#">a link</a>'],
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/9491
  it('should not allow HTML', () => {
    const wrapper = mount(VMessages, {
      global: {
        mocks: {
          $vuetify: {
            rtl: false,
            icons: {},
            lang: {
              t: (val: string) => val,
            },
          },
        },
      },
      props: {
        modelValue: ['<a href="#">a link</a>'],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should accept a scoped slot', () => {
    const wrapper = mount(VMessages, {
      global: {
        mocks: {
          $vuetify: {
            rtl: false,
            icons: {},
            lang: {
              t: (val: string) => val,
            },
          },
        },
      },
      props: { modelValue: ['Foo'] },
      slots: {
        default (props: any) {
          return h('div', props.message)
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
