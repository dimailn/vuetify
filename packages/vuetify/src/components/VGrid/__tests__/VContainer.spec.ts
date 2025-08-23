// Components
import VContainer from '../VContainer'

// Utilities
import {
  mount,
  MountingOptions,
  VueWrapper,
} from '@vue/test-utils'

describe('VContainer.ts', () => {
  type Instance = InstanceType<typeof VContainer>
  let mountFunction: (options?: MountingOptions<Instance>) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VContainer, {
        ...options,
      })
    }
  })

  it('should work', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
