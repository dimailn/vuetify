// Components
import VBreadcrumbsItem from '../VBreadcrumbsItem'

// Utilities
import {
  mount,
  VueWrapper,
  MountingOptions,
  enableAutoUnmount
} from '@vue/test-utils'

describe('VBreadcrumbsItem.ts', () => {
  type Instance = InstanceType<typeof VBreadcrumbsItem>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options: MountingOptions<Instance> = {}) => {
      return mount(VBreadcrumbsItem, {
        ...options
      })
    }
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with active & link state and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        link: true
      }
    })
    await wrapper.setData({
      isActive: true
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
