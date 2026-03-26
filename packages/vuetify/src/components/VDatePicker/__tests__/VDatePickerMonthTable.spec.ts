import VDatePickerMonthTable from '../VDatePickerMonthTable'
import { Lang } from '../../../services/lang'

import { preset } from '../../../presets/default'
import {
  mount,
  MountOptions,
  Wrapper,
  enableAutoUnmount
} from '@vue/test-utils'

enableAutoUnmount(afterEach)

describe('VDatePickerMonthTable.ts', () => {
  type Instance = InstanceType<typeof VDatePickerMonthTable>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(VDatePickerMonthTable, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              lang: new Lang(preset)
            }
          }
        }
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        current: '2005-05',
        modelValue: '2005-11'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component and match snapshot (multiple)', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        current: '2005-05',
        modelValue: ['2005-11', '2005-10']
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it.skip('should watch tableDate value and run transition', async () => { // TODO: make this one work
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        current: '2005-05',
        modelValue: '2005-11'
      }
    })

    await wrapper.setProps({
      tableDate: '2006'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('table')[0].element.className).toBe('tab-transition-enter tab-transition-enter-active')
  })

  it.skip('should watch tableDate value and run reverse transition', async () => { // TODO: make this one work
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        current: '2005-05',
        modelValue: '2005-11'
      }
    })

    await wrapper.setProps({
      tableDate: '2004'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('table')[0].element.className).toBe('tab-reverse-transition-enter tab-reverse-transition-enter-active')
  })

  it('should emit event when month button is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        current: '2005-05',
        modelValue: '2005-11'
      }
    })

    await wrapper.findAll('tbody button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2005-01'])
  })

  it('should not emit event when disabled month button is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        current: '2005-05',
        modelValue: '2005-11',
        allowedDates: () => false
      }
    })

    await wrapper.findAll('tbody button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should emit tableDate event when scrolled and scrollable', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        scrollable: true
      }
    })

    await wrapper.trigger('wheel', { deltaY: 1 })
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual(['2006'])
  })

  it('should not emit tableDate event when scrolled and not scrollable', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005'
      }
    })

    await wrapper.trigger('wheel', { deltaY: 1 })
    expect(wrapper.emitted('update:table-date')).toBeFalsy()
  })

  it('should not emit tableDate event when scrollable but tableDate less than min', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        scrollable: true,
        min: '2005'
      }
    })

    await wrapper.trigger('wheel', { deltaY: -50 })
    expect(wrapper.emitted('update:table-date')).toBeFalsy()
  })

  it('should emit tableDate event when scrollable and tableDate greater than min', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        scrollable: true,
        min: '2003'
      }
    })

    await wrapper.trigger('wheel', { deltaY: -50 })
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual(['2004'])
  })

  // TODO
  it.skip('should emit tableDate event when swiped', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005'
      }
    })

    await wrapper.trigger('touchstart')
    await wrapper.trigger('touchend')
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual([2006])
  })

  it('should change tableDate when touch is called', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005'
      }
    })

    wrapper.vm.touch(1, wrapper.vm.calculateTableDate)
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual(['2006'])
    wrapper.vm.touch(-1, wrapper.vm.calculateTableDate)
    expect(wrapper.emitted('update:table-date')[1]).toEqual(['2004'])
  })

  it('should render component with events (array) and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        events: ['2005-07', '2005-11'],
        eventColor: 'red'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with events (function) and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        events: date => date === '2005-07' || date === '2005-11',
        eventColor: 'red'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with events colored by object and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        events: ['2005-07', '2005-11'],
        eventColor: { '2005-07': 'red', '2005-11': 'blue lighten-1' }
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with events colored by function and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005',
        events: ['2005-07', '2005-11'],
        eventColor: date => ({ '2005-07': 'red', '2005-11': 'blue lighten-1' }[date])
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
