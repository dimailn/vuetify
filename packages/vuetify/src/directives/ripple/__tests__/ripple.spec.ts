// Directives
import { Ripple } from '../'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { h, defineComponent, withDirectives } from 'vue'

describe('ripple.ts', () => {
  let mountFunction: (options?: MountingOptions) => VueWrapper<any>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    jest.useFakeTimers()

    mountFunction = (options = {}) => {
      const testComponent = defineComponent({
        render () {
          return withDirectives(h('div'), [[Ripple, true]])
        }
      })

      return mount(testComponent, {
        global: {
          directives: {
            ripple: Ripple
          }
        },
        ...options
      })
    }
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render element with ripple enabled if no value is passed', () => {
    const wrapper = mountFunction()

    const div = wrapper.find('div')
    expect(div.element._ripple?.enabled).toBe(true)
  })

  it('should update element property reactively', async () => {
    const testComponent = defineComponent({
      directives: {
        Ripple
      },
      props: {
        ripple: {
          type: Boolean,
          default: false
        }
      },
      render () {
        return withDirectives(h('div'), [[Ripple, this.ripple]])
      }
    })

    const wrapper = mount(testComponent, {
      props: {
        ripple: true
      }
    })

    const div = wrapper.find('div')
    expect(div.element._ripple?.enabled).toBe(true)

    await wrapper.setProps({ ripple: false })
    expect(div.element._ripple?.enabled).toBe(false)

    await wrapper.setProps({ ripple: true })
    expect(div.element._ripple?.enabled).toBe(true)
  })

  it('should trigger ripple on mousedown', () => {
    const wrapper = mountFunction()

    const mousedownEvent = new MouseEvent('mousedown', { detail: 1 })
    wrapper.element.dispatchEvent(mousedownEvent)

    expect(wrapper.find('.v-ripple__container').exists()).toBe(true)

    const mouseupEvent = new MouseEvent('mouseup', { detail: 1 })
    wrapper.element.dispatchEvent(mouseupEvent)

    jest.runAllTimers()
    expect(wrapper.find('.v-ripple__container').exists()).toBe(false)
  })

  it('should trigger ripple on enter key press', () => {
    const wrapper = mountFunction()

    const keydownEvent = new KeyboardEvent('keydown', { keyCode: 13 })
    wrapper.element.dispatchEvent(keydownEvent)

    expect(wrapper.find('.v-ripple__container').exists()).toBe(true)

    const keyupEvent = new KeyboardEvent('keyup')
    wrapper.element.dispatchEvent(keyupEvent)

    jest.runAllTimers()
    expect(wrapper.find('.v-ripple__container').exists()).toBe(false)
  })

  it('should trigger ripple on space key press', () => {
    const wrapper = mountFunction()

    const keydownEvent = new KeyboardEvent('keydown', { keyCode: 32 })
    wrapper.element.dispatchEvent(keydownEvent)

    expect(wrapper.find('.v-ripple__container').exists()).toBe(true)

    const keyupEvent = new KeyboardEvent('keyup')
    wrapper.element.dispatchEvent(keyupEvent)

    jest.runAllTimers()
    expect(wrapper.find('.v-ripple__container').exists()).toBe(false)
  })

  it('should only ripple on one element', () => {
    const wrapper = mount({
      directives: { Ripple },
      template: '<div v-ripple><div class="child" v-ripple></div></div>'
    })

    const child = wrapper.find('.child').element

    const mousedownEvent = new MouseEvent('mousedown', { detail: 1, bubbles: true })
    child.dispatchEvent(mousedownEvent)

    expect(wrapper.findAll('.v-ripple__container')).toHaveLength(1)

    const mouseupEvent = new MouseEvent('mouseup', { detail: 1, bubbles: true })
    child.dispatchEvent(mouseupEvent)

    jest.runAllTimers()
    expect(wrapper.findAll('.v-ripple__container')).toHaveLength(0)
  })

  it('should hide ripple on blur if keyboardRipple is true', () => {
    const wrapper = mountFunction()
    const keydownEvent = new KeyboardEvent('keydown', { keyCode: 13 })
    wrapper.element.dispatchEvent(keydownEvent)

    expect(wrapper.find('.v-ripple__container').exists()).toBe(true)

    const blurEvent = new FocusEvent('blur')
    wrapper.element.dispatchEvent(blurEvent)

    jest.runAllTimers()
    expect(wrapper.find('.v-ripple__container').exists()).toBe(false)
  })
})
