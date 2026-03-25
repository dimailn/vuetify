// Components
import VDialog from '../VDialog'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { h } from 'vue'

// eslint-disable-next-line max-statements
describe('VDialog.ts', () => {
  type Instance = InstanceType<typeof VDialog>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>
  let el

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    el = document.createElement('div')
    el.setAttribute('data-app', 'true')
    document.body.appendChild(el)
    mountFunction = (options = {}) => {
      return mount(VDialog, {
        global: {
          mocks: {
            $vuetify: {
              theme: {},
              breakpoint: {}
            }
          }
        },
        ...options
      })
    }
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a disabled component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        disabled: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a persistent component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        persistent: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a fullscreen component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        fullscreen: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a eager component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        eager: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a scrollable component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        scrollable: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom origin and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        origin: 'top right'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom width (max-width) and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        maxWidth: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom width and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        width: '50%'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom transition and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        transition: 'fade-transition'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should open dialog on activator click', async () => {
    const input = jest.fn()
    const wrapper = mountFunction({
      slots: {
        activator: ({ on }) => h('div', {
          class: 'activator',
          ...on
        })
      },
      attrs: {
        'onUpdate:modelValue': input
      }
    })

    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.find('div.activator').trigger('click')
    expect(wrapper.vm.isActive).toBe(true)
    await wrapper.vm.$nextTick()
    expect(input).toHaveBeenCalledWith(true)
  })

  it('not should open disabled dialog on activator click', async () => {
    const input = jest.fn()
    const wrapper = mountFunction({
      props: {
        disabled: true
      },
      slots: {
        // eslint-disable-next-line sonarjs/no-identical-functions
        activator: ({ on }) => h('div', {
          class: 'activator',
          ...on
        })
      },
      attrs: {
        'onUpdate:modelValue': input
      }
    })

    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.find('div.activator').trigger('click')
    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.vm.$nextTick()
    expect(input).not.toHaveBeenCalled()
  })

  it('not change state on v-model update', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false
      },
      slots: {
        activator: '<span>activator</span>'
      }
    })

    expect(wrapper.vm.isActive).toBe(false)

    await wrapper.setProps({
      modelValue: true
    })
    expect(wrapper.vm.isActive).toBe(true)

    await wrapper.setProps({
      modelValue: false
    })
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should emit keydown event', async () => {
    const keydown = jest.fn()
    const wrapper = mountFunction({
      props: { modelValue: true },
      attrs: {
        onKeydown: keydown
      }
    })

    await wrapper.vm.$nextTick()
    const dialog = wrapper.find('.v-dialog')
    if (dialog.exists()) {
      dialog.trigger('keydown')
      expect(keydown).toHaveBeenCalled()
    }
  })

  // https://github.com/vuetifyjs/vuetify/issues/3101
  it('should always remove scrollbar when fullscreen', async () => {
    const wrapper = mountFunction()

    await wrapper.setProps({ modelValue: true })

    expect(document.documentElement.className).not.toContain('overflow-y-hidden')

    await wrapper.setProps({ fullscreen: true })

    expect(document.documentElement.className).toContain('overflow-y-hidden')
  })

  it('should not respond to events if disabled', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true
      },
      slots: {
        // eslint-disable-next-line sonarjs/no-identical-functions
        activator: ({ on }) => h('div', {
          class: 'activator',
          ...on
        })
      }
    })

    const activator = wrapper.find('div.activator')
    await activator.trigger('click')

    expect(wrapper.vm.isActive).toBe(false)
  })

  // https://github.com/vuetifyjs/vuetify/issues/5533
  it('should emit click:outside', async () => {
    const input = jest.fn()
    const clickOutside = jest.fn()
    const wrapper = mountFunction({
      slots: {
        // eslint-disable-next-line sonarjs/no-identical-functions
        activator: ({ on }) => h('div', {
          class: 'activator',
          ...on
        })
      },
      attrs: {
        'onUpdate:modelValue': input,
        'onClick:outside': clickOutside
      }
    })

    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.find('div.activator').trigger('click')
    expect(wrapper.vm.isActive).toBe(true)
    await wrapper.vm.$nextTick()
    expect(input).toHaveBeenCalledWith(true)

    wrapper.vm.onClickOutside(new Event('click'))
    expect(clickOutside).toHaveBeenCalled()
  })

  // Ensure dialog opens up when provided a default value
  it('should set model active before mounted', () => {
    const wrapper = mountFunction({
      props: { modelValue: true }
    })

    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should close dialog on escape keydown', async () => {
    const wrapper = mountFunction({
      props: { modelValue: true }
    })

    expect(wrapper.vm.isActive).toBe(true)
    const dialog = wrapper.find('.v-dialog')
    if (dialog.exists()) {
      await dialog.trigger('keydown.esc')
      expect(wrapper.vm.isActive).toBe(false)
    }
  })

  it('should only set tabindex if active', async () => {
    const wrapper = mountFunction({
      props: { eager: true }
    })

    const dialog = wrapper.find('.v-dialog')
    if (dialog.exists()) {
      expect(dialog.html()).toMatchSnapshot()
      expect(dialog.element.tabIndex).toBe(-1)

      wrapper.vm.isActive = true
      await wrapper.vm.$nextTick()

      expect(dialog.element.tabIndex).toBe(0)
      expect(dialog.html()).toMatchSnapshot()
    }
  })

  // https://github.com/vuetifyjs/vuetify/issues/8697
  it('should not close if persistent and hide-overly when click outside', async () => {
    const input = jest.fn()
    const clickOutside = jest.fn()
    const wrapper = mountFunction({
      props: {
        persistent: true,
        hideOverlay: true
      },
      slots: {
        // eslint-disable-next-line sonarjs/no-identical-functions
        activator: ({ on }) => h('div', {
          class: 'activator',
          ...on
        })
      },
      attrs: {
        'onUpdate:modelValue': input,
        'onClick:outside': clickOutside
      }
    })

    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.find('div.activator').trigger('click')
    expect(wrapper.vm.isActive).toBe(true)
    await wrapper.vm.$nextTick()
    expect(input).toHaveBeenCalledWith(true)

    wrapper.vm.onClickOutside(new Event('click'))
    expect(clickOutside).toHaveBeenCalled()
    expect(wrapper.vm.isActive).toBe(true)
  })
})
