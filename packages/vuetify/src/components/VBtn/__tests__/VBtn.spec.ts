/* eslint-disable max-statements */
// Components
import VBtn from '../VBtn'

// Utilities
import { mount, enableAutoUnmount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import { Vue3RouterLinkStub } from '../../../../test/util/stubs'

// Auto cleanup after each test
enableAutoUnmount(afterEach)

describe('VBtn.ts', () => {
  // eslint-disable-line max-statements
  let mountFunction: (options?: object) => VueWrapper<any>
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/foobar', component: { template: '<div>Foobar</div>' } },
        { path: '/fizzbuzz', component: { template: '<div>Fizzbuzz</div>' } },
        { path: '/foo', component: { template: '<div>Foo</div>' } },
      ],
    })

    mountFunction = (options = {}) => {
      return mount(VBtn, {
        global: {
          plugins: [router],
            components: {
              "router-link": Vue3RouterLinkStub
            },
          ...options.global
        },
        ...options
      });
    }
  })

  it('should render component and match snapshot', () => {
    expect(mountFunction().html()).toMatchSnapshot()
  })

  it('should render component with color prop and match snapshot', () => {
    expect(
      mountFunction({
        props: {
          color: 'green darken-1',
        },
      }).html()
    ).toMatchSnapshot()

    expect(
      mountFunction({
        props: {
          color: 'green darken-1',
          text: true,
        },
      }).html()
    ).toMatchSnapshot()
  })

  it('should render component with loader slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
      slots: {
        loader: '<span>loader</span>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with loader and match snapshot', () => {
    const wrapper = mount(VBtn, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render tile button and match snapshot', () => {
    const wrapper = mount(VBtn, {
      props: {
        tile: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render an <a> tag when using href prop', () => {
    const wrapper = mountFunction({
      props: {
        href: 'http://www.google.com',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render specified tag when using tag prop', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'a',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should register and unregister', () => {
    const register = jest.fn()
    const unregister = jest.fn()

    const wrapper = mountFunction({
      global: {
        provide: {
          btnToggle: {
            register,
            unregister,
          },
        },
      },
    })

    expect(register).toHaveBeenCalled()
    wrapper.unmount()
    expect(unregister).toHaveBeenCalled()
  })


  it('should use custom active-class', () => {
    const wrapper = mountFunction({
      props: {
        inputValue: true,
        activeClass: 'foo',
      },
    })

    expect(wrapper.classes('foo')).toBe(true)
  })

  it('should have v-btn--plain class when plain prop is set to true', () => {
    const wrapper = mountFunction({
      props: {
        plain: true,
      },
    })

    expect(wrapper.classes('v-btn--plain')).toBe(true)
  })

  it('should have the correct icon classes', async () => {
    const wrapper = mountFunction({
      props: {
        icon: true,
      },
    })
    expect(wrapper.classes('v-btn--icon')).toBe(true)

    await wrapper.setProps({ icon: false })

    expect(wrapper.classes('v-btn--icon')).toBe(false)
  })

  it('should have the correct elevation', async () => {
    // eslint-disable-line max-statements
    const wrapper = mountFunction()

    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes('elevation-2')).toBe(false)
    expect(wrapper.classes('v-btn--disabled')).toBe(true)

    await wrapper.setProps({ disabled: false, elevation: 24 })
    expect(wrapper.classes('elevation-24')).toBe(true)

    await wrapper.setProps({ elevation: 2 })
    expect(wrapper.classes('elevation-2')).toBe(true)
  })



  it('should stringify non string|number values', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'foo',
      },
    })

    expect(wrapper.attributes('value')).toBe('foo')

    await wrapper.setProps({ value: 2 })
    expect(wrapper.attributes('value')).toBe('2')

    await wrapper.setProps({ value: { foo: 'bar' } })
    expect(wrapper.attributes('value')).toBe('{"foo":"bar"}')
  })

  it('should not add color classes if disabled', async () => {
    const wrapper = mountFunction({
      props: {
        color: 'primary darken-2',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      disabled: true,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should retain focus when clicked', async () => {
    const wrapper = mountFunction({
      props: {
        retainFocusOnClick: true,
      },
    })
    const event = new MouseEvent('click', { detail: 1 })
    const blur = jest.fn()

    wrapper.element.blur = blur
    wrapper.element.dispatchEvent(event)

    expect(blur).not.toHaveBeenCalled()

    await wrapper.setProps({ retainFocusOnClick: false })
    wrapper.element.dispatchEvent(event)

    expect(blur).toHaveBeenCalled()
  })

  // New tests for Vue 3 migration - attribute passing
  it('should have access to $attrs in component', () => {
    const wrapper = mount(VBtn, {
      global: {
        plugins: [router],
      },
      attrs: {
        'data-test': 'my-button',
        'data-cy': 'button-cy',
        'aria-label': 'Test button',
      },
    })

    // Check that component receives attrs
    expect(wrapper.vm.$attrs['data-test']).toBe('my-button')
    expect(wrapper.vm.$attrs['data-cy']).toBe('button-cy')
    expect(wrapper.vm.$attrs['aria-label']).toBe('Test button')
  })

  it('should have access to custom attrs in component', () => {
    const wrapper = mount(VBtn, {
      global: {
        plugins: [router],
      },
      attrs: {
        id: 'custom-id',
        role: 'button',
        tabindex: '0',
      },
    })

    // Check that component receives attrs
    expect(wrapper.vm.$attrs.id).toBe('custom-id')
    expect(wrapper.vm.$attrs.role).toBe('button')
    expect(wrapper.vm.$attrs.tabindex).toBe('0')
  })

  it('should merge class attributes correctly', () => {
    const wrapper = mount(VBtn, {
      global: {
        plugins: [router],
      },
      attrs: {
        class: 'custom-class another-class',
      },
      props: {
        color: 'primary',
      },
    })

    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.classes()).toContain('another-class')
    expect(wrapper.classes()).toContain('v-btn')
  })

  // Tests for new component properties
  it('should apply block class when block prop is true', () => {
    const wrapper = mountFunction({
      props: {
        block: true,
      },
    })

    expect(wrapper.classes('v-btn--block')).toBe(true)
  })

  it('should apply fab class when fab prop is true', () => {
    const wrapper = mountFunction({
      props: {
        fab: true,
      },
    })

    expect(wrapper.classes('v-btn--fab')).toBe(true)
  })

  it('should apply outlined class when outlined prop is true', () => {
    const wrapper = mountFunction({
      props: {
        outlined: true,
      },
    })

    expect(wrapper.classes('v-btn--outlined')).toBe(true)
  })

  it('should apply text class when text prop is true', () => {
    const wrapper = mountFunction({
      props: {
        text: true,
      },
    })

    expect(wrapper.classes('v-btn--text')).toBe(true)
  })

  it('should apply rounded class when rounded prop is true', () => {
    const wrapper = mountFunction({
      props: {
        rounded: true,
      },
    })

    expect(wrapper.classes('v-btn--rounded')).toBe(true)
  })

  it('should apply depressed class and remove elevation when depressed prop is true', () => {
    const wrapper = mountFunction({
      props: {
        depressed: true,
      },
    })

    // When depressed, should not have elevation classes
    expect(wrapper.classes()).not.toContain('elevation-2')
  })

  it('should render loader when loading prop is true', () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
    })

    expect(wrapper.classes('v-btn--loading')).toBe(true)
    expect(wrapper.find('.v-btn__loader').exists()).toBe(true)
  })

  it('should handle different button types', async () => {
    const wrapper = mountFunction({
      props: {
        type: 'submit',
      },
    })

    expect(wrapper.attributes('type')).toBe('submit')

    await wrapper.setProps({ type: 'reset' })
    expect(wrapper.attributes('type')).toBe('reset')
  })

  it('should compute hasBg correctly', () => {
    // hasBg should be true by default
    let wrapper = mountFunction()
    expect(wrapper.vm.hasBg).toBe(true)

    // hasBg should be false for text buttons
    wrapper = mountFunction({
      props: { text: true },
    })
    expect(wrapper.vm.hasBg).toBe(false)

    // hasBg should be false for plain buttons
    wrapper = mountFunction({
      props: { plain: true },
    })
    expect(wrapper.vm.hasBg).toBe(false)

    // hasBg should be false for outlined buttons
    wrapper = mountFunction({
      props: { outlined: true },
    })
    expect(wrapper.vm.hasBg).toBe(false)

    // hasBg should be false for icon buttons
    wrapper = mountFunction({
      props: { icon: true },
    })
    expect(wrapper.vm.hasBg).toBe(false)
  })

  it('should compute isElevated correctly', () => {
    // Should be elevated by default
    let wrapper = mountFunction()
    expect(wrapper.vm.isElevated).toBe(true)

    // Should not be elevated when disabled
    wrapper = mountFunction({
      props: { disabled: true },
    })
    expect(wrapper.vm.isElevated).toBe(false)

    // Should not be elevated when text
    wrapper = mountFunction({
      props: { text: true },
    })
    expect(wrapper.vm.isElevated).toBe(false)

    // Should not be elevated when outlined
    wrapper = mountFunction({
      props: { outlined: true },
    })
    expect(wrapper.vm.isElevated).toBe(false)

    // Should not be elevated when depressed
    wrapper = mountFunction({
      props: { depressed: true },
    })
    expect(wrapper.vm.isElevated).toBe(false)

    // Should not be elevated when icon
    wrapper = mountFunction({
      props: { icon: true },
    })
    expect(wrapper.vm.isElevated).toBe(false)

    // Should not be elevated when plain
    wrapper = mountFunction({
      props: { plain: true },
    })
    expect(wrapper.vm.isElevated).toBe(false)
  })

  it('should compute isRound correctly', () => {
    // Should not be round by default
    let wrapper = mountFunction()
    expect(wrapper.vm.isRound).toBe(false)

    // Should be round when icon
    wrapper = mountFunction({
      props: { icon: true },
    })
    expect(wrapper.vm.isRound).toBe(true)

    // Should be round when fab
    wrapper = mountFunction({
      props: { fab: true },
    })
    expect(wrapper.vm.isRound).toBe(true)
  })

  it('should compute ripple correctly', () => {
    // Should have ripple by default
    let wrapper = mountFunction()
    expect(wrapper.vm.computedRipple).toBe(true)

    // Should not have ripple when disabled
    wrapper = mountFunction({
      props: { disabled: true },
    })
    expect(wrapper.vm.computedRipple).toBe(false)

    // Should have circle ripple for icon buttons
    wrapper = mountFunction({
      props: { icon: true },
    })
    expect(wrapper.vm.computedRipple).toEqual({ circle: true })

    // Should have circle ripple for fab buttons
    wrapper = mountFunction({
      props: { fab: true },
    })
    expect(wrapper.vm.computedRipple).toEqual({ circle: true })
  })

  it('should render with correct tag when using href', () => {
    const wrapper = mountFunction({
      props: {
        href: 'https://example.com',
      },
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('should add router class when to prop is provided', () => {
    // Suppress Vue 3 slot warning - this is a known issue with Vue Test Utils
    const originalWarn = console.warn
    console.warn = jest.fn()

    const wrapper = mountFunction({
      props: {
        to: '/test-route',
      },
      slots: {
        default: () => 'Router Button',
      },
    })

    expect(wrapper.classes('v-btn--router')).toBe(true)

    console.warn = originalWarn
  })
})
