// Components
import VRadio from '../VRadio'
import VRadioGroup from '../VRadioGroup'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper
} from '@vue/test-utils'

describe('VRadioGroup.ts', () => {
  type Instance = InstanceType<typeof VRadioGroup>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VRadioGroup, options)
    }
  })

  it('should match snapshot', async () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match dense snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        dense: true
      },
      slots: {
        default: [VRadio]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render group label as legend without for attribute', () => {
    const wrapper = mountFunction({
      props: {
        label: 'Radio group label'
      },
      slots: {
        default: [VRadio]
      }
    })

    const legend = wrapper.find('legend')

    expect(legend.exists()).toBe(true)
    expect(legend.text()).toBe('Radio group label')
    expect(legend.attributes('id')).toBeTruthy()
    expect(legend.attributes('for')).toBeUndefined()
    expect(legend.attributes('aria-hidden')).toBe('false')
  })
})
