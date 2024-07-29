// Libraries
import {h} from 'vue'

// Components
import VRating from '../VRating'

// Utilities
import {
  mount
} from '@vue/test-utils'
import { mergeDeep } from '../../../util/helpers'


const $vuetify = {
  rtl: false,
  icons: {
    values: {
    //   ratingEmpty: "mdi-star-outline",
    //   ratingFull: 'mdi-star'
    }
  },
  lang: {
    t: str => str,
  },
}

describe('VRating.ts', () => {
  // type Instance = ExtractVue<typeof VRating>
  let mountFunction//: (options?: object) => Wrapper<Instance>

  beforeEach(() => {
    mountFunction = (options: MountOptions<Instance>) => {
      return mount(VRating, mergeDeep({
        // https://github.com/vuejs/vue-test-utils/issues/1130
        global: {
          config: {
            globalProperties: {
              $vuetify,
              $createElement: h
            }
          }
        },
      }, options))
    }
  })

  it('should not register directives if readonly or !ripple', async () => {
    const wrapper = mountFunction({
      props: {
        readonly: true,
      },
    })

    expect(wrapper.vm.directives[0][1].isDirActive).toBe(false)

    wrapper.setProps({ readonly: false })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.directives[0][1].isDirActive).toBe(true)

    wrapper.setProps({ ripple: false })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.directives[0][1].isDirActive).toBe(false)
  })

  it('should respond to internal and prop value changes', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.internalValue).toBe(0)

    wrapper.setProps({ modelValue: 1 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toBe(1)

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')

    const icon = wrapper.findAll('.v-icon').at(1)

    icon.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(2)
  })

  it('should not null the rating if clicked on the current value unless clearable', async () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.internalValue).toBe(0)

    wrapper.setProps({ modelValue: 1, clearable: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toBe(1)

    const icon = wrapper.find('.v-icon')

    icon.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toBe(1)

    wrapper.setProps({ clearable: true })

    await wrapper.vm.$nextTick()

    icon.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalValue).toBe(0)
  })

  it('should not react to events when readonly', async () => {
    const wrapper = mountFunction({
      props: {
        readonly: true,
      },
    })

    const icon = wrapper.find('.v-icon')

    icon.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')

    wrapper.setProps({ readonly: false })

    await wrapper.vm.$nextTick()

    icon.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(1)
  })

  it('should change hover index on mouse action', async () => {
    jest.useFakeTimers()

    const wrapper = mountFunction({
      props: {
        hover: true,
      },
    })

    const icons = wrapper.findAll('.v-icon')
    const icon1 = icons.at(0)
    const icon2 = icons.at(3)

    expect(wrapper.vm.hoverIndex).toBe(-1)

    icon1.trigger('mouseenter')

    jest.runAllTimers()

    expect(wrapper.vm.hoverIndex).toBe(1)

    icon2.trigger('mouseenter')

    jest.runAllTimers()

    expect(wrapper.vm.hoverIndex).toBe(4)
  })

  it('should check for half event', async () => {
    const wrapper = mountFunction()

    const event = new MouseEvent('hover')
    expect(wrapper.vm.genHoverIndex(event, 1)).toBe(2)

    wrapper.setProps({ halfIncrements: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.genHoverIndex({
      pageX: 0,
      target: {
        getBoundingClientRect: () => ({ width: 10, left: 0 }),
      },
    }, 1)).toBe(1.5)

    expect(wrapper.vm.genHoverIndex({
      pageX: 6,
      target: {
        getBoundingClientRect: () => ({ width: 10, left: 0 }),
      },
    }, 1)).toBe(2)
  })

  it('should check for half event in rtl', async () => {
    const wrapper = mountFunction({
      props: { halfIncrements: true },
      global: {
        config: {
          globalProperties: {
            $vuetify: {
              rtl: true,
            }
          }
        }
      }
    })

    const event = new MouseEvent('hover')
    expect(wrapper.vm.genHoverIndex(event, 1)).toBe(1.5)

    wrapper.setProps({ halfIncrements: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.genHoverIndex({
      pageX: 0,
      target: {
        getBoundingClientRect: () => ({ width: 10, left: 0 }),
      },
    }, 1)).toBe(2)

    expect(wrapper.vm.genHoverIndex({
      pageX: 6,
      target: {
        getBoundingClientRect: () => ({ width: 10, left: 0 }),
      },
    }, 1)).toBe(1.5)
  })

  it('should render a scoped slot', () => {
    const itemSlot = () => [h('span', 'foobar')]

    const component = {
      render: () => h(VRating, {}, {item: itemSlot})
    }

    const wrapper = mount(component, {
      // https://github.com/vuejs/vue-test-utils/issues/1130
      sync: false,
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should bind mousemove listener', () => {
    const wrapper = mountFunction({
      props: {
        halfIncrements: true,
        hover: true,
      }
    })
    const onMouseEnter = jest.fn()

    wrapper.vm.onMouseEnter = onMouseEnter

    const icon = wrapper.find('.v-icon')

    icon.trigger('mousemove')

    expect(onMouseEnter).toHaveBeenCalled()
  })

  it('should reset hoverIndex on mouse leave', () => {
    jest.useFakeTimers()
    const wrapper = mountFunction({
      propsData: { hover: true },
    })

    const icon = wrapper.find('.v-icon')

    expect(wrapper.vm.hoverIndex).toBe(-1)

    icon.trigger('mouseenter')
    jest.runAllTimers()

    expect(wrapper.vm.hoverIndex).toBe(1)

    icon.trigger('mouseleave')
    jest.runAllTimers()

    expect(wrapper.vm.hoverIndex).toBe(-1)
  })
})
