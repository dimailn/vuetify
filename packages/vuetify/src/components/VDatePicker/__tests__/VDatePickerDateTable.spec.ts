import VDatePickerDateTable from '../VDatePickerDateTable'
import { Lang } from '../../../services/lang'
import { preset } from '../../../presets/default'
import {
  mount,
  MountOptions,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

enableAutoUnmount(afterEach)

describe('VDatePickerDateTable.ts', () => {
  type Instance = InstanceType<typeof VDatePickerDateTable>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(VDatePickerDateTable, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
              lang: new Lang(preset),
            },
          },
        },
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render readonly component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        readonly: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render disabled component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        disabled: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with showWeek and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2018-02',
        current: '2005-07',
        modelValue: null,
        firstDayOfWeek: 2,
        showWeek: true,
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component and match snapshot for multiple selection', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        multiple: true,
        selectedDates: ['2005-11-03', '2005-11-05', '2005-11-08'],
        modelValue: '2005-11-03',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with events (array) and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        events: ['2005-05-03'],
        eventColor: 'red',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with events (function) and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        events: date => date === '2005-05-03',
        eventColor: 'red',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with events colored by object and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        events: ['2005-05-03', '2005-05-04'],
        eventColor: { '2005-05-03': 'red', '2005-05-04': 'blue lighten-1' },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with events colored by function and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        events: ['2005-05-03', '2005-05-04'],
        eventColor: date => ({ '2005-05-03': 'red' }[date]),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with first day of week', function () {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        firstDayOfWeek: 2,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it.skip('should watch tableDate value and run transition', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
      },
    })

    await wrapper.setProps({
      tableDate: '2005-06',
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('table')[0].element.className).toBe('tab-transition-enter tab-transition-enter-active')
  })

  it.skip('should watch tableDate value and run reverse transition', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
      },
    })

    await wrapper.setProps({
      tableDate: '2005-04',
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('table')[0].element.className).toBe('tab-reverse-transition-enter tab-reverse-transition-enter-active')
  })

  it('should emit event when date button is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
      },
    })

    await wrapper.findAll('tbody button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2005-05-01'])
  })

  it('should not emit event when disabled month button is clicked', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        current: '2005-07',
        modelValue: '2005-11-03',
        allowedDates: () => false,
      },
    })

    await wrapper.findAll('tbody button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should emit tableDate event when scrolled and scrollable', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        scrollable: true,
      },
    })

    await wrapper.trigger('wheel', { deltaY: 1 })
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual(['2005-06'])
  })

  it('should not emit tableDate event when scrolled and not scrollable', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
      },
    })

    await wrapper.trigger('wheel', { deltaY: 1 })
    expect(wrapper.emitted('update:table-date')).toBeFalsy()
  })

  it('should not emit tableDate event when scrollable but tableDate less than min', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        scrollable: true,
        min: '2005-05',
      },
    })

    await wrapper.trigger('wheel', { deltaY: -50 })
    expect(wrapper.emitted('update:table-date')).toBeFalsy()
  })

  it('should emit tableDate event when scrollable and tableDate greater than min', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
        scrollable: true,
        min: '2005-03',
      },
    })

    await wrapper.trigger('wheel', { deltaY: -50 })
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual(['2005-04'])
  })

  // TODO
  it.skip('should emit tableDate event when swiped', async () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
      },
    })

    await wrapper.trigger('touchstart')
    await wrapper.trigger('touchend')
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual(['2005-06'])
  })

  it('should change tableDate when touch is called', () => {
    const wrapper = mountFunction({
      props: {
        tableDate: '2005-05',
      },
    })

    wrapper.vm.touch(1, wrapper.vm.calculateTableDate)
    expect(wrapper.emitted('update:table-date')).toBeTruthy()
    expect(wrapper.emitted('update:table-date')[0]).toEqual(['2005-06'])
    wrapper.vm.touch(-1, wrapper.vm.calculateTableDate)
    expect(wrapper.emitted('update:table-date')[1]).toEqual(['2005-04'])
  })
})
