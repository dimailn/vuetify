// Components
import VCounter from '../VCounter'

// Utilities
import {
  mount,
  VueWrapper,
  enableAutoUnmount,
} from '@vue/test-utils'

describe('VCounter.ts', () => {
  let mountFunction: (props?: object) => VueWrapper<InstanceType<typeof VCounter>>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (props = {}) => {
      return mount(VCounter, {
        props,
      })
    }
  })

  it('should render component', () => {
    const wrapper = mountFunction({ value: 5, max: 10 })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component in error state', () => {
    const wrapper = mountFunction({ value: 15, max: 10 })

    expect(wrapper.classes('error--text')).toBe(true)
  })

  it('should render component if max is not provided', () => {
    const wrapper = mountFunction({ value: 15 })

    expect(wrapper.element.textContent).toBe('15')
  })
})
