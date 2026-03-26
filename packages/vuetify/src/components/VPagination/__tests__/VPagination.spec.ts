import VPagination from '../VPagination'
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'
import { h } from 'vue'
import { Lang } from '../../../services/lang'
import { preset } from '../../../presets/default'

describe('VPagination.ts', () => {
  type Instance = InstanceType<typeof VPagination>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    jest.useFakeTimers()

    mountFunction = (options?: MountingOptions<Instance>) => {
      const vuetifyInstance = {
        rtl: false,
        icons: {
          values: {
            next: 'mdi-chevron-right',
            prev: 'mdi-chevron-left'
          }
        },
        lang: new Lang(preset)
      }

      return mount(VPagination, {
        global: {
          config: {
            globalProperties: {
              $vuetify: vuetifyInstance
            }
          },
          mocks: {
            $vuetify: vuetifyInstance
          }
        },
        ...options
      })
    }
  })

  it('emits an event when next or previous is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        length: 5,
        modelValue: 2
      }
    })
    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    const navigation = wrapper.findAll('.v-pagination__navigation')
    navigation[0].trigger('click')
    navigation[1].trigger('click')

    expect(wrapper.emitted('previous')).toBeTruthy()
    expect(wrapper.emitted('next')).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component in RTL mode and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        length: 5,
        modelValue: 2
      }
    })
    wrapper.vm.$vuetify.rtl = true
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.vm.$vuetify.rtl = undefined
  })

  it('emits an event when pagination item is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        length: 5,
        modelValue: 2
      }
    })
    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    const navigation = wrapper.findAll('.v-pagination__item')
    navigation[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('should render disabled buttons with length equals to 0', async () => {
    const wrapper = mountFunction({
      props: {
        length: 0,
        modelValue: 1
      }
    })
    jest.runAllTimers()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should watch the value', async () => {
    const wrapper = mountFunction({
      props: {
        length: 5,
        modelValue: 1
      }
    })

    jest.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selected).toBe(1)

    await wrapper.setProps({ modelValue: 2 })
    jest.advanceTimersByTime(150)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selected).toBe(2)
  })

  it('should only render start and end of range if length is big', async () => {
    const wrapper = mountFunction({
      props: {
        length: 100,
        modelValue: 1
      }
    })
    jest.runAllTimers()

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    jest.advanceTimersByTime(150)

    // Force maxButtons to be set and trigger re-render
    wrapper.vm.maxButtons = 5
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.findAll('.v-pagination__more')).toHaveLength(1)
  })

  it('should only render middle of range if length is big and value is somewhere in the middle', async () => {
    const wrapper = mountFunction({
      props: {
        length: 100,
        modelValue: 50
      }
    })
    jest.runAllTimers()

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    jest.advanceTimersByTime(150)

    // Force maxButtons to be set and trigger re-render
    wrapper.vm.maxButtons = 5
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.findAll('.v-pagination__more')).toHaveLength(2)
  })

  it('should only render start of range if value is equals "left"', async () => {
    const wrapper = mountFunction({
      props: {
        length: 100,
        totalVisible: 5
      }
    })
    const maxLength = Number(wrapper.vm.totalVisible)
    const left = Math.ceil(maxLength / 2)
    wrapper.setProps({ modelValue: left })
    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.findAll('.v-pagination__more')).toHaveLength(1)
  })

  it('should only render end of range if value is equals "right"', async () => {
    const wrapper = mountFunction({
      props: {
        length: 100,
        totalVisible: 5
      }
    })
    const maxLength = Number(wrapper.vm.totalVisible)
    const even = maxLength % 2 === 0 ? 1 : 0
    const left = Math.ceil(maxLength / 2)
    const right = wrapper.vm.length - left + 1 + even
    wrapper.setProps({ modelValue: right })
    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.findAll('.v-pagination__more')).toHaveLength(1)
  })

  it('should use totalVisible prop if defined', async () => {
    const wrapper = mountFunction({
      props: {
        length: 100,
        modelValue: 50,
        totalVisible: 10
      }
    })
    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.findAll('.v-pagination__more')).toHaveLength(2)
    expect(wrapper.findAll('.v-pagination__item')).toHaveLength(8)
  })

  it('should set from to 1 if <= 0', () => {
    const wrapper = mountFunction()

    expect(wrapper.vm.range(1, 2)).toEqual([1, 2])
    expect(wrapper.vm.range(0, 2)).toEqual([1, 2])
  })

  // Since we have no DOM access, test the expected outcome
  // even if it's not real world, so that we can detect changes
  it('should use parents width for on resize calculation', () => {
    const wrapper = mount({
      render: () => h('div', [h(VPagination)])
    })

    const pagination = wrapper.findComponent(VPagination)

    expect(pagination.vm.maxButtons).toBe(22)

    pagination.vm.onResize()

    expect(pagination.vm.maxButtons).toBe(-3)
  })

  // https://github.com/vuetifyjs/vuetify/issues/7947
  it('should never show more than the max number of allowed buttons', () => {
    const wrapper = mountFunction({
      data: () => ({
        maxButtons: 4
      }),

      props: {
        length: 40,
        totalVisible: 10
      }
    })

    wrapper.setData({ maxButtons: 4 })

    expect(wrapper.vm.items).toHaveLength(4)

    wrapper.setData({ maxButtons: 12 })

    expect(wrapper.vm.items).toHaveLength(10)
  })

  it('should never show more than the number of total visible buttons', async () => {
    const wrapper = mountFunction({
      data: () => ({
        maxButtons: 0
      }),

      props: {
        length: 5,
        totalVisible: undefined
      }
    })

    expect(wrapper.vm.items).toHaveLength(5)

    wrapper.setProps({ length: 40 })

    wrapper.setData({ maxButtons: 0 })
    wrapper.setProps({ totalVisible: 10 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.items).toHaveLength(10)

    wrapper.setData({ maxButtons: 11 })
    wrapper.setProps({ totalVisible: undefined })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.items).toHaveLength(11)

    wrapper.setData({ maxButtons: 12 })
    wrapper.setProps({ totalVisible: 13 })
    expect(wrapper.vm.items).toHaveLength(12)
  })

  it('should return length when maxButtons is less than 1', () => {
    const wrapper = mountFunction({
      data: () => ({ maxButtons: -3 }),
      props: { length: 4 }
    })

    expect(wrapper.vm.items).toEqual([1, 2, 3, 4])
  })
})
