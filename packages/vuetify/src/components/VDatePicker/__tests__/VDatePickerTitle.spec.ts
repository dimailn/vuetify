import VDatePickerTitle from '../VDatePickerTitle'
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VDatePickerTitle.ts', () => {
  type Instance = InstanceType<typeof VDatePickerTitle>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VDatePickerTitle, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              icons: {
                values: {
                  next: 'mdi-chevron-right',
                  prev: 'mdi-chevron-left',
                },
                component: 'mdi',
              },
            },
          },
        },
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        year: '1234',
        date: '2005-11-01',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render disabled component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        year: '1234',
        date: '2005-11-01',
        disabled: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render readonly component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        year: '1234',
        date: '2005-11-01',
        readonly: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component when selecting year and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        year: '1234',
        date: '2005-11-01',
        selectingYear: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render year icon', () => {
    const wrapper = mountFunction({
      props: {
        year: '1234',
        yearIcon: 'year',
        date: '2005-11-01',
      },
    })

    expect(wrapper.findAll('.v-date-picker-title__year')[0].html()).toMatchSnapshot()
  })

  it('should emit input event on year/date click', async () => {
    const wrapper = mountFunction({
      props: {
        year: '1234',
        yearIcon: 'year',
        date: '2005-11-01',
      },
    })

    // Клик по дате не должен эмитить событие
    await wrapper.findAll('.v-date-picker-title__date')[0].trigger('click')
    expect(wrapper.emitted('update:selecting-year')).toBeFalsy()

    // Клик по году должен эмитить true
    await wrapper.findAll('.v-date-picker-title__year')[0].trigger('click')
    expect(wrapper.emitted('update:selecting-year')).toHaveLength(1)
    expect(wrapper.emitted('update:selecting-year')[0]).toEqual([true])

    // Клик по дате должен эмитить false (переключение обратно)
    await wrapper.findAll('.v-date-picker-title__date')[0].trigger('click')
    expect(wrapper.emitted('update:selecting-year')).toHaveLength(2)
    expect(wrapper.emitted('update:selecting-year')[1]).toEqual([false])
  })

  it('should have the correct transition', async () => {
    const wrapper = mountFunction({
      props: {
        year: '2018',
        date: 'Tue, Mar 3',
        modelValue: '2018-03-03',
      },
    })

    expect(wrapper.vm.isReversing).toBe(false)

    await wrapper.setProps({
      date: 'Wed, Mar 4',
      modelValue: '2018-03-04',
    })

    expect(wrapper.vm.isReversing).toBe(false)

    await wrapper.setProps({
      date: 'Wed, Mar 3',
      modelValue: '2018-03-03',
    })

    expect(wrapper.vm.isReversing).toBe(true)
  })
})
