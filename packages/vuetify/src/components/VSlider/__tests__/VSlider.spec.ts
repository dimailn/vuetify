// Components
import VSlider from '../VSlider'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

/* eslint-disable max-statements */
describe('VSlider.ts', () => {
  type Instance = InstanceType<typeof VSlider>
  let mountFunction: (options?: object) => VueWrapper<Instance>
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
    el.setAttribute('data-app', 'true')
    document.body.appendChild(el)
    mountFunction = (options = {}) => {
      return mount(VSlider, {
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
            },
          },
        },
        ...options,
      })
    }
  })

  // Включаем автоматическое размонтирование компонентов после каждого теста
  enableAutoUnmount(afterEach)

  it('should match a snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render vertical slider', async () => {
    const wrapper = mountFunction({
      props: {
        vertical: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with ticks and match a snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        ticks: true,
        step: 25,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ ticks: 'always' })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with thumbLabel and match a snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        thumbLabel: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ thumbLabel: 'always' })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set tabindex in disabled component', () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
    })

    const slider = wrapper.find('.v-slider__thumb-container')

    expect(slider.element.getAttribute('tabindex')).toBe('-1')
  })

  it('should not allow values outside of min/max', async () => {
    const wrapper = mountFunction({
      props: {
        min: 2,
        max: 4,
      },
    })

    await wrapper.setProps({ modelValue: 0 })
    const events1 = wrapper.emitted('update:modelValue') as any[][]
    expect(events1[events1.length - 1]).toEqual([2])

    await wrapper.setProps({ modelValue: 5 })
    const events2 = wrapper.emitted('update:modelValue') as any[][]
    expect(events2[events2.length - 1]).toEqual([4])
  })

  it('should adjust value if min/max props change', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
      },
    })

    await wrapper.setProps({ min: 6 })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])

    await wrapper.setProps({ max: 4 })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([4])
  })

  it('should round value with offset correct', async () => {
    const wrapper = mountFunction({
      props: {
        min: 3,
        max: 15,
        step: 3,
      },
    })

    await wrapper.setProps({ modelValue: 5 })
    const events1 = wrapper.emitted('update:modelValue') as any[][]
    expect(events1[events1.length - 1]).toEqual([6])

    await wrapper.setProps({ modelValue: 7 })
    const events2 = wrapper.emitted('update:modelValue') as any[][]
    expect(events2[events2.length - 1]).toEqual([6])
  })

  it('should react to keydown event', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 50,
      },
    })

    const slider = wrapper.find('.v-slider__thumb-container')

    await slider.trigger('keydown.space')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    await slider.trigger('keydown.left')
    const events1 = wrapper.emitted('update:modelValue') as any[][]
    expect(events1[events1.length - 1]).toEqual([49])

    await slider.trigger('keydown.right')
    const events2 = wrapper.emitted('update:modelValue') as any[][]
    expect(events2[events2.length - 1]).toEqual([50])

    await slider.trigger('keydown.home')
    const events3 = wrapper.emitted('update:modelValue') as any[][]
    expect(events3[events3.length - 1]).toEqual([0])

    await slider.trigger('keydown.end')
    const events4 = wrapper.emitted('update:modelValue') as any[][]
    expect(events4[events4.length - 1]).toEqual([100])

    await slider.trigger('keydown.pagedown')
    const events5 = wrapper.emitted('update:modelValue') as any[][]
    expect(events5[events5.length - 1]).toEqual([90])

    await slider.trigger('keydown.pageup')
    const events6 = wrapper.emitted('update:modelValue') as any[][]
    expect(events6[events6.length - 1]).toEqual([100])

    await wrapper.setProps({ step: 4 })
    await slider.trigger('keydown.pagedown')
    const events7 = wrapper.emitted('update:modelValue') as any[][]
    expect(events7[events7.length - 1]).toEqual([60])

    await wrapper.setProps({ step: 2 })
    await slider.trigger('keydown.pageup')
    const events8 = wrapper.emitted('update:modelValue') as any[][]
    expect(events8[events8.length - 1]).toEqual([80])

    await wrapper.setProps({ max: 1000 })
    await slider.trigger('keydown.pageup')
    const events9 = wrapper.emitted('update:modelValue') as any[][]
    expect(events9[events9.length - 1]).toEqual([180])

    await wrapper.setProps({ max: 100 })

    // После изменения max, значение должно быть ограничено до 100
    // Нужно обновить modelValue чтобы симулировать поведение родительского компонента
    const maxChangeEvents = wrapper.emitted('update:modelValue') as any[][]
    const newValue = maxChangeEvents[maxChangeEvents.length - 1][0]
    await wrapper.setProps({ modelValue: newValue })

    await slider.trigger('keydown.left', {
      shiftKey: true,
    })
    const events10 = wrapper.emitted('update:modelValue') as any[][]
    expect(events10[events10.length - 1]).toEqual([94])

    await slider.trigger('keydown.right', {
      ctrlKey: true,
    })
    const events11 = wrapper.emitted('update:modelValue') as any[][]
    expect(events11[events11.length - 1]).toEqual([98])

    await wrapper.setProps({ disabled: true })
    const eventsBeforeDisabled = wrapper.emitted('update:modelValue')?.length || 0
    await slider.trigger('keydown.left')
    // Количество событий не должно измениться
    expect(wrapper.emitted('update:modelValue')?.length).toBe(eventsBeforeDisabled)

    await wrapper.setProps({ disabled: false })

    // Устанавливаем RTL режим
    await wrapper.setProps({})
    wrapper.vm.$vuetify.rtl = true

    await slider.trigger('keydown.right', {
      shiftKey: true,
    })
    const events12 = wrapper.emitted('update:modelValue') as any[][]
    expect(events12[events12.length - 1]).toEqual([92])
  })

  it('should add for to label', () => {
    const wrapper = mountFunction({
      props: {
        label: 'bar',
      },
      attrs: { id: 'foo' },
    })

    const label = wrapper.find('.v-label')
    expect(label.element.getAttribute('for')).toBe('foo')

    const wrapper2 = mountFunction({
      props: {
        label: 'bar',
      },
    })

    const label2 = wrapper2.find('.v-label')
    expect(label2.element.getAttribute('for')).toBe(`input-${(wrapper2.vm as any).$.uid}`)
  })

  it('should deactivate', async () => {
    const wrapper = mountFunction()
    const container = wrapper.find('.v-slider__thumb-container')

    expect(wrapper.vm.isActive).toBe(false)
    await container.trigger('mousedown')
    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should react to touch', async () => {
    const wrapper = mountFunction()
    const container = wrapper.find('.v-slider__thumb-container')

    expect(wrapper.vm.thumbPressed).toBe(false)
    expect(wrapper.vm.isActive).toBe(false)

    await container.trigger('mousedown')
    expect(wrapper.vm.thumbPressed).toBe(true)
    expect(wrapper.vm.isActive).toBe(true)

    wrapper.vm.app.dispatchEvent(new Event('mouseup'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.thumbPressed).toBe(false)
    expect(wrapper.vm.isActive).toBe(false)

    await container.trigger('touchstart', {
      touches: [{}],
    })
    expect(wrapper.vm.thumbPressed).toBe(true)
    expect(wrapper.vm.isActive).toBe(true)

    wrapper.vm.app.dispatchEvent(new Event('touchend'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.thumbPressed).toBe(false)
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should return a rounded value', async () => {
    const wrapper = mountFunction({
      props: { step: 0 },
    })

    expect(wrapper.vm.roundValue(1.234)).toBe(1.234)

    await wrapper.setProps({ step: 1 })
    expect(wrapper.vm.roundValue(1.234)).toBe(1)

    await wrapper.setProps({ step: 4 })
    expect(wrapper.vm.roundValue(5.667)).toBe(4)
    expect(wrapper.vm.roundValue(7.667)).toBe(8)

    await wrapper.setProps({ step: 2.5 })
    expect(wrapper.vm.roundValue(5.667)).toBe(5)
  })

  it('should return a rounded value with offset', async () => {
    const wrapper = mountFunction({
      props: { step: 0 },
    })

    expect(wrapper.vm.roundValue(1.234)).toBe(1.234)

    await wrapper.setProps({ step: 1 })
    expect(wrapper.vm.roundValue(1.234)).toBe(1)

    await wrapper.setProps({ step: 4, min: 2 })
    expect(wrapper.vm.roundValue(5.667)).toBe(6)
    expect(wrapper.vm.roundValue(7.667)).toBe(6)

    await wrapper.setProps({ step: 2.5, min: 5 })
    expect(wrapper.vm.roundValue(5.667)).toBe(5)
  })

  it('should return a rounded value bounded by min and max', async () => {
    const wrapper = mountFunction({
      props: {
        min: 5,
        max: 10,
      },
    })

    await wrapper.setProps({ modelValue: 1 })
    expect(wrapper.vm.internalValue).toBe(5)

    await wrapper.setProps({ modelValue: 15 })
    expect(wrapper.vm.internalValue).toBe(10)
  })

  it('should not update if value matches lazy value', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 10,
      },
    })

    expect(wrapper.vm.lazyValue).toBe(10)

    wrapper.vm.internalValue = 15
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
    expect(wrapper.vm.lazyValue).toBe(15)

    wrapper.vm.internalValue = 15
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
  })

  it('should react to input events', async () => {
    const wrapper = mountFunction()
    const focus = jest.fn()
    const blur = jest.fn()

    wrapper.vm.$on('focus', focus)
    wrapper.vm.$on('blur', blur)

    const input = wrapper.find('.v-slider__thumb-container')

    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.isFocused).toBe(false)

    await input.trigger('focus')
    expect(wrapper.vm.isFocused).toBe(true)
    expect(wrapper.emitted('focus')?.length).toBe(1)

    await input.trigger('blur')
    expect(wrapper.vm.isFocused).toBe(false)
    expect(wrapper.emitted('blur')?.length).toBe(1)
  })

  it('should call mousemove and emit change', () => {
    const wrapper = mountFunction()
    const input = wrapper.find('.v-slider')

    input.trigger('click')
    expect(wrapper.emitted('change')?.length).toBe(1)
  })

  it('should keep thumb-label when focused and clicked', async () => {
    const wrapper = mountFunction({
      props: {
        thumbLabel: true,
      },
    })

    const input = wrapper.find('.v-slider__thumb-container')
    const thumb = wrapper.find('.v-slider__thumb-container')

    await input.trigger('focus')

    expect(wrapper.vm.showThumbLabel).toBe(true)
    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.isFocused).toBe(true)

    // Clicking thumb label triggers blur
    await thumb.trigger('mousedown')
    await input.trigger('blur')

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.isFocused).toBe(false)
  })

  it('should reverse label location when inverse', async () => {
    const wrapper = mountFunction({
      props: { label: 'foo' },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ inverseLabel: true })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should change track styles in rtl', async () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ modelValue: 50 })
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ disabled: true })
    expect(wrapper.html()).toMatchSnapshot()

    wrapper.vm.$vuetify.rtl = true
    await wrapper.setProps({ modelValue: 0, disabled: false })
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ modelValue: 50 })
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ disabled: true })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display label and have different aria-label', () => {
    const wrapper = mountFunction({
      props: { label: 'foo' },
      attrs: { 'aria-label': 'bar' },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display tick labels', () => {
    const wrapper = mountFunction({
      props: {
        max: 1,
        tickLabels: ['foo', 'bar'],
      },
    })

    const ticks = wrapper.findAll('.v-slider__tick')

    expect(ticks).toHaveLength(2)
    expect((ticks[0].element.firstChild as HTMLElement).innerHTML).toBe('foo')
    expect((ticks[1].element.firstChild as HTMLElement).innerHTML).toBe('bar')
  })

  it('should not react to keydown if disabled', async () => {
    const wrapper = mountFunction({
      props: { disabled: true, modelValue: 50 },
    })

    const input = wrapper.find('.v-slider__thumb-container')

    // Тестируем disabled состояние
    await input.trigger('keydown.right')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    // Тестируем readonly состояние
    await wrapper.setProps({
      disabled: false,
      readonly: true,
    })
    await input.trigger('keydown.right')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    // Тестируем нормальное состояние
    await wrapper.setProps({
      disabled: false,
      readonly: false,
    })
    const eventsBefore = wrapper.emitted('update:modelValue')?.length || 0
    await input.trigger('keydown.right')
    const eventsAfter = wrapper.emitted('update:modelValue')?.length || 0
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(eventsAfter).toBeGreaterThan(eventsBefore)
  })

  it('should set value to min value if given a NaN value', () => {
    const wrapper = mountFunction({
      props: {
        min: -20,
        max: 20,
        modelValue: NaN,
      },
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([-20])
  })

  it('should correctly handle initial value of zero (#7320)', () => {
    const wrapper = mountFunction({
      props: {
        min: -20,
        max: 20,
        modelValue: 0,
      },
    })

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not fire event if value is provided and valid', async () => {
    const wrapper = mountFunction({
      props: { modelValue: 10, min: -20 },
    })

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    // Should set to min value if invalid
    const wrapper2 = mountFunction({
      props: { modelValue: NaN, min: -20 },
    })

    expect(wrapper2.emitted('update:modelValue')?.[0]).toEqual([-20])
  })

  it('should not fire change event onKeyDown if value is invalid', () => {
    const wrapper = mountFunction({
      props: { min: 1 },
    })

    const slider = wrapper.find('.v-slider__thumb-container')
    slider.trigger('keydown.left')
    expect(wrapper.emitted('change')).toBeFalsy()
  })
})
