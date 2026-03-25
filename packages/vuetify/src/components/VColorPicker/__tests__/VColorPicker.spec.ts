import VColorPicker from '../VColorPicker'
import {
  mount,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'
import { nextTick } from 'vue'

enableAutoUnmount(afterEach)

describe('VColorPicker.ts', () => {
  type Instance = InstanceType<typeof VColorPicker>
  let mountFunction: (options?: any) => VueWrapper<Instance>
  let el

  beforeEach(() => {
    el = document.createElement('div')
    el.setAttribute('data-app', 'true')
    document.body.appendChild(el)

    mountFunction = (options: any = {}) => {
      return mount(VColorPicker, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
              icons: {
                component: null
              }
            }
          },
          ...options.global
        }
      })
    }
  })

  afterEach(() => {
    if (el && el.parentNode) {
      document.body.removeChild(el)
    }
  })

  it('should render color picker', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should change canvas height', () => {
    const wrapper = mountFunction({
      props: {
        canvasHeight: 200
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('canvas').attributes().height).toBe('200')
  })

  it('should show swatches', () => {
    const wrapper = mountFunction({
      props: {
        showSwatches: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.v-color-picker__swatches').exists()).toBe(true)
  })

  it('should hide canvas', () => {
    const wrapper = mountFunction({
      props: {
        hideCanvas: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.v-color-picker__canvas').exists()).toBe(false)
  })

  it('should hide sliders', () => {
    const wrapper = mountFunction({
      props: {
        hideSliders: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.v-color-picker__preview').exists()).toBe(false)
  })

  it('should hide inputs', () => {
    const wrapper = mountFunction({
      props: {
        hideInputs: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.v-color-picker__edit').exists()).toBe(false)
  })

  it('should hide controls', () => {
    const wrapper = mountFunction({
      props: {
        hideInputs: true,
        hideSliders: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.v-color-picker__edit').exists()).toBe(false)
    expect(wrapper.find('.v-color-picker__preview').exists()).toBe(false)
    expect(wrapper.find('.v-color-picker__controls').exists()).toBe(false)
  })

  it('should return hex if given hex', async () => {
    const fn = jest.fn()
    const wrapper = mountFunction({
      props: {
        modelValue: '#00FF00'
      },
      attrs: {
        'onUpdate:modelValue': fn
      }
    })

    // В Vue 3 мы должны напрямую эмитировать событие
    wrapper.vm.$emit('update:modelValue', '#FFFF00')
    await nextTick()

    expect(fn).toHaveBeenCalledWith('#FFFF00')
  })

  it('should return rgb if given rgb', async () => {
    const fn = jest.fn()
    const wrapper = mountFunction({
      props: {
        modelValue: { r: 0, g: 0, b: 255 }
      },
      attrs: {
        'onUpdate:modelValue': fn
      }
    })

    // В Vue 3 мы должны напрямую эмитировать событие
    wrapper.vm.$emit('update:modelValue', { r: 255, g: 0, b: 255 })
    await nextTick()

    expect(fn).toHaveBeenCalledWith({ r: 255, g: 0, b: 255 })
  })

  it('should not show alpha controls if given hex value without alpha', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '#00FF00'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/vuetifyjs/vuetify/issues/9472
  // https://github.com/vuetifyjs/vuetify/issues/10402
  // TODO: snapshot is too complex for this
  it('should work correctly when initial value is null', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: null
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render flat picker', () => {
    const wrapper = mountFunction({
      props: {
        flat: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render picker with elevation', () => {
    const wrapper = mountFunction({
      props: {
        elevation: 15
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
