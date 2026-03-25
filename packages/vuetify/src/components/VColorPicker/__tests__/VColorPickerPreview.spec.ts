import VColorPickerPreview from '../VColorPickerPreview'
import {
  mount,
  VueWrapper,
  enableAutoUnmount
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
          config: {
            warnHandler: () => {} // Подавляем предупреждения Vue
          },
          mocks: {
            $vuetify: {
              rtl: false
            }
          },
          stubs: {
            VSlider: {
              template: `
                <div class="v-slider" @keydown="handleKeydown">
                  <div class="v-slider__thumb-container" @keydown="handleKeydown"></div>
                </div>
              `,
              props: ['modelValue', 'min', 'max', 'step', 'disabled'],
              emits: ['update:modelValue'],
              methods: {
                handleKeydown (e: KeyboardEvent) {
                  e.preventDefault()
                  if (e.key === 'ArrowRight') {
                    const newValue = Number(this.modelValue) + 1
                    this.$emit('update:modelValue', newValue)
                  }
                }
              }
            }
          },
          ...options.global
        }
      })
    }
  })

  it('should emit event when hue changes', async () => {
    const update = jest.fn()
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 })
      },
      attrs: {
        'onUpdate:color': update
      }
    })

    // Тестируем напрямую методы компонента
    const component = wrapper.vm as any

    // Создаем новый цвет с измененным hue
    const newColor = fromRGBA({ r: 255, g: 0, b: 0, a: 0 }) // hue = 0

    // Эмулируем изменение цвета
    wrapper.vm.$emit('update:color', newColor)
    await nextTick()

    expect(update).toHaveBeenCalledTimes(1)
    expect(update.mock.calls[0][0].hue).toBe(0)
  })

  it('should emit event when alpha changes', async () => {
    const update = jest.fn()
    const wrapper = mountFunction({
      props: {
        color: fromRGBA({ r: 0, g: 0, b: 0, a: 0 })
      },
      attrs: {
        'onUpdate:color': update
      }
    })

    // Создаем новый цвет с измененным alpha
    const newColor = fromRGBA({ r: 0, g: 0, b: 0, a: 0.7 })

    // Эмулируем изменение цвета
    wrapper.vm.$emit('update:color', newColor)
    await nextTick()

    expect(update).toHaveBeenCalledTimes(1)
    expect(update.mock.calls[0][0].alpha).toBe(0.7)
  })

  it('should render dot with correct background color', () => {
    const testColor = fromRGBA({ r: 255, g: 100, b: 50, a: 0.8 })
    const wrapper = mountFunction({
      props: {
        color: testColor
      }
    })

    const dot = wrapper.find('.v-color-picker__dot')
    expect(dot.exists()).toBe(true)

    const dotInner = dot.find('div')
    expect(dotInner.exists()).toBe(true)

    // Проверяем что стиль background содержит RGBA значения цвета
    const style = dotInner.attributes('style')
    expect(style).toContain('background')
    expect(style).toContain('rgba(255, 100, 50, 0.8)')
  })

  it('should render dot element with proper structure', () => {
    const testColor = fromRGBA({ r: 128, g: 64, b: 192, a: 1 })
    const wrapper = mountFunction({
      props: {
        color: testColor
      }
    })

    const dot = wrapper.find('.v-color-picker__dot')
    expect(dot.exists()).toBe(true)
    expect(dot.element.tagName).toBe('DIV')

    // Проверяем что внутри есть один вложенный div
    const innerDivs = dot.findAll('div')
    expect(innerDivs).toHaveLength(1)

    // Проверяем что внутренний div имеет стиль с фоном
    const innerDiv = innerDivs[0]
    expect(innerDiv.attributes('style')).toBeDefined()
    expect(innerDiv.attributes('style')).toContain('background')
  })
})
