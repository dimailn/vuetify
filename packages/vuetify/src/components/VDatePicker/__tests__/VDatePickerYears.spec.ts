import VDatePickerYears from '../VDatePickerYears'
import {
  mount,
  MountingOptions,
  VueWrapper,
  enableAutoUnmount
} from '@vue/test-utils'

enableAutoUnmount(afterEach)

describe('VDatePickerYears.ts', () => {
  type Instance = InstanceType<typeof VDatePickerYears>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>
  beforeEach(() => {
    mountFunction = (options?: MountingOptions<Instance>) => {
      return mount(VDatePickerYears, {
        ...options,
        global: {
          mocks: {
            $vuetify: {
              rtl: false,
              lang: {
                t: () => {}
              }
            }
          }
        }
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: '2000'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should respect min/max props', async () => {
    const wrapper = mountFunction({
      props: {
        min: 1234,
        max: 1238
      }
    })

    expect(wrapper.findAll('li:first-child')[0].element.textContent).toBe('1238')
    expect(wrapper.findAll('li:last-child')[0].element.textContent).toBe('1234')
  })

  it('should not allow min to be greater then max', async () => {
    const wrapper = mountFunction({
      props: {
        min: 1238,
        max: 1234
      }
    })
    expect(wrapper.findAll('li')).toHaveLength(1)
    expect(wrapper.findAll('li')[0].element.textContent).toBe('1234')
    expect(wrapper.findAll('li')[0].element.textContent).toBe('1234')
  })

  it('should emit event on year click', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: 1999
      }
    })

    await wrapper.findAll('li.active + li')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1998])
  })

  it('should format years', async () => {
    const wrapper = mountFunction({
      props: {
        format: year => `(${year})`,
        min: 1001,
        max: 1001
      }
    })

    expect(wrapper.findAll('li')[0].element.textContent).toBe('(1001)')
  })
})
