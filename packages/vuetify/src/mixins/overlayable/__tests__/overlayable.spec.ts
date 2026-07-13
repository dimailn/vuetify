// Components
import Overlayable from '../index'

// Utilities
import { mount, MountingOptions, VueWrapper, enableAutoUnmount } from '@vue/test-utils'
import { waitAnimationFrame } from '../../../../test'
import { defineComponent, h, nextTick } from 'vue'

describe('Overlayable.ts', () => {
  enableAutoUnmount(afterEach)

  const Mock = defineComponent({
    mixins: [Overlayable],
    data: () => ({
      isActive: false
    }),
    render: () => h('div')
  })

  beforeEach(() => {
    document.body.setAttribute('data-app', 'true')
  })

  type Instance = InstanceType<typeof Mock>;
  let mountFunction: (options?: MountingOptions<any>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Mock, {
        global: {
          mocks: {
            $vuetify: { breakpoint: {} }
          }
        },
        ...options
      })
    }
  })

  it('should avoid removing overlay', async () => {
    const wrapper = mountFunction()

    wrapper.vm.genOverlay()

    await waitAnimationFrame()

    expect(wrapper.vm.overlay).toBeTruthy()

    wrapper.vm.removeOverlay()
    // Simulate overlay being rapidly opened/closed
    wrapper.vm.overlay.value = true

    const event = new Event('transitionend')

    wrapper.vm.overlay.$el.dispatchEvent(event)
    expect(wrapper.vm.overlay).toBeTruthy()

    wrapper.vm.removeOverlay()

    wrapper.vm.overlay.$el.dispatchEvent(event)
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  it('should be removed', async () => {
    const wrapper = mountFunction()

    wrapper.vm.genOverlay()
    wrapper.vm.removeOverlay()

    await waitAnimationFrame()
    expect(wrapper.vm.overlay.value).toBeFalsy()

    const event = new Event('transitionend')
    wrapper.vm.overlay.$el.dispatchEvent(event)
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  it('destroyOverlay безопасен когда оверлея нет', () => {
    const wrapper = mountFunction()
    expect(() => wrapper.vm.destroyOverlay()).not.toThrow()
    expect(wrapper.vm.overlay).toBeFalsy()
  })

  it('should remove overlay app container after close', async () => {
    const wrapper = mountFunction()

    wrapper.vm.genOverlay()
    await waitAnimationFrame()

    expect(document.querySelectorAll('[data-v-app]')).toHaveLength(1)

    wrapper.vm.removeOverlay()
    wrapper.vm.overlay.$el.dispatchEvent(new Event('transitionend'))

    expect(wrapper.vm.overlay).toBeFalsy()
    expect(document.querySelectorAll('[data-v-app]')).toHaveLength(0)
  })

  // https://github.com/vuetifyjs/vuetify/issues/8473
  it('should get root element z-index if activeIndex is not available', async () => {
    const wrapper = mountFunction()

    wrapper.vm.$el.style.zIndex = '8'

    wrapper.vm.genOverlay()

    await waitAnimationFrame()

    expect(wrapper.vm.overlay.zIndex).toBe(8)
  })

  // https://github.com/vuetifyjs/vuetify/issues/8142
  it('should not update overlay state if not active', async () => {
    const cb = jest.fn()
    const wrapper = mountFunction({
      global: {
        mocks: {
          $vuetify: { breakpoint: {} }
        }
      }
    })

    // Mock the methods
    wrapper.vm.removeOverlay = cb
    wrapper.vm.genOverlay = cb

    await wrapper.setProps({ hideOverlay: true })
    await wrapper.setProps({ hideOverlay: false })

    expect(cb).not.toHaveBeenCalled()

    wrapper.vm.isActive = true
    await nextTick()

    await wrapper.setProps({ hideOverlay: true })
    await wrapper.setProps({ hideOverlay: false })

    expect(cb).toHaveBeenCalledTimes(2)
  })

  describe('stale overlay ref after DOM detach', () => {
    /** Как у VNavigationDrawer: showOverlay управляет genOverlay/removeOverlay */
    const DrawerLike = defineComponent({
      mixins: [Overlayable],
      data: () => ({
        isActive: false,
        isMobile: false,
        temporary: false
      }),
      computed: {
        showOverlay (): boolean {
          return this.isActive && (this.isMobile || this.temporary)
        }
      },
      watch: {
        showOverlay (val: boolean) {
          if (val) this.genOverlay()
          else this.removeOverlay()
        }
      },
      render: () => h('div', { class: 'drawer-host' })
    })

    let mountDrawerLike: (options?: MountingOptions<any>) => VueWrapper<any>

    beforeEach(() => {
      document.body.innerHTML = ''
      document.body.setAttribute('data-app', 'true')

      mountDrawerLike = (options = {}) => mount(DrawerLike, {
        global: {
          mocks: {
            $vuetify: { breakpoint: {} }
          }
        },
        ...options
      })
    })

    it('genOverlay пересоздаёт оверлей если узел отцеплён от DOM', async () => {
      const wrapper = mountDrawerLike()

      wrapper.vm.temporary = true
      wrapper.vm.isActive = true
      await nextTick()
      await waitAnimationFrame()

      const app = document.querySelector('[data-app]') as HTMLElement
      wrapper.vm.overlay!.$el.parentNode!.remove()

      wrapper.vm.genOverlay()
      await waitAnimationFrame()

      expect(app.querySelector('.v-overlay--active')).toBeTruthy()
      expect(wrapper.vm.overlay!.$el.isConnected).toBe(true)
    })

    it('повторное открытие дровера восстанавливает оверлей в [data-app]', async () => {
      const wrapper = mountDrawerLike()

      wrapper.vm.temporary = true
      wrapper.vm.isActive = true
      await nextTick()
      await waitAnimationFrame()

      const app = document.querySelector('[data-app]') as HTMLElement
      wrapper.vm.overlay!.$el.parentNode!.remove()

      wrapper.vm.isActive = false
      await nextTick()
      wrapper.vm.isActive = true
      await nextTick()
      await waitAnimationFrame()

      expect(app.querySelector('.v-overlay--active')).toBeTruthy()
      expect(wrapper.vm.overlay!.$el.isConnected).toBe(true)
    })

    it('beforeUnmount уничтожает оверлей даже при isActive (фикс залипшего overlay)', async () => {
      const wrapper = mountDrawerLike()

      wrapper.vm.temporary = true
      wrapper.vm.isActive = true
      await nextTick()
      await waitAnimationFrame()

      const app = document.querySelector('[data-app]') as HTMLElement
      expect(app.querySelector('.v-overlay')).toBeTruthy()
      expect(document.querySelectorAll('[data-v-app]')).toHaveLength(1)

      wrapper.unmount()

      expect(app.querySelector('.v-overlay')).toBeNull()
      expect(document.querySelectorAll('[data-v-app]')).toHaveLength(0)
    })

    it('showOverlay true→true не вызывает genOverlay после потери [data-app]', async () => {
      const genOverlay = jest.fn()
      const removeOverlay = jest.fn()

      const wrapper = mountDrawerLike()

      wrapper.vm.genOverlay = genOverlay
      wrapper.vm.removeOverlay = removeOverlay

      wrapper.vm.temporary = true
      wrapper.vm.isActive = true
      await nextTick()

      genOverlay.mockClear()
      removeOverlay.mockClear()

      document.body.innerHTML = ''
      document.body.setAttribute('data-app', 'true')

      expect(wrapper.vm.showOverlay).toBe(true)
      expect(genOverlay).not.toHaveBeenCalled()
      expect(removeOverlay).not.toHaveBeenCalled()
    })
  })
})
