// Components
import Bootable from '../index'

// Utilities
import {
  mount,
  enableAutoUnmount,
  VueWrapper,
} from '@vue/test-utils'
import { h, nextTick, Comment } from 'vue'

describe('Bootable.ts', () => {
  type Instance = InstanceType<typeof Bootable>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount({
        mixins: [Bootable],
        render: () => h('div'),
      }, {
        ...options,
      })
    }
  })

  it('should be booted after activation', async () => {
    const wrapper = mountFunction({
      data: () => ({
        isActive: false,
      }),
    })

    expect(wrapper.vm.isBooted).toBe(false)
    wrapper.vm.isActive = true
    await nextTick()
    expect(wrapper.vm.isBooted).toBe(true)
  })

  it('should return lazy content', async () => {
    const wrapper = mountFunction({
      props: {
        eager: true,
      },
    })

    expect(wrapper.vm.showLazyContent(() => 'content')).toBe('content')

    const wrapperLazy = mountFunction({
      data: () => ({
        isActive: false,
      }),
    })

    // В Vue 3 создаем комментарий как заглушку, аналогично Vue 2
    const lazyResult = wrapperLazy.vm.showLazyContent(() => 'content')
    expect(Array.isArray(lazyResult)).toBe(true)
    expect(lazyResult[0].type).toBe(Comment)
    wrapperLazy.vm.isActive = true
    await nextTick()
    expect(wrapperLazy.vm.showLazyContent(() => 'content')).toBe('content')
    wrapperLazy.vm.isActive = false
    await nextTick()
    expect(wrapperLazy.vm.showLazyContent(() => 'content')).toBe('content')
  })

  it('should show if lazy and active at boot', async () => {
    const wrapper = mountFunction({
      props: {
        eager: true,
      },
    })

    expect(wrapper.vm.showLazyContent(() => 'content')).toBe('content')
  })

  it('should boot', async () => {
    const wrapper = mountFunction({
      data: () => ({ isActive: false }),
    })

    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.isBooted).toBe(false)

    wrapper.vm.isActive = true
    await nextTick()
    expect(wrapper.vm.isBooted).toBe(true)
  })
})
