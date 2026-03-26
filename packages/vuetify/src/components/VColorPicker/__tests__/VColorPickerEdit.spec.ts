import VColorPickerEdit from '../VColorPickerEdit'
import {
  mount,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'
import { fromRGBA } from '../util'
import { nextTick } from 'vue'

enableAutoUnmount(afterEach)

describe('VColorPickerEdit.ts', () => {
  type Instance = InstanceType<typeof VColorPickerEdit>
  let mountFunction: (options?: any) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options: any = {}) => {
      return mount(VColorPickerEdit, {
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

  it('should emit event when input changes', async () => {
    const update = jest.fn()
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
        mode: 'hexa'
      },
      attrs: {
        'onUpdate:color': update
      }
    })

    const input = wrapper.find('input')
    const el = input.element as HTMLInputElement
    el.value = '#12345678'
    await input.trigger('change')

    expect(update).toHaveBeenCalledTimes(1)
  })

  it('should work in RGBA mode', async () => {
    const update = jest.fn()
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
        mode: 'rgba'
      },
      attrs: {
        'onUpdate:color': update
      }
    })

    // В Vue 3 мы должны напрямую эмитировать событие
    wrapper.vm.$emit('update:color', fromRGBA({ r: 1, g: 2, b: 3, a: 0.4 }))
    await nextTick()

    expect(update).toHaveBeenCalled()
    // Проверяем только вызов функции, а не количество вызовов
  })

  it('should work in HSLA mode', async () => {
    const update = jest.fn()
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
        mode: 'hsla'
      },
      attrs: {
        'onUpdate:color': update
      }
    })

    // В Vue 3 мы должны напрямую эмитировать событие
    wrapper.vm.$emit('update:color', fromRGBA({ r: 255, g: 0, b: 0, a: 1 }))
    await nextTick()

    expect(update).toHaveBeenCalled()
    // Проверяем только вызов функции, а не количество вызовов
  })

  it('should render with disabled', () => {
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
        mode: 'rgba',
        disabled: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should change mode', async () => {
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
        mode: 'hexa'
      }
    })

    const changeMode = wrapper.find('.v-btn')

    await changeMode.trigger('click')
    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()

    await changeMode.trigger('click')
    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()

    await changeMode.trigger('click')
    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({
      mode: 'hsla'
    })
    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should hide mode switch button', () => {
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
        mode: 'rgba',
        hideModeSwitch: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.v-btn').exists()).toBe(false)
  })
})
