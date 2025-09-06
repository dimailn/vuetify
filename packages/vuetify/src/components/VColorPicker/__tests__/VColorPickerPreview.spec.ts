import VColorPickerPreview from '../VColorPickerPreview'
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { fromRGBA } from '../util'
import { nextTick } from 'vue'

enableAutoUnmount(afterEach)

describe('VColorPickerPreview.ts', () => {
  type Instance = InstanceType<typeof VColorPickerPreview>
  let mountFunction: (options?: any) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options: any = {}) => {
      return mount(VColorPickerPreview, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
            },
          },
          ...options.global,
        },
      })
    }
  })

  it('should emit event when hue changes', async () => {
    const warn = console.warn
    console.warn = () => {}

    const update = jest.fn()
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
      },
      attrs: {
        'onUpdate:color': update,
      },
    })

    const slider = wrapper.find('.v-slider__thumb-container')

    await slider.trigger('keydown.right')
    await nextTick()
    expect(update).toHaveBeenCalledTimes(1)
    expect(update.mock.calls[0][0].hue).toBe(1)

    console.warn = warn
  })

  it('should emit event when alpha changes', async () => {
    const warn = console.warn
    console.warn = () => {}

    const update = jest.fn()
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 }),
      },
      attrs: {
        'onUpdate:color': update,
      },
    })

    const slider = wrapper.findAll('.v-slider__thumb-container')[1]

    await slider.trigger('keydown.right')
    await nextTick()
    expect(update).toHaveBeenCalledTimes(1)
    expect(update.mock.calls[0][0].alpha).toBe(1)

    console.warn = warn
  })
})
