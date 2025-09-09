import VDatePicker from '../VDatePicker'
import { Lang } from '../../../services/lang'
import {
  mount,
  MountOptions,
  Wrapper,
  enableAutoUnmount,
} from '@vue/test-utils'
import { createApp } from 'vue'
import { preset } from '../../../presets/default'
import en from '../../../locale/en'

enableAutoUnmount(afterEach)

describe('VDatePicker.ts', () => {
  type Instance = InstanceType<typeof VDatePicker>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountOptions<Instance>) => {
      return mount(VDatePicker, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
              lang: new Lang({
                ...preset,
              }),
              icons: {
                values: {
                  next: 'mdi-chevron-right',
                  prev: 'mdi-chevron-left',
                },
              },
            },
          },
        },
      })
    }
  })

  it('should emit input event on year click (reactive picker)', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        type: 'month',
        reactive: true,
      },
    })

    await wrapper.setData({
      internalActivePicker: 'YEAR',
    })

    const input = jest.fn()
    wrapper.vm.$on('input', input)

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    await wrapper.findAll('.v-date-picker-years li.active + li')[0].trigger('click')
    expect(input).toHaveBeenCalledWith('2012-05')
    expect(change).not.toHaveBeenCalled()
  })

  it('should render flat picker', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        flat: true,
        type: 'month',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render picker with elevation', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        elevation: 15,
        type: 'month',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not emit input event on year click if month is not allowed', async () => {
    const cb = jest.fn()
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        type: 'month',
        allowedDates: () => false,
      },
    })

    await wrapper.setData({
      internalActivePicker: 'YEAR',
    })

    wrapper.vm.$on('input', cb)
    await wrapper.findAll('.v-date-picker-years li.active + li')[0].trigger('click')
    expect(cb).not.toHaveBeenCalled()
  })

  it('should emit input event on month click', async () => {
    const cb = jest.fn()
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        type: 'month',
      },
    })

    wrapper.vm.$on('input', cb)
    await wrapper.findAll('.v-date-picker-table--month button')[0].trigger('click')
    expect(cb).toHaveBeenCalledWith('2013-01')
  })

  it('should be scrollable', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        type: 'month',
        scrollable: true,
      },
    })

    await wrapper.findAll('.v-date-picker-table--month')[0].trigger('wheel', { deltaY: 1 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableDate).toBe('2014')
  })

  it('should match snapshot with pick-month prop', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05-07',
        type: 'month',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with allowed dates as array', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        type: 'month',
        allowedDates: value => ['2013-01', '2013-03', '2013-05', '2013-07'].includes(value),
      },
    })

    expect(wrapper.findAll('.v-date-picker-table--month tbody')[0].html()).toMatchSnapshot()
  })

  it('should match snapshot with month formatting functions', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2005-11-01',
        type: 'month',
        monthFormat: date => `(${date.split('-')[1]})`,
      },
    })

    expect(wrapper.findAll('.v-date-picker-table--month tbody')[0].html()).toMatchSnapshot()
  })

  it('should match snapshot with colored picker & header', () => {
    const wrapper = mountFunction({
      props: {
        type: 'month',
        modelValue: '2005-11-01',
        color: 'primary',
        headerColor: 'orange darken-1',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with colored picker', () => {
    const wrapper = mountFunction({
      props: {
        type: 'month',
        modelValue: '2005-11-01',
        color: 'orange darken-1',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match change month when clicked on header arrow buttons', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2005-11',
        type: 'month',
      },
    })

    const [leftButton, rightButton] = wrapper.findAll('.v-date-picker-header button.v-btn')

    await leftButton.trigger('click')
    expect(wrapper.vm.tableDate).toBe('2004')

    await rightButton.trigger('click')
    expect(wrapper.vm.tableDate).toBe('2005')
  })

  it('should match change active picker when clicked on month button', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2005-11-01',
        type: 'month',
      },
    })

    const button = wrapper.findAll('.v-date-picker-header__value button')[0]

    await button.trigger('click')
    expect(wrapper.vm.internalActivePicker).toBe('YEAR')
  })

  it('should select year', async () => {
    const wrapper = mountFunction({
      props: {
        type: 'month',
        modelValue: '2005-11',
      },
    })

    await wrapper.setData({
      internalActivePicker: 'YEAR',
    })

    await wrapper.findAll('.v-date-picker-years li.active + li')[0].trigger('click')
    expect(wrapper.vm.internalActivePicker).toBe('MONTH')
    expect(wrapper.vm.tableDate).toBe('2004')
  })

  it('should set the table date when value has changed', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: null,
        type: 'month',
      },
    })

    await wrapper.setProps({ modelValue: '2005-11' })
    expect(wrapper.vm.tableDate).toBe('2005')
  })

  it('should use prev and next icons', () => {
    const wrapper = mountFunction({
      props: {
        type: 'month',
        prevIcon: 'block',
        nextIcon: 'check',
      },
    })

    const icons = wrapper.findAll('.v-date-picker-header .v-icon')
    expect(icons[0].element.textContent).toBe('block')
    expect(icons[1].element.textContent).toBe('check')
  })

  it('should display translated title', async () => {
    const wrapper = mountFunction({
      props: {
        multiple: true,
        type: 'month',
        modelValue: ['2013-05'],
      },
    })

    expect(wrapper.find('.v-date-picker-title__date').text()).toBe('May')

    await wrapper.setProps({
      modelValue: [],
    })
    expect(wrapper.find('.v-date-picker-title__date').text()).toBe('-')

    await wrapper.setProps({
      modelValue: ['2013-05', '2013-06', '2013-07'],
    })
    expect(wrapper.find('.v-date-picker-title__date').text()).toBe('3 selected')
  })

  it('should emit click/dblclick:month event', async () => {
    const click = jest.fn()
    const dblclick = jest.fn()
    const wrapper = mountFunction({
      props: {
        modelValue: '2013-05',
        type: 'month',
      },
      global: {
        listeners: {
          'click:month': (value: any, event: any) => click(value, event instanceof Event),
          'dblclick:month': (value: any, event: any) => dblclick(value, event instanceof Event),
        },
      },
    })

    await wrapper.findAll('.v-date-picker-table--month tbody tr+tr td:first-child button')[0].trigger('click')
    expect(click).toHaveBeenCalledWith('2013-04', true)

    await wrapper.findAll('.v-date-picker-table--month tbody tr+tr td:first-child button')[0].trigger('dblclick')
    expect(dblclick).toHaveBeenCalledWith('2013-04', true)
  })

  it('should handle date range select', async () => {
    const cb = jest.fn()
    const wrapper = mountFunction({
      props: {
        range: true,
        type: 'month',
        modelValue: [],
      },
    })
    const year = new Date().getFullYear()
    const toDate = `${year}-08`
    const fromDate = `${year}-03`

    wrapper.vm.$on('input', cb)
    await wrapper.find('.v-date-picker-table--month tbody tr:first-child td:nth-child(3) button').trigger('click')
    expect(cb.mock.calls[0][0]).toEqual(
      expect.arrayContaining([fromDate])
    )

    await wrapper.find('.v-date-picker-table--month tbody tr:first-child+tr+tr td:nth-child(2) button').trigger('click')
    expect(cb.mock.calls[0][0][0]).toBe(fromDate)
    expect(cb.mock.calls[1][0][0]).toBe(toDate)
  })

  it('should add class for the first and last days in range', async () => {
    const wrapper = mountFunction({
      props: {
        range: true,
        showCurrent: '2019',
        type: 'month',
        modelValue: ['2019-01', '2019-02'],
      },
    })

    expect(wrapper.findAll('.v-date-picker-table--month tbody button.v-date-picker--first-in-range')
      .exists()).toBe(true)
    expect(wrapper.findAll('.v-date-picker-table--month tbody button.v-date-picker--last-in-range')
      .exists()).toBe(true)
  })
})
