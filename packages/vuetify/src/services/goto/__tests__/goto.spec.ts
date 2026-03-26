// Lib
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

// Components
import VBtn from '../../../components/VBtn'

// Services
import goTo, { Goto } from '../index'
import { Application } from '../../application/index'

// Utils
import { getOffset, getContainer } from '../util'

// Types
import { VuetifyServiceContract } from 'vuetify/types/services'

describe('$vuetify.goTo', () => {
  (global as any).performance = require('perf_hooks').performance
  let framework: Record<string, VuetifyServiceContract> = {}

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    framework = {
      application: new Application()
    }

    goTo.framework = framework
  })

  it('should throw error when target is undefined or null', async () => {
    expect(() => goTo(undefined))
      .toThrow(new TypeError('Target must be a Number/Selector/HTMLElement/VueComponent, received undefined instead.'))

    expect(() => goTo(null))
      .toThrow(new TypeError('Target must be a Number/Selector/HTMLElement/VueComponent, received null instead.'))
  })

  it('should throw error when target element is not found', async () => {
    expect(() => goTo('#foo'))
      .toThrow(new Error('Target element "#foo" not found.'))
  })

  it('should throw error when container element is not found', async () => {
    expect(() => goTo(0, { container: '#thisContainerDoesNotExist' }))
      .toThrow(new Error('Container element "#thisContainerDoesNotExist" not found.'))
  })

  it('should throw error when container is undefined or null', async () => {
    expect(() => goTo(0, { container: undefined }))
      .toThrow(new TypeError('Container must be a Selector/HTMLElement/VueComponent, received undefined instead.'))

    expect(() => goTo(0, { container: null }))
      .toThrow(new TypeError('Container must be a Selector/HTMLElement/VueComponent, received null instead.'))

    expect(() => goTo(0, { container: 42 as any }))
      .toThrow(new TypeError('Container must be a Selector/HTMLElement/VueComponent, received Number instead.'))
  })

  it('should throw error if easing does not exist', async () => {
    expect(() => goTo(1, { easing: 'thisEasingDoesNotExist' }))
      .toThrow(new TypeError('Easing function "thisEasingDoesNotExist" not found.'))
  })

  it('should not throw error when using VueComponent as target', async () => {
    const btn = mount(VBtn)

    await expect(goTo(btn.vm, { duration: 0 })).resolves.not.toBeUndefined()
  })

  it('should work with Vue 3 component wrapper from Vue Test Utils', async () => {
    const TestComponent = defineComponent({
      template: '<div>Test Component</div>'
    })
    const wrapper = mount(TestComponent)

    await expect(goTo(wrapper.vm, { duration: 0 })).resolves.not.toBeUndefined()
  })

  it('should work with raw HTMLElement', async () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    await expect(goTo(element, { duration: 0 })).resolves.not.toBeUndefined()

    document.body.removeChild(element)
  })

  it('should work with CSS selector string', async () => {
    const element = document.createElement('div')
    element.id = 'test-goto-element'
    document.body.appendChild(element)

    await expect(goTo('#test-goto-element', { duration: 0 })).resolves.not.toBeUndefined()

    document.body.removeChild(element)
  })

  it('should work with number offset', async () => {
    await expect(goTo(100, { duration: 0 })).resolves.not.toBeUndefined()
  })

  it('should use VueComponent as container', async () => {
    const TestComponent = defineComponent({
      template: '<div style="height: 1000px; overflow: auto"><div style="height: 2000px;">Content</div></div>'
    })
    const wrapper = mount(TestComponent)

    await expect(goTo(100, { container: wrapper.vm, duration: 0 })).resolves.not.toBeUndefined()
  })

  it('should instantiate and return goto', () => {
    expect(new Goto()).toEqual(goTo)
  })
})

describe('goto utilities', () => {
  let utilsFramework: Record<string, VuetifyServiceContract> = {}

  beforeEach(() => {
    utilsFramework = {
      application: new Application()
    }
    goTo.framework = utilsFramework
  })

  describe('getOffset', () => {
    it('should return number when target is number', () => {
      expect(getOffset(100)).toBe(100)
    })

    it('should return offset for HTMLElement', () => {
      const element = document.createElement('div')
      element.style.position = 'absolute'
      element.style.top = '50px'
      document.body.appendChild(element)

      expect(getOffset(element)).toBeGreaterThanOrEqual(0)

      document.body.removeChild(element)
    })

    it('should return offset for Vue 3 component', () => {
      const TestComponent = defineComponent({
        template: '<div>Test</div>'
      })
      const wrapper = mount(TestComponent)

      expect(getOffset(wrapper.vm)).toBeGreaterThanOrEqual(0)
    })

    it('should return offset for CSS selector', () => {
      const element = document.createElement('div')
      element.id = 'test-offset-element'
      document.body.appendChild(element)

      expect(getOffset('#test-offset-element')).toBeGreaterThanOrEqual(0)

      document.body.removeChild(element)
    })

    it('should throw error for invalid selector', () => {
      expect(() => getOffset('#nonexistent-element'))
        .toThrow('Target element "#nonexistent-element" not found.')
    })

    it('should throw error for invalid target type', () => {
      expect(() => getOffset({ invalid: 'target' }))
        .toThrow('Target must be a Number/Selector/HTMLElement/VueComponent')
    })
  })

  describe('getContainer', () => {
    it('should return HTMLElement for valid container', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)

      expect(getContainer(element)).toBe(element)

      document.body.removeChild(element)
    })

    it('should return HTMLElement for Vue 3 component container', () => {
      const TestComponent = defineComponent({
        template: '<div>Test Container</div>'
      })
      const wrapper = mount(TestComponent)

      const result = getContainer(wrapper.vm)
      expect(result).toBeInstanceOf(HTMLElement)
    })

    it('should return HTMLElement for CSS selector container', () => {
      const element = document.createElement('div')
      element.id = 'test-container-element'
      document.body.appendChild(element)

      expect(getContainer('#test-container-element')).toBe(element)

      document.body.removeChild(element)
    })

    it('should throw error for invalid container selector', () => {
      expect(() => getContainer('#nonexistent-container'))
        .toThrow('Container element "#nonexistent-container" not found.')
    })

    it('should throw error for invalid container type', () => {
      expect(() => getContainer(42))
        .toThrow('Container must be a Selector/HTMLElement/VueComponent')
    })
  })
})
