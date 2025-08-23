// Components
import VLabel from '../VLabel'

// Utilities
import {
  mount,
  VueWrapper,
} from '@vue/test-utils'

describe('VLabel', () => {
  type Instance = InstanceType<typeof VLabel>
  let mountFunction: (options?: any) => VueWrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VLabel, {
        ...options,
      })
    }
  })

  it('should have custom color', () => {
    const wrapper = mountFunction({
      props: {
        color: 'pink',
        focused: true,
      },
    })

    expect(wrapper.classes('pink--text')).toBe(true)
  })

  it('should position itself absolutely', () => {
    const wrapper = mountFunction({
      props: {
        absolute: true,
      },
    })

    expect(wrapper.element.style.position).toBe('absolute')
  })
})
