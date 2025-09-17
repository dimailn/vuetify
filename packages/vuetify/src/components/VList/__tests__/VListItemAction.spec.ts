// Components
import VListItemAction from '../VListItemAction'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount,
} from '@vue/test-utils'
import { functionalContext } from '../../../../test'
import { defineComponent, h, ComponentPublicInstance } from 'vue'

describe('VListItemAction.ts', () => {
  type Instance = InstanceType<typeof VListItemAction>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VListItemAction, {
        ...options,
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with static class and match snapshot', () => {
    const wrapper = mountFunction({
      attrs: {
        class: 'static-class',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with many children and match snapshot', () => {
    const content1 = h('div', 'content1')
    const content2 = h('span', 'content2')
    const wrapper = mountFunction({
      slots: {
        default: () => [content1, content2],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with one children and match snapshot', () => {
    const visible = h('div', 'visible')
    const notVisible = h('span', 'notVisible')

    const wrapper = mountFunction({
      slots: {
        default: () => [visible, notVisible],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should work with v-html', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('div', {
          innerHTML: '<b>something</b>',
        }),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
